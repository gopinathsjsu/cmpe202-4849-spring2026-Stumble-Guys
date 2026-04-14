import React from 'react';
import { CalendarX } from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';
import EventCard, { type EventCardData } from './EventCard_Nikhil';

interface EventGridProps {
  events: EventCardData[];
  isLoading?: boolean;
  emptyMessage?: string;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="aspect-[16/9] bg-gray-200" />
      <div className="space-y-3 p-4">
        <div className="flex gap-4">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-4 w-20 rounded bg-gray-200" />
        </div>
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
        <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
          <div className="h-6 w-6 rounded-full bg-gray-200" />
          <div className="h-3 w-24 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20">
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        <CalendarX className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-gray-900">
        No events found
      </h3>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

const EventGrid: React.FC<EventGridProps> = ({
  events,
  isLoading = false,
  emptyMessage = 'Try adjusting your filters or check back later.',
}) => {
  return (
    <div
      className={cn(
        'grid gap-6',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        'transition-opacity duration-300'
      )}
    >
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        : events.length === 0
          ? <EmptyState message={emptyMessage} />
          : events.map((event) => <EventCard key={event.id} event={event} />)}
    </div>
  );
};

export default EventGrid;
