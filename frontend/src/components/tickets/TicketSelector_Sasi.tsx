import React from 'react';
import TicketCard from './TicketCard_Sasi';

export type TicketType = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
};

type Props = {
  tickets: TicketType[];
  selectedTicketTypeId: string | null;
  onChange: (id: string) => void;
};

const TicketSelector: React.FC<Props> = ({ tickets, selectedTicketTypeId, onChange }) => {
  return (
    <div className="space-y-3">
      {tickets.map((t) => (
        <TicketCard
          key={t.id}
          name={t.name}
          description={t.description}
          priceLabel={t.price === 0 ? 'Free' : `$${t.price.toFixed(2)}`}
          selected={selectedTicketTypeId === t.id}
          onSelect={() => onChange(t.id)}
        />
      ))}
    </div>
  );
};

export default TicketSelector;

