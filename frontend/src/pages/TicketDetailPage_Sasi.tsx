import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Hash,
  Tag,
  Clock,
  DollarSign,
  XCircle,
} from 'lucide-react';
import { cn } from '../utils/cn_Pratham';
import { formatDateTime, formatDate } from '../utils/formatDate_Sasi';
import { formatPrice } from '../utils/formatCurrency_Sasi';
import Button from '../components/shared/Button_Preetam';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import Modal from '../components/shared/Modal_Pratham';
import QRCodeDisplay from '../components/tickets/QRCodeDisplay_Sasi';
import GoogleCalendarActions from '../components/calendar/GoogleCalendarActions_Preetam';
import useTicketStore from '../store/ticketStore_Sasi';

const STATUS_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  confirmed: { label: 'Confirmed', bg: 'bg-green-100', text: 'text-green-700' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-700' },
  checked_in: { label: 'Checked In', bg: 'bg-blue-100', text: 'text-blue-700' },
};

const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentTicket, isLoading, fetchTicketById, cancelTicket } =
    useTicketStore();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (id) fetchTicketById(id);
  }, [id, fetchTicketById]);

  const handleCancel = useCallback(async () => {
    if (!id) return;
    setCancelling(true);
    try {
      await cancelTicket(id);
      setShowCancelModal(false);
    } catch {
      // handled by store
    } finally {
      setCancelling(false);
    }
  }, [id, cancelTicket]);

  if (isLoading || !currentTicket) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const status = STATUS_STYLES[currentTicket.status] ?? STATUS_STYLES.confirmed;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back */}
      <Link
        to="/my-tickets"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Tickets
      </Link>

      {/* Ticket card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        {/* Header band */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-5 text-white sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/70">
                Event Ticket
              </p>
              <h1 className="text-xl font-bold sm:text-2xl">
                {currentTicket.event?.title ?? 'Event'}
              </h1>
            </div>
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold',
                status.bg,
                status.text
              )}
            >
              {status.label}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {currentTicket.event?.start_date
                ? formatDateTime(currentTicket.event.start_date)
                : 'TBA'}
            </span>
            {currentTicket.event?.venue_name && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {currentTicket.event.venue_name}
              </span>
            )}
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center border-b border-dashed border-gray-200 px-6 py-8 sm:px-8">
          <QRCodeDisplay
            ticketNumber={currentTicket.qr_code ?? currentTicket.id}
            eventName={currentTicket.event?.title ?? 'Event'}
            date={
              currentTicket.event?.start_date ?? new Date().toISOString()
            }
          />
        </div>

        {/* Ticket details */}
        <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
          <DetailRow
            icon={Hash}
            label="Ticket Number"
            value={currentTicket.qr_code ?? currentTicket.id.slice(0, 12)}
          />
          <DetailRow
            icon={Tag}
            label="Ticket Type"
            value={currentTicket.ticket_type?.name ?? 'General'}
          />
          <DetailRow
            icon={Clock}
            label="Purchase Date"
            value={formatDate(currentTicket.created_at)}
          />
          <DetailRow
            icon={DollarSign}
            label="Amount Paid"
            value={formatPrice(
              currentTicket.ticket_type?.price ?? 0,
              (currentTicket.ticket_type?.price ?? 0) === 0
            )}
          />
        </div>

        {/* Actions */}
        {currentTicket.status === 'confirmed' && (
          <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-5 sm:flex-row sm:px-8">
            <Button
              variant="danger"
              onClick={() => setShowCancelModal(true)}
              className="gap-1.5"
            >
              <XCircle className="h-4 w-4" />
              Cancel Ticket
            </Button>
          </div>
        )}

        {currentTicket.event?.id && currentTicket.event.start_date && (
          <div className="border-t border-gray-100 px-6 py-5 sm:px-8">
            <GoogleCalendarActions
              eventId={currentTicket.event.id}
              title={currentTicket.event.title}
              description={
                currentTicket.event.description?.trim() ||
                `${currentTicket.event.title} — EventHub`
              }
              startDate={currentTicket.event.start_date}
              endDate={currentTicket.event.end_date}
              location={[currentTicket.event.venue_name, currentTicket.event.city]
                .filter(Boolean)
                .join(', ')}
            />
          </div>
        )}
      </div>

      {/* Cancel confirmation modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Ticket"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to cancel this ticket? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCancelModal(false)}
            >
              Keep Ticket
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={cancelling}
              onClick={handleCancel}
            >
              Yes, Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50">
        <Icon className="h-4 w-4 text-orange-500" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default TicketDetailPage;
