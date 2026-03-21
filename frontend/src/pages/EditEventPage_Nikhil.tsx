import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import useEventStore from '../store/eventStore_Nikhil';
import { useAuth } from '../hooks/useAuth_Preetam';
import EventForm from '../components/events/EventForm_Nikhil';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import { useToast } from '../components/shared/Toast_Sasi';

const EditEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  const { currentEvent, isLoading, fetchEventBySlug, updateEvent } =
    useEventStore();

  useEffect(() => {
    if (id) fetchEventBySlug(id);
  }, [id, fetchEventBySlug]);

  useEffect(() => {
    if (
      currentEvent &&
      user &&
      currentEvent.organizer_id !== user.id &&
      !isAdmin
    ) {
      toast.error('You do not have permission to edit this event');
      navigate('/my-events');
    }
  }, [currentEvent, user, isAdmin, navigate, toast]);

  const handleSubmit = async (data: Parameters<typeof updateEvent>[1]) => {
    if (!currentEvent) return;
    try {
      await updateEvent(currentEvent.id, data);
      toast.success('Event updated successfully!');
      navigate(`/events/${currentEvent.slug}`);
    } catch {
      toast.error('Failed to update event');
    }
  };

  if (isLoading || !currentEvent) {
    return <LoadingSpinner fullPage />;
  }

  const initialData = {
    title: currentEvent.title,
    description: currentEvent.description,
    category_id: currentEvent.category_id,
    start_date: currentEvent.start_date,
    end_date: currentEvent.end_date,
    timezone: 'America/New_York',
    is_online: currentEvent.is_virtual,
    venue_name: currentEvent.venue_name ?? '',
    address: currentEvent.address ?? '',
    city: currentEvent.city ?? '',
    state: currentEvent.state ?? '',
    country: currentEvent.country ?? '',
    virtual_url: currentEvent.virtual_url ?? '',
    capacity: currentEvent.max_attendees ?? undefined,
    is_free: currentEvent.is_free,
    image_url: currentEvent.cover_image ?? '',
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
          <Pencil className="h-7 w-7 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        <p className="mt-2 text-sm text-gray-500">
          Update the details of your event below.
        </p>
      </div>

      <EventForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EditEventPage;
