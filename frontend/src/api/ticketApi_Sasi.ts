import axiosClient from './axiosClient_Pratham';

export interface CreateTicketTypeData {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  max_per_order?: number;
  sale_start?: string;
  sale_end?: string;
}

export interface PurchaseTicketData {
  ticket_type_id: string;
  quantity: number;
}

export interface TicketParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const ticketApi = {
  getTicketTypes: async (eventId: string) => {
    const response = await axiosClient.get(`/events/${eventId}/ticket-types`);
    return response.data;
  },

  createTicketType: async (eventId: string, data: CreateTicketTypeData) => {
    const response = await axiosClient.post(
      `/events/${eventId}/ticket-types`,
      data
    );
    return response.data;
  },

  purchaseTicket: async (eventId: string, data: PurchaseTicketData) => {
    const response = await axiosClient.post(
      `/events/${eventId}/tickets/purchase`,
      data
    );
    return response.data;
  },

  getMyTickets: async (params?: TicketParams) => {
    const response = await axiosClient.get('/events/tickets/my', { params });
    return response.data;
  },

  getTicketById: async (id: string) => {
    const response = await axiosClient.get(`/events/tickets/${id}`);
    return response.data;
  },

  cancelTicket: async (id: string) => {
    const response = await axiosClient.put(`/events/tickets/${id}/cancel`);
    return response.data;
  },

  createRsvp: async (eventId: string, status: string) => {
    const response = await axiosClient.post(`/events/${eventId}/rsvp`, {
      status,
    });
    return response.data;
  },

  updateRsvp: async (eventId: string, status: string) => {
    const response = await axiosClient.put(`/events/${eventId}/rsvp`, {
      status,
    });
    return response.data;
  },

  removeRsvp: async (eventId: string) => {
    const response = await axiosClient.delete(`/events/${eventId}/rsvp`);
    return response.data;
  },

  getEventRsvps: async (eventId: string, params?: { page?: number; limit?: number }) => {
    const response = await axiosClient.get(`/events/${eventId}/rsvps`, { params });
    return response.data;
  },

  approveEventRsvp: async (eventId: string, rsvpId: string) => {
    const response = await axiosClient.put(`/events/${eventId}/rsvps/${rsvpId}/approve`);
    return response.data;
  },

  rejectEventRsvp: async (eventId: string, rsvpId: string) => {
    const response = await axiosClient.put(`/events/${eventId}/rsvps/${rsvpId}/reject`);
    return response.data;
  },

  getMyRsvps: async () => {
    const response = await axiosClient.get('/events/rsvps/my');
    return response.data;
  },

  getMyRsvpForEvent: async (eventId: string) => {
    const response = await axiosClient.get(`/events/${eventId}/rsvp/me`);
    return response.data;
  },

  getCalendarFile: async (eventId: string) => {
    const response = await axiosClient.post(
      `/events/${eventId}/calendar`,
      null,
      { responseType: 'blob' }
    );
    return response.data;
  },
};
