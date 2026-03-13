import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, Shield, Users } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm_Preetam';
import { APP_NAME } from '../utils/constants_Preetam';

const FEATURES = [
  { icon: Calendar, text: 'Discover curated events near you' },
  { icon: Sparkles, text: 'Get personalized recommendations' },
  { icon: Shield, text: 'Secure ticket purchases' },
  { icon: Users, text: 'Connect with a vibrant community' },
];

const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Left decorative panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-pink-500 lg:flex">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmg0djJoMnY0aC0ydjJoLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{APP_NAME}</span>
          </div>

          <h2 className="text-4xl font-extrabold leading-tight text-white">
            Welcome back!
            <br />
            <span className="text-orange-200">
              Your next event awaits.
            </span>
          </h2>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-orange-100">
            Sign in to manage your tickets, discover new events, and stay
            connected with the community.
          </p>

          <ul className="mt-10 space-y-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.text} className="flex items-center gap-3 text-white/90">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{f.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="mb-6 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-orange-500 hover:text-orange-600"
            >
              Create one free
            </Link>
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
