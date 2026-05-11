import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Hash, Tag } from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';
import { formatDateTime } from '../../utils/formatDate_Sasi';
import { formatPrice } from '../../utils/formatCurrency_Sasi';

interface TicketEvent {
  id: string;
  title: string;
  start_date: string;
  image_url?: string;
}

interface TicketData {
  id: string;
  ticket_number: string;
  event: TicketEvent;
  ticket_type: string;
  status: 'confirmed' | 'cancelled' | 'checked_in';
  purchase_date: string;
  amount_paid: number;
  /** From API: completed | free | pending (demo checkout confirms immediately) */
  payment_status?: string;
}

interface TicketCardProps {
  ticket: TicketData;
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
  checked_in: { label: 'Checked In', className: 'bg-blue-100 text-blue-700' },
};

const PAYMENT_LABEL: Record<string, string> = {
  completed: 'Paid',
  free: 'Free',
  pending: 'Payment pending',
  failed: 'Payment failed',
};

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const navigate = useNavigate();
  const status = STATUS_STYLES[ticket.status] ?? STATUS_STYLES.confirmed;
  const payKey = (ticket.payment_status ?? '').toLowerCase();
  const paymentLabel =
    ticket.amount_paid === 0
      ? 'Free'
      : PAYMENT_LABEL[payKey] ?? (payKey ? payKey : 'Paid');

  return (
    <button
      type="button"
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      className="group w-full text-left"
    >
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        {/* Ticket notch decorations */}
        <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-gray-100" />
        <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-gray-100" />

        <div className="flex flex-col sm:flex-row">
          {/* Left side - Event image */}
          <div className="relative h-32 w-full sm:h-auto sm:w-32">
            {ticket.event.image_url ? (
              <img
                src={ticket.event.image_url}
                alt={ticket.event.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500">
                <Tag className="h-8 w-8 text-white/60" />
              </div>
            )}
          </div>

          {/* Right side - Details */}
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">
                  {ticket.event.title}
                </h3>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                    status.className
                  )}
                >
                  {status.label}
                </span>
              </div>

              <div className="mb-2 flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                {formatDateTime(ticket.event.start_date)}
              </div>
              <p className="text-xs text-gray-500">
                Payment:{' '}
                <span className="font-medium text-gray-700">{paymentLabel}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-dashed border-gray-200 pt-2">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Tag className="h-3 w-3" />
                {ticket.ticket_type}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Hash className="h-3 w-3" />
                {ticket.ticket_number}
              </span>
              <span className="ml-auto text-sm font-semibold text-gray-900">
                {formatPrice(ticket.amount_paid, ticket.amount_paid === 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default TicketCard;
