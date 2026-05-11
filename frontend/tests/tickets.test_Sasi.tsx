import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

/* -----------------------------------------------------------------------
   Mocks
   ----------------------------------------------------------------------- */

vi.mock('../src/utils/cn_Pratham', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

vi.mock('../src/utils/formatDate_Sasi', () => ({
  formatDateTime: (d: string) => new Date(d).toLocaleString(),
}));

vi.mock('../src/utils/formatCurrency_Sasi', () => ({
  formatPrice: (price: number, isFree: boolean) =>
    isFree ? 'Free' : `$${price.toFixed(2)}`,
}));

vi.mock('qrcode.react', () => ({
  QRCodeCanvas: ({ value }: { value: string }) => (
    <canvas data-testid="qr-canvas" data-value={value} />
  ),
}));

import TicketSelector from '../src/components/tickets/TicketSelector_Sasi';
import TicketCard from '../src/components/tickets/TicketCard_Sasi';
import RSVPButton from '../src/components/tickets/RSVPButton_Sasi';
import QRCodeDisplay from '../src/components/tickets/QRCodeDisplay_Sasi';

/* -----------------------------------------------------------------------
   Fixtures
   ----------------------------------------------------------------------- */

const ticketTypes = [
  {
    id: 'tt-1',
    name: 'General Admission',
    price: 25,
    quantity: 100,
    sold_count: 30,
    description: 'Standard entry ticket',
  },
  {
    id: 'tt-2',
    name: 'VIP',
    price: 75,
    quantity: 20,
    sold_count: 20,
    description: 'VIP access with lounge',
  },
  {
    id: 'tt-3',
    name: 'Free Entry',
    price: 0,
    quantity: 200,
    sold_count: 50,
  },
];

const sampleTicket = {
  id: 'tkt-1',
  ticket_number: 'EVT-2026-001234',
  event: {
    id: 'evt-1',
    title: 'Music Festival 2026',
    start_date: '2026-07-20T18:00:00Z',
    image_url: 'https://example.com/festival.jpg',
  },
  ticket_type: 'General Admission',
  status: 'confirmed' as const,
  purchase_date: '2026-06-15T10:30:00Z',
  amount_paid: 25,
};

/* -----------------------------------------------------------------------
   TicketSelector
   ----------------------------------------------------------------------- */

describe('TicketSelector', () => {
  it('renders all ticket types with their names and prices', () => {
    const onCheckout = vi.fn();
    render(<TicketSelector ticketTypes={ticketTypes} onCheckout={onCheckout} />);

    expect(screen.getByText('Select Tickets')).toBeInTheDocument();
    expect(screen.getByText('General Admission')).toBeInTheDocument();
    expect(screen.getByText('VIP')).toBeInTheDocument();
    expect(screen.getByText('Free Entry')).toBeInTheDocument();
  });

  it('shows "Sold Out" label for sold-out ticket types', () => {
    const onCheckout = vi.fn();
    render(<TicketSelector ticketTypes={ticketTypes} onCheckout={onCheckout} />);

    expect(screen.getByText('Sold Out')).toBeInTheDocument();
  });

  it('shows remaining count for available ticket types', () => {
    const onCheckout = vi.fn();
    render(<TicketSelector ticketTypes={ticketTypes} onCheckout={onCheckout} />);

    expect(screen.getByText('70 remaining')).toBeInTheDocument();
    expect(screen.getByText('150 remaining')).toBeInTheDocument();
  });

  it('shows ticket type descriptions', () => {
    const onCheckout = vi.fn();
    render(<TicketSelector ticketTypes={ticketTypes} onCheckout={onCheckout} />);

    expect(screen.getByText('Standard entry ticket')).toBeInTheDocument();
    expect(screen.getByText('VIP access with lounge')).toBeInTheDocument();
  });

  it('increments and decrements quantity', async () => {
    const user = userEvent.setup();
    const onCheckout = vi.fn();
    render(<TicketSelector ticketTypes={[ticketTypes[0]]} onCheckout={onCheckout} />);

    const buttons = screen.getAllByRole('button');
    const incrementBtn = buttons.find((b) => b.querySelector('.lucide-plus'));

    if (incrementBtn) {
      await user.click(incrementBtn);
      await user.click(incrementBtn);
    }

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('2 tickets selected')).toBeInTheDocument();
  });

  it('shows Continue text when total price is zero (free tickets)', async () => {
    const user = userEvent.setup();
    const onCheckout = vi.fn();
    render(
      <TicketSelector ticketTypes={[ticketTypes[2]]} onCheckout={onCheckout} />
    );

    const incrementBtn = screen
      .getAllByRole('button')
      .find((b) => b.querySelector('.lucide-plus'));

    if (incrementBtn) {
      await user.click(incrementBtn);
    }

    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('calls onCheckout with cart lines when quantity > 0', async () => {
    const user = userEvent.setup();
    const onCheckout = vi.fn();
    render(
      <TicketSelector ticketTypes={[ticketTypes[0]]} onCheckout={onCheckout} />
    );

    const incrementBtn = screen
      .getAllByRole('button')
      .find((b) => b.querySelector('.lucide-plus'));

    if (incrementBtn) {
      await user.click(incrementBtn);
    }

    const continueBtn = screen.getByText('Continue to checkout');
    await user.click(continueBtn);

    expect(onCheckout).toHaveBeenCalledWith([
      { ticket_type_id: 'tt-1', quantity: 1 },
    ]);
  });
});

/* -----------------------------------------------------------------------
   TicketCard
   ----------------------------------------------------------------------- */

describe('TicketCard', () => {
  it('renders ticket information', () => {
    render(
      <MemoryRouter>
        <TicketCard ticket={sampleTicket} />
      </MemoryRouter>
    );

    expect(screen.getByText('Music Festival 2026')).toBeInTheDocument();
    expect(screen.getByText('General Admission')).toBeInTheDocument();
    expect(screen.getByText('EVT-2026-001234')).toBeInTheDocument();
    expect(screen.getByText('$25.00')).toBeInTheDocument();
  });

  it('displays the correct status badge', () => {
    render(
      <MemoryRouter>
        <TicketCard ticket={sampleTicket} />
      </MemoryRouter>
    );

    expect(screen.getByText('Confirmed')).toBeInTheDocument();
  });

  it('shows "Cancelled" status for cancelled tickets', () => {
    render(
      <MemoryRouter>
        <TicketCard ticket={{ ...sampleTicket, status: 'cancelled' }} />
      </MemoryRouter>
    );

    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('renders the event image', () => {
    render(
      <MemoryRouter>
        <TicketCard ticket={sampleTicket} />
      </MemoryRouter>
    );

    const img = screen.getByAltText('Music Festival 2026');
    expect(img).toHaveAttribute('src', 'https://example.com/festival.jpg');
  });
});

/* -----------------------------------------------------------------------
   RSVPButton
   ----------------------------------------------------------------------- */

describe('RSVPButton', () => {
  it('renders with "RSVP" text when no status is set', () => {
    const onChange = vi.fn();
    render(
      <RSVPButton eventId="evt-1" currentStatus={null} onStatusChange={onChange} />
    );

    expect(screen.getByText('RSVP')).toBeInTheDocument();
  });

  it('shows "Going" when status is going', () => {
    const onChange = vi.fn();
    render(
      <RSVPButton eventId="evt-1" currentStatus="going" onStatusChange={onChange} />
    );

    expect(screen.getByText('Going')).toBeInTheDocument();
  });

  it('opens dropdown with options on click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RSVPButton eventId="evt-1" currentStatus={null} onStatusChange={onChange} />
    );

    await user.click(screen.getByText('RSVP'));

    expect(screen.getByText('Going')).toBeInTheDocument();
    expect(screen.getByText('Maybe')).toBeInTheDocument();
    expect(screen.getByText('Not Going')).toBeInTheDocument();
  });

  it('calls onStatusChange with the selected status', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RSVPButton eventId="evt-1" currentStatus={null} onStatusChange={onChange} />
    );

    await user.click(screen.getByText('RSVP'));
    await user.click(screen.getByText('Going'));

    expect(onChange).toHaveBeenCalledWith('evt-1', 'going');
  });

  it('toggles off the current status when re-selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RSVPButton eventId="evt-1" currentStatus="going" onStatusChange={onChange} />
    );

    await user.click(screen.getByText('Going'));

    const goingOptions = screen.getAllByText('Going');
    const dropdownOption = goingOptions.find((el) =>
      el.closest('.absolute')
    );
    if (dropdownOption) {
      await user.click(dropdownOption);
    }

    expect(onChange).toHaveBeenCalledWith('evt-1', null);
  });
});

/* -----------------------------------------------------------------------
   QRCodeDisplay
   ----------------------------------------------------------------------- */

describe('QRCodeDisplay', () => {
  it('renders the event name and ticket number', () => {
    render(
      <QRCodeDisplay
        ticketNumber="EVT-2026-001234"
        eventName="Music Festival 2026"
        date="2026-07-20T18:00:00Z"
      />
    );

    expect(screen.getByText('Music Festival 2026')).toBeInTheDocument();
    expect(screen.getByText('EVT-2026-001234')).toBeInTheDocument();
  });

  it('renders the QR code canvas with the ticket number', () => {
    render(
      <QRCodeDisplay
        ticketNumber="EVT-2026-001234"
        eventName="Music Festival 2026"
        date="2026-07-20T18:00:00Z"
      />
    );

    const canvas = screen.getByTestId('qr-canvas');
    expect(canvas).toHaveAttribute('data-value', 'EVT-2026-001234');
  });

  it('renders a download button', () => {
    render(
      <QRCodeDisplay
        ticketNumber="EVT-2026-001234"
        eventName="Music Festival 2026"
        date="2026-07-20T18:00:00Z"
      />
    );

    expect(screen.getByText(/download qr code/i)).toBeInTheDocument();
  });

  it('displays "Event Ticket" header text', () => {
    render(
      <QRCodeDisplay
        ticketNumber="EVT-2026-001234"
        eventName="Music Festival 2026"
        date="2026-07-20T18:00:00Z"
      />
    );

    expect(screen.getByText('Event Ticket')).toBeInTheDocument();
  });
});
