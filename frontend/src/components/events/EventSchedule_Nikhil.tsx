import React from 'react';
import { Clock, User } from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';

interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
  speaker?: string;
}

interface EventScheduleProps {
  schedule: ScheduleItem[];
}

const EventSchedule: React.FC<EventScheduleProps> = ({ schedule }) => {
  if (schedule.length === 0) return null;

  return (
    <div className="space-y-0" role="list" aria-label="Event schedule">
      <h3 className="mb-6 text-lg font-semibold text-gray-900">Event Schedule</h3>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute bottom-0 left-[7.5rem] top-0 hidden w-px bg-gray-200 sm:block" />

        <div className="space-y-6">
          {schedule.map((item, index) => (
            <div key={index} className="relative flex gap-6">
              {/* Time column */}
              <div className="hidden w-24 shrink-0 pt-3 text-right sm:block">
                <span className="text-sm font-medium text-orange-600">
                  {item.time}
                </span>
              </div>

              {/* Dot on timeline */}
              <div className="hidden sm:flex sm:items-start sm:pt-3.5">
                <div
                  className={cn(
                    'relative z-10 h-3 w-3 rounded-full border-2',
                    index === 0
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-orange-300 bg-white'
                  )}
                />
              </div>

              {/* Content card */}
              <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-1 flex items-center gap-2 sm:hidden">
                  <Clock className="h-3.5 w-3.5 text-orange-500" />
                  <span className="text-sm font-medium text-orange-600">
                    {item.time}
                  </span>
                </div>

                <h4 className="font-medium text-gray-900">{item.title}</h4>

                {item.description && (
                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                )}

                {item.speaker && (
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
                    <User className="h-3.5 w-3.5" />
                    <span>{item.speaker}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventSchedule;
