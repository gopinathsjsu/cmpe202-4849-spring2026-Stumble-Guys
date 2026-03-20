import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import useEventStore from '../store/eventStore_Nikhil';
import EventForm from '../components/events/EventForm_Nikhil';
import RoleGuard from '../components/auth/RoleGuard_Preetam';
import { useToast } from '../components/shared/Toast_Sasi';
import { ROLES } from '../utils/constants_Preetam';

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { createEvent, isLoading } = useEventStore();
  const { toast } = useToast();

  const handleSubmit = async (data: Parameters<typeof createEvent>[0]) => {
    try {
      const newEvent = await createEvent(data);
      toast.success('Event created successfully!');
      navigate(`/events/${newEvent.slug}`);
    } catch {
      toast.error('Failed to create event. Please try again.');
    }
  };

  return (
    <RoleGuard allowedRoles={[ROLES.ORGANIZER, ROLES.ADMIN]} redirectTo="/">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
            <PlusCircle className="h-7 w-7 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Event
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Fill out the details below to publish your event and start selling
            tickets.
          </p>
        </div>

        <EventForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </RoleGuard>
  );
};

export default CreateEventPage;
