import React, { useState, useRef, useEffect } from 'react';
import { Check, HelpCircle, X, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';

type RsvpStatus = 'going' | 'maybe' | 'not_going' | null;

interface RSVPButtonProps {
  eventId: string;
  currentStatus: RsvpStatus;
  /** For free events: organizer approval for "Going" */
  approvalStatus?: string | null;
  onStatusChange: (eventId: string, status: RsvpStatus) => void;
}

const RSVP_OPTIONS: {
  value: RsvpStatus;
  label: string;
  icon: React.ElementType;
  activeClass: string;
  hoverClass: string;
}[] = [
  {
    value: 'going',
    label: 'Going',
    icon: Check,
    activeClass: 'bg-green-500 text-white border-green-500',
    hoverClass: 'hover:bg-green-50 text-green-700',
  },
  {
    value: 'maybe',
    label: 'Maybe',
    icon: HelpCircle,
    activeClass: 'bg-yellow-500 text-white border-yellow-500',
    hoverClass: 'hover:bg-yellow-50 text-yellow-700',
  },
  {
    value: 'not_going',
    label: 'Not Going',
    icon: X,
    activeClass: 'bg-gray-500 text-white border-gray-500',
    hoverClass: 'hover:bg-gray-50 text-gray-700',
  },
];

const RSVPButton: React.FC<RSVPButtonProps> = ({
  eventId,
  currentStatus,
  approvalStatus,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = RSVP_OPTIONS.find((o) => o.value === currentStatus);
  const ActiveIcon = activeOption?.icon;

  const goingIsConfirmed =
    approvalStatus === 'approved' ||
    approvalStatus === 'not_required' ||
    approvalStatus == null;

  const goingApprovalNote =
    currentStatus === 'going' && approvalStatus === 'pending'
      ? 'Pending organizer approval — you are not confirmed yet.'
      : currentStatus === 'going' && approvalStatus === 'rejected'
        ? 'The organizer did not approve this request. You can change your RSVP below.'
        : currentStatus === 'going' && goingIsConfirmed
          ? 'Confirmed — your spot is approved.'
          : null;

  const triggerClass =
    currentStatus === 'going' && approvalStatus === 'rejected'
      ? 'border-red-300 bg-red-50 text-red-800 border'
      : activeOption
        ? activeOption.activeClass
        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50';

  return (
    <div ref={dropdownRef} className="relative inline-block w-full max-w-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all sm:w-auto sm:justify-start',
          triggerClass
        )}
      >
        {ActiveIcon && <ActiveIcon className="h-4 w-4" />}
        {activeOption ? activeOption.label : 'RSVP'}
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {goingApprovalNote && (
        <p
          className={cn(
            'mt-2 text-xs leading-snug',
            approvalStatus === 'pending' && 'text-amber-800',
            approvalStatus === 'rejected' && 'text-red-700',
            goingIsConfirmed && 'text-green-800'
          )}
        >
          {goingApprovalNote}
        </p>
      )}

      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {RSVP_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = currentStatus === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onStatusChange(
                    eventId,
                    isActive ? null : option.value
                  );
                  setIsOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-gray-100 font-medium'
                    : option.hoverClass
                )}
              >
                <Icon className="h-4 w-4" />
                {option.label}
                {isActive && (
                  <Check className="ml-auto h-3.5 w-3.5 text-orange-500" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RSVPButton;
