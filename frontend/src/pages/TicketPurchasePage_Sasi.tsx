import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useEventStore from '../store/eventStore_Nikhil';
import { useTickets } from '../hooks/useTickets_Sasi';
import TicketSelector, { type TicketType } from '../components/tickets/TicketSelector_Sasi';
import CheckoutForm from '../components/tickets/CheckoutForm_Sasi';
import RSVPButton from '../components/tickets/RSVPButton_Sasi';

const TicketPurchasePage: React.FC = () => {
  const { id } = useParams();
  const { purchaseTickets, rsvp, isLoading } = useTickets();
  const currentEvent = useEventStore((s) => s.currentEvent);

  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string | null>(null);

  const ticketTypes: TicketType[] = useMemo(() => {
    const types = (currentEvent as any)?.ticket_types ?? [];
    return types.map((t: any) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      price: Number(t.price ?? 0),
    }));
  }, [currentEvent]);

  if (!id) {
    return <div className="p-6">Missing event id.</div>;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Tickets</h1>
          <p className="mt-1 text-sm text-gray-600">
            Select a ticket type and quantity to complete checkout.
          </p>
        </div>
        <Link to={`/events/${id}`} className="text-sm font-semibold text-orange-600 hover:text-orange-700">
          Back to event
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900">RSVP</div>
              <RSVPButton disabled={isLoading} onClick={() => rsvp(id, 'going')} />
            </div>
            <div className="mt-2 text-xs text-gray-600">
              RSVP is a quick way to express interest if you’re not buying a ticket.
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm font-semibold text-gray-900">Tickets</div>
            <div className="mt-3">
              {ticketTypes.length === 0 ? (
                <div className="text-sm text-gray-500">
                  Ticket types will appear here once loaded from the event.
                </div>
              ) : (
                <TicketSelector
                  tickets={ticketTypes}
                  selectedTicketTypeId={selectedTicketTypeId}
                  onChange={setSelectedTicketTypeId}
                />
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-sm font-semibold text-gray-900">Checkout</div>
          <div className="mt-3">
            <CheckoutForm
              disabled={isLoading || !selectedTicketTypeId}
              onSubmit={async (quantity) => {
                if (!selectedTicketTypeId) return;
                await purchaseTickets(id, { ticket_type_id: selectedTicketTypeId, quantity });
              }}
            />
            {!selectedTicketTypeId && (
              <div className="mt-3 text-xs text-gray-500">Select a ticket type to continue.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPurchasePage;

