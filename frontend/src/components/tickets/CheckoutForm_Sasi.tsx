import React, { useState } from 'react';
import Button from '../shared/Button_Preetam';

type Props = {
  disabled?: boolean;
  onSubmit: (quantity: number) => Promise<void> | void;
};

const CheckoutForm: React.FC<Props> = ({ disabled, onSubmit }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit(quantity);
      }}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          min={1}
          max={20}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <Button type="submit" variant="primary" fullWidth disabled={disabled}>
        Purchase
      </Button>
    </form>
  );
};

export default CheckoutForm;

