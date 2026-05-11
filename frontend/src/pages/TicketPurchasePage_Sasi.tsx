import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Ticket,
  Calendar,
  MapPin,
  PartyPopper,
} from 'lucide-react';
import { cn } from '../utils/cn_Pratham';
import { formatDateTime } from '../utils/formatDate_Sasi';
import { formatPrice } from '../utils/formatCurrency_Sasi';
import Button from '../components/shared/Button_Preetam';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import TicketSelector, {
  type TicketCartLine,
} from '../components/tickets/TicketSelector_Sasi';
import CheckoutForm, {
  type CheckoutLine,
} from '../components/tickets/CheckoutForm_Sasi';
import QRCodeDisplay from '../components/tickets/QRCodeDisplay_Sasi';
import useTicketStore from '../store/ticketStore_Sasi';
import useEventStore from '../store/eventStore_Nikhil';

type Step = 'select' | 'payment' | 'confirmation';

const STEPS: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: 'select', label: 'Select', icon: Ticket },
  { key: 'payment', label: 'Payment', icon: CreditCard },
  { key: 'confirmation', label: 'Confirmation', icon: Check },
];

export type PurchaseLocationState = { cart?: TicketCartLine[] };

const TicketPurchasePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentEvent, isLoading: eventLoading, fetchEventBySlug } = useEventStore();
  const {
    ticketTypes,
    isLoading: ticketLoading,
    fetchTicketTypes,
    purchaseTicket,
  } = useTicketStore();

  const [step, setStep] = useState<Step>('select');
  const [cartLines, setCartLines] = useState<TicketCartLine[]>([]);
  const [purchasedTicket, setPurchasedTicket] = useState<{
    id: string;
    qr_code: string | null;
  } | null>(null);
  const appliedNavState = useRef(false);

  useEffect(() => {
    if (slug) fetchEventBySlug(slug);
  }, [slug, fetchEventBySlug]);

  useEffect(() => {
    if (currentEvent?.id) fetchTicketTypes(currentEvent.id);
  }, [currentEvent?.id, fetchTicketTypes]);

  useEffect(() => {
    const state = location.state as PurchaseLocationState | null;
    if (appliedNavState.current || !state?.cart?.length || !ticketTypes.length) return;
    setCartLines(state.cart);
    setStep('payment');
    appliedNavState.current = true;
  }, [location.state, ticketTypes.length]);

  const checkoutLines: CheckoutLine[] = cartLines.map((line) => {
    const tt = ticketTypes.find((t) => t.id === line.ticket_type_id);
    const price = Number(tt?.price ?? 0);
    return {
      label: tt?.name ?? 'Ticket',
      quantity: line.quantity,
      subtotal: price * line.quantity,
    };
  });

  const totalPrice = checkoutLines.reduce((s, l) => s + l.subtotal, 0);

  const handleCheckout = useCallback((lines: TicketCartLine[]) => {
    setCartLines(lines);
    setStep('payment');
  }, []);

  const handlePurchase = useCallback(async () => {
    if (!currentEvent?.id || !cartLines.length) return;
    try {
      let last: { id: string; qr_code: string | null } | null = null;
      for (const line of cartLines) {
        const result = await purchaseTicket(currentEvent.id, {
          ticket_type_id: line.ticket_type_id,
          quantity: line.quantity,
        });
        if (Array.isArray(result)) {
          const t = result[result.length - 1];
          if (t) last = { id: t.id, qr_code: t.qr_code ?? null };
        } else if (result && typeof result === 'object' && 'id' in result) {
          last = {
            id: (result as { id: string }).id,
            qr_code: (result as { qr_code?: string | null }).qr_code ?? null,
          };
        }
      }
      if (last) setPurchasedTicket(last);
      setStep('confirmation');
    } catch {
      // toast elsewhere if needed
    }
  }, [currentEvent?.id, cartLines, purchaseTicket]);

  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const eventImage =
    currentEvent?.image_url ?? currentEvent?.cover_image ?? undefined;

  if (eventLoading || (ticketLoading && !currentEvent)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to={currentEvent ? `/events/${currentEvent.slug}` : '/events'}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to event
      </Link>

      <div className="mb-10">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === stepIndex;
            const isCompleted = i < stepIndex;
            return (
              <React.Fragment key={s.key}>
                {i > 0 && (
                  <div
                    className={cn(
                      'h-0.5 flex-1 transition-colors',
                      isCompleted ? 'bg-orange-500' : 'bg-gray-200'
                    )}
                  />
                )}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                      isActive
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : isCompleted
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-gray-300 bg-white text-gray-400'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      isActive || isCompleted ? 'text-orange-600' : 'text-gray-400'
                    )}
                  >
                    {s.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <aside className="lg:col-span-1">
          <div className="sticky top-24 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {eventImage ? (
              <img
                src={eventImage}
                alt={currentEvent?.title ?? ''}
                className="h-40 w-full object-cover"
              />
            ) : (
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500">
                <Ticket className="h-12 w-12 text-white/60" />
              </div>
            )}
            <div className="p-4">
              <h2 className="mb-3 text-lg font-bold text-gray-900">
                {currentEvent?.title}
              </h2>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0 text-orange-500" />
                  <span>
                    {currentEvent?.start_date
                      ? formatDateTime(currentEvent.start_date)
                      : 'TBA'}
                  </span>
                </div>
                {currentEvent?.venue_name && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
                    <span>
                      {currentEvent.venue_name}
                      {currentEvent.city && `, ${currentEvent.city}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-2">
          {step === 'select' && (
            <TicketSelector
              ticketTypes={ticketTypes.map((t) => ({
                id: t.id,
                name: t.name,
                price: Number(t.price),
                quantity: t.quantity,
                sold_count: t.sold_count,
                description: t.description ?? undefined,
              }))}
              onCheckout={handleCheckout}
            />
          )}

          {step === 'payment' && cartLines.length > 0 && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setStep('select')}
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Change tickets
              </button>
              <CheckoutForm
                lines={checkoutLines}
                totalPrice={totalPrice}
                onSubmit={handlePurchase}
                isLoading={ticketLoading}
              />
            </div>
          )}

          {step === 'confirmation' && purchasedTicket && (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <PartyPopper className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">You&apos;re all set!</h2>
                <p className="mt-1 text-gray-500">
                  Your tickets have been confirmed. Show the QR code at the entrance.
                </p>
              </div>

              <QRCodeDisplay
                ticketNumber={purchasedTicket.qr_code ?? purchasedTicket.id}
                eventName={currentEvent?.title ?? ''}
                date={currentEvent?.start_date ?? new Date().toISOString()}
              />

              <div className="rounded-lg bg-gray-50 p-4 text-left text-sm">
                <h4 className="mb-2 font-semibold text-gray-900">Order Summary</h4>
                <div className="space-y-1 text-gray-600">
                  {checkoutLines.map((line, i) => (
                    <div key={i} className="flex justify-between">
                      <span>
                        {line.label}
                        {line.quantity > 1 ? ` × ${line.quantity}` : ''}
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(line.subtotal, line.subtotal === 0)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-gray-200 pt-1 font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice, totalPrice === 0)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button variant="primary" onClick={() => navigate('/my-tickets')}>
                  View My Tickets
                </Button>
                <Button variant="outline" onClick={() => navigate('/events')}>
                  Browse More Events
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketPurchasePage;
