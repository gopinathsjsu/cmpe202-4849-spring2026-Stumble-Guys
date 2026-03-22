import React from 'react';
import { useParams, Link } from 'react-router-dom';
import QRCodeDisplay from '../components/tickets/QRCodeDisplay_Sasi';

const TicketDetailPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ticket Detail</h1>
          <p className="mt-1 text-sm text-gray-600">Ticket id: {id}</p>
        </div>
        <Link to="/my-tickets" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
          Back to My Tickets
        </Link>
      </div>

      <QRCodeDisplay value={id ?? 'unknown-ticket'} />
    </div>
  );
};

export default TicketDetailPage;

