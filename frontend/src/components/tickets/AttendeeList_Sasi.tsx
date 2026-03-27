import React from 'react';

type Attendee = {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
};

type Props = {
  attendees: Attendee[];
};

const AttendeeList: React.FC<Props> = ({ attendees }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="text-sm font-semibold text-gray-900">Attendees</div>
      <div className="mt-3 space-y-2">
        {attendees.length === 0 ? (
          <div className="text-sm text-gray-500">No attendees yet.</div>
        ) : (
          attendees.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50">
              <div className="text-sm text-gray-900">
                {a.first_name} {a.last_name}
              </div>
              {a.email && <div className="text-xs text-gray-500">{a.email}</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AttendeeList;

