import { useEffect } from 'react';
import useTicketStore from '../store/ticketStore_Sasi';

export function useMyTickets() {
  const { myTickets, isLoading, fetchMyTickets } = useTicketStore();

  useEffect(() => {
    fetchMyTickets();
  }, [fetchMyTickets]);

  return { tickets: myTickets, isLoading, refetch: fetchMyTickets };
}

export function useTicketTypes(eventId: string) {
  const { ticketTypes, isLoading, fetchTicketTypes } = useTicketStore();

  useEffect(() => {
    if (eventId) {
      fetchTicketTypes(eventId);
    }
  }, [eventId, fetchTicketTypes]);

  return { ticketTypes, isLoading };
}
