import React, { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
  MapPin,
  Ticket,
  Image,
  Check,
  Loader2,
} from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  short_description: z.string().max(300).optional(),
  category_id: z.string().min(1, 'Please select a category'),
  tags: z.string().optional(),

  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  timezone: z.string().min(1, 'Timezone is required'),

  is_online: z.boolean(),
  venue_name: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  country: z.string().optional(),
  virtual_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),

  capacity: z.coerce.number().int().positive().optional(),
  is_free: z.boolean(),
  price: z.coerce.number().min(0).optional(),

  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  isLoading?: boolean;
}

const STEPS = [
  { id: 'basic', label: 'Basic Info', icon: FileText },
  { id: 'datetime', label: 'Date & Time', icon: Clock },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'tickets', label: 'Tickets', icon: Ticket },
  { id: 'image', label: 'Image', icon: Image },
] as const;

const CATEGORIES = [
  { id: 'music', name: 'Music' },
  { id: 'tech', name: 'Technology' },
  { id: 'business', name: 'Business' },
  { id: 'sports', name: 'Sports' },
  { id: 'arts', name: 'Arts' },
  { id: 'food', name: 'Food & Drink' },
  { id: 'health', name: 'Health' },
  { id: 'science', name: 'Science' },
  { id: 'community', name: 'Community' },
  { id: 'other', name: 'Other' },
];

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Kolkata',
  'Australia/Sydney',
  'UTC',
];

const STEP_FIELDS: Record<number, (keyof EventFormData)[]> = {
  0: ['title', 'description', 'short_description', 'category_id'],
  1: ['start_date', 'end_date', 'timezone'],
  2: ['is_online', 'venue_name', 'address', 'city', 'state', 'zip_code', 'country', 'virtual_url'],
  3: ['capacity', 'is_free', 'price'],
  4: ['image_url'],
};

const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      short_description: '',
      category_id: '',
      tags: '',
      start_date: '',
      end_date: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
      is_online: false,
      venue_name: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      virtual_url: '',
      capacity: undefined,
      is_free: true,
      price: 0,
      image_url: '',
      ...initialData,
    },
  });

  const isOnline = watch('is_online');
  const isFree = watch('is_free');
  const imageUrl = watch('image_url');

  const handleNext = async () => {
    const fields = STEP_FIELDS[step];
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handlePrevious = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleFormSubmit: SubmitHandler<EventFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="mx-auto max-w-3xl"
    >
      {/* Progress Indicator */}
      <nav className="mb-8">
        <ol className="flex items-center">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isCompleted = i < step;

            return (
              <li
                key={s.id}
                className={cn('flex items-center', i < STEPS.length - 1 && 'flex-1')}
              >
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive && 'bg-orange-50 text-orange-600',
                    isCompleted && 'text-green-600 hover:bg-green-50',
                    !isActive && !isCompleted && 'text-gray-400'
                  )}
                  disabled={i > step}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-sm',
                      isActive && 'bg-orange-500 text-white',
                      isCompleted && 'bg-green-500 text-white',
                      !isActive && !isCompleted && 'bg-gray-200 text-gray-500'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>

                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'mx-2 hidden h-0.5 flex-1 sm:block',
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Step 1: Basic Info */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Event Title *
              </label>
              <input
                {...register('title')}
                className={cn(
                  'block w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
                  errors.title
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/20'
                )}
                placeholder="Give your event a catchy title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={5}
                className={cn(
                  'block w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
                  errors.description
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/20'
                )}
                placeholder="Tell people what your event is about..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Short Description
              </label>
              <input
                {...register('short_description')}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-0"
                placeholder="A brief summary (max 300 chars)"
                maxLength={300}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                {...register('category_id')}
                className={cn(
                  'block w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
                  errors.category_id
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/20'
                )}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-500">{errors.category_id.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Tags
              </label>
              <input
                {...register('tags')}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-0"
                placeholder="Comma-separated tags (e.g. networking, workshop)"
              />
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Date & Time</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  {...register('start_date')}
                  className={cn(
                    'block w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
                    errors.start_date
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/20'
                  )}
                />
                {errors.start_date && (
                  <p className="mt-1 text-sm text-red-500">{errors.start_date.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  {...register('end_date')}
                  className={cn(
                    'block w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
                    errors.end_date
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/20'
                  )}
                />
                {errors.end_date && (
                  <p className="mt-1 text-sm text-red-500">{errors.end_date.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Timezone *
              </label>
              <select
                {...register('timezone')}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-0"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Location</h2>

            <Controller
              name="is_online"
              control={control}
              render={({ field }) => (
                <label className="flex cursor-pointer items-center gap-3">
                  <div
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      field.value ? 'bg-orange-500' : 'bg-gray-300'
                    )}
                    onClick={() => field.onChange(!field.value)}
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                        field.value && 'translate-x-5'
                      )}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    This is an online event
                  </span>
                </label>
              )}
            />

            {isOnline ? (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Virtual Event URL
                </label>
                <input
                  {...register('virtual_url')}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-0"
                  placeholder="https://zoom.us/j/..."
                />
                {errors.virtual_url && (
                  <p className="mt-1 text-sm text-red-500">{errors.virtual_url.message}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Venue Name
                  </label>
                  <input
                    {...register('venue_name')}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-0"
                    placeholder="Convention Center"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    {...register('address')}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-0"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      {...register('city')}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-0"
                      placeholder="San Francisco"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <input
                      {...register('state')}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-0"
                      placeholder="CA"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Zip Code
                    </label>
                    <input
                      {...register('zip_code')}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-0"
                      placeholder="94102"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                      {...register('country')}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-0"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Tickets & Capacity */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Tickets & Capacity</h2>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Max Capacity
              </label>
              <input
                type="number"
                {...register('capacity')}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-0"
                placeholder="Leave empty for unlimited"
                min={1}
              />
            </div>

            <Controller
              name="is_free"
              control={control}
              render={({ field }) => (
                <label className="flex cursor-pointer items-center gap-3">
                  <div
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      field.value ? 'bg-green-500' : 'bg-gray-300'
                    )}
                    onClick={() => field.onChange(!field.value)}
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                        field.value && 'translate-x-5'
                      )}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    This is a free event
                  </span>
                </label>
              )}
            />

            {!isFree && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Ticket Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price')}
                  className={cn(
                    'block w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
                    errors.price
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/20'
                  )}
                  placeholder="0.00"
                  min={0}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Image */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Cover Image</h2>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                {...register('image_url')}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-0"
                placeholder="https://example.com/image.jpg"
              />
              {errors.image_url && (
                <p className="mt-1 text-sm text-red-500">{errors.image_url.message}</p>
              )}
            </div>

            <div className="overflow-hidden rounded-lg border border-dashed border-gray-300">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Event cover preview"
                  className="aspect-[16/9] w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex aspect-[16/9] flex-col items-center justify-center bg-gray-50 text-gray-400">
                  <Image className="mb-2 h-10 w-10" />
                  <p className="text-sm">Image preview will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={step === 0}
            className={cn(
              'flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              step === 0
                ? 'cursor-not-allowed text-gray-300'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {initialData ? 'Update Event' : 'Create Event'}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default EventForm;
