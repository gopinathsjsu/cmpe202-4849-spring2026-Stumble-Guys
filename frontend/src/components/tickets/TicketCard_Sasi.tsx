import React from 'react';

type Props = {
  name: string;
  description?: string | null;
  priceLabel: string;
  selected: boolean;
  onSelect: () => void;
};

const TicketCard: React.FC<Props> = ({ name, description, priceLabel, selected, onSelect }) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'w-full rounded-xl border p-4 text-left transition',
        selected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:bg-gray-50',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-gray-900">{name}</div>
          {description && <div className="mt-1 text-xs text-gray-600">{description}</div>}
        </div>
        <div className="text-sm font-semibold text-gray-900">{priceLabel}</div>
      </div>
    </button>
  );
};

export default TicketCard;

