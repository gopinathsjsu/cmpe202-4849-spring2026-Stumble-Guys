import React, { useState, useMemo } from 'react';
import { Minus, Plus, ShoppingCart, Ticket, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';
import { formatPrice } from '../../utils/formatCurrency_Sasi';

export interface TicketCartLine {
  ticket_type_id: string;
  quantity: number;
}

interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sold_count: number;
  description?: string | null;
}

interface TicketSelectorProps {
  ticketTypes: TicketType[];
  /** Called with all selected lines (quantity &gt; 0) when user continues to checkout */
  onCheckout: (lines: TicketCartLine[]) => void;
}

const MAX_PER_ORDER = 10;

const TicketSelector: React.FC<TicketSelectorProps> = ({
  ticketTypes,
  onCheckout,
}) => {
  const [selections, setSelections] = useState<Record<string, number>>({});

  const updateQuantity = (typeId: string, delta: number) => {
    setSelections((prev) => {
      const current = prev[typeId] ?? 0;
      const ticketType = ticketTypes.find((t) => t.id === typeId);
      if (!ticketType) return prev;

      const remaining = ticketType.quantity - ticketType.sold_count;
      const next = Math.max(0, Math.min(current + delta, MAX_PER_ORDER, remaining));
      return { ...prev, [typeId]: next };
    });
  };

  const totalPrice = useMemo(() => {
    return ticketTypes.reduce((sum, tt) => {
      const qty = selections[tt.id] ?? 0;
      return sum + tt.price * qty;
    }, 0);
  }, [selections, ticketTypes]);

  const totalQuantity = Object.values(selections).reduce((a, b) => a + b, 0);

  const handleContinue = () => {
    const lines: TicketCartLine[] = Object.entries(selections)
      .filter(([, qty]) => qty > 0)
      .map(([ticket_type_id, quantity]) => ({ ticket_type_id, quantity }));
    if (lines.length === 0) return;
    onCheckout(lines);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Ticket className="h-5 w-5 text-orange-500" />
          Select Tickets
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        {ticketTypes.map((tt) => {
          const remaining = tt.quantity - tt.sold_count;
          const isSoldOut = remaining <= 0;
          const qty = selections[tt.id] ?? 0;

          return (
            <div
              key={tt.id}
              className={cn(
                'flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between',
                isSoldOut && 'opacity-60'
              )}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">{tt.name}</h4>
                  {isSoldOut && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      Sold Out
                    </span>
                  )}
                </div>
                {tt.description && (
                  <p className="mt-0.5 text-sm text-gray-500">{tt.description}</p>
                )}
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatPrice(tt.price, tt.price === 0)}
                </p>
                {!isSoldOut && (
                  <p className="text-xs text-gray-400">{remaining} remaining</p>
                )}
              </div>

              {!isSoldOut && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateQuantity(tt.id, -1)}
                    disabled={qty <= 0}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-gray-900">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(tt.id, 1)}
                    disabled={qty >= Math.min(MAX_PER_ORDER, remaining)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {totalQuantity} ticket{totalQuantity !== 1 ? 's' : ''} selected
          </span>
          <span className="text-lg font-bold text-gray-900">
            {totalPrice === 0 && totalQuantity > 0
              ? 'Free'
              : formatPrice(totalPrice, false)}
          </span>
        </div>
        <button
          type="button"
          onClick={handleContinue}
          disabled={totalQuantity === 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          {totalPrice === 0 ? 'Continue' : 'Continue to checkout'}
        </button>
      </div>
    </div>
  );
};

export default TicketSelector;
