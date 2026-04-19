import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import React from 'react';

/* -----------------------------------------------------------------------
   Mocks
   ----------------------------------------------------------------------- */

const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockToast = { success: vi.fn(), error: vi.fn(), info: vi.fn() };

vi.mock('../src/hooks/useAuth_Preetam', () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
    isLoading: false,
    isAuthenticated: false,
    user: null,
  }),
}));

vi.mock('../src/components/shared/Toast_Sasi', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('../src/components/shared/LoadingSpinner_Pratham', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

import LoginForm from '../src/components/auth/LoginForm_Preetam';
import RegisterForm from '../src/components/auth/RegisterForm_Preetam';
import ProtectedRoute from '../src/components/auth/ProtectedRoute_Preetam';

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

/* -----------------------------------------------------------------------
   LoginForm
   ----------------------------------------------------------------------- */

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email and password fields with a submit button', () => {
    renderWithRouter(<LoginForm />);

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email format', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm />);

    await user.type(screen.getByPlaceholderText('you@example.com'), 'notanemail');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('calls login with correct data on valid submission', async () => {
    mockLogin.mockResolvedValueOnce({});
    const user = userEvent.setup();
    renderWithRouter(<LoginForm />);

    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'SecurePass123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'SecurePass123');
    });
  });

  it('renders sign-up and forgot-password links', () => {
    renderWithRouter(<LoginForm />);

    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });
});

/* -----------------------------------------------------------------------
   RegisterForm
   ----------------------------------------------------------------------- */

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all registration fields', () => {
    renderWithRouter(<RegisterForm />);

    expect(screen.getByText('Create account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Create a strong password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RegisterForm />);

    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });

  it('validates password strength requirements', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RegisterForm />);

    await user.type(screen.getByPlaceholderText('John'), 'Jane');
    await user.type(screen.getByPlaceholderText('Doe'), 'Smith');
    await user.type(screen.getByPlaceholderText('you@example.com'), 'jane@test.com');
    await user.type(screen.getByPlaceholderText('Create a strong password'), 'weak');
    await user.type(screen.getByPlaceholderText('Confirm your password'), 'weak');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('shows password strength indicator when typing', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RegisterForm />);

    await user.type(screen.getByPlaceholderText('Create a strong password'), 'StrongPass1!');

    await waitFor(() => {
      expect(screen.getByText(/(strong|very strong)/i)).toBeInTheDocument();
    });
  });

  it('validates passwords match', async () => {
    const user = userEvent.setup();
    renderWithRouter(<RegisterForm />);

    await user.type(screen.getByPlaceholderText('John'), 'Jane');
    await user.type(screen.getByPlaceholderText('Doe'), 'Smith');
    await user.type(screen.getByPlaceholderText('you@example.com'), 'jane@test.com');
    await user.type(screen.getByPlaceholderText('Create a strong password'), 'StrongPass1');
    await user.type(screen.getByPlaceholderText('Confirm your password'), 'DifferentPass1');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('renders a link to the login page', () => {
    renderWithRouter(<RegisterForm />);
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
  });
});

/* -----------------------------------------------------------------------
   ProtectedRoute
   ----------------------------------------------------------------------- */

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to /login', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
