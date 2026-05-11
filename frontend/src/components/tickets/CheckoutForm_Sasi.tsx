import React, { useState } from 'react';
import { CreditCard, Lock, Loader2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatCurrency_Sasi';

export interface CheckoutLine {
  label: string;
  quantity: number;
  subtotal: number;
}

interface CheckoutFormProps {
  lines: CheckoutLine[];
  totalPrice: number;
  onSubmit: () => void | Promise<void>;
  isLoading?: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  lines,
  totalPrice,
  onSubmit,
  isLoading = false,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await Promise.resolve(onSubmit());
    } finally {
      setSubmitting(false);
    }
  };

  const busy = isLoading || submitting;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-5">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h3>
        <div className="space-y-2 text-sm">
          {lines.map((line, i) => (
            <div key={i} className="flex justify-between text-gray-500">
              <span>
                {line.label}
                {line.quantity > 1 ? ` × ${line.quantity}` : ''}
              </span>
              <span className="font-medium text-gray-900">
                {formatPrice(line.subtotal, line.subtotal === 0)}
              </span>
            </div>
          ))}
          <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(totalPrice, totalPrice === 0)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <CreditCard className="h-5 w-5 text-gray-400" />
          Payment Details
        </h3>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="4242 4242 4242 4242"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Expiry
              </label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <strong>Demo Mode:</strong> This is a mock checkout. No real payment will be
          processed. Use any card details.
        </div>

        <button
          type="submit"
          disabled={busy}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          {busy ? 'Processing...' : `Pay ${formatPrice(totalPrice, totalPrice === 0)}`}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
