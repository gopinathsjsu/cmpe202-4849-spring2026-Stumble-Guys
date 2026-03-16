import useTicketStore from '../store/ticketStore_Sasi';

export function useTickets() {
  const isLoading = useTicketStore((s) => s.isLoading);
  const lastPurchase = useTicketStore((s) => s.lastPurchase);
  const purchaseTickets = useTicketStore((s) => s.purchaseTickets);
  const rsvp = useTicketStore((s) => s.rsvp);

  return { isLoading, lastPurchase, purchaseTickets, rsvp };
}

