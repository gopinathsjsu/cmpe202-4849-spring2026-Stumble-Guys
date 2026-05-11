import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, ArrowLeft, MapPin, Search } from 'lucide-react';
import Button from '../components/shared/Button_Preetam';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="flex max-w-lg flex-col items-center text-center">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="text-[160px] font-black leading-none text-gray-100 sm:text-[200px]">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
              <MapPin className="h-12 w-12 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Copy */}
        <h1 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
          Oops! Page not found
        </h1>
        <p className="mb-8 max-w-sm text-gray-500">
          Looks like you wandered off the map. The page you&apos;re looking for
          doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Helpful links */}
        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
          <Link
            to="/events"
            className="flex items-center gap-1 text-gray-500 transition-colors hover:text-orange-500"
          >
            <Search className="h-3.5 w-3.5" />
            Browse Events
          </Link>
          <Link
            to="/search"
            className="flex items-center gap-1 text-gray-500 transition-colors hover:text-orange-500"
          >
            <Search className="h-3.5 w-3.5" />
            Search
          </Link>
          <Link
            to="/map"
            className="flex items-center gap-1 text-gray-500 transition-colors hover:text-orange-500"
          >
            <MapPin className="h-3.5 w-3.5" />
            Map View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
