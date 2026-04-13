import React, { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';

interface Filters {
  category: string;
  dateRange: { start: string; end: string };
  isFree: 'all' | 'free' | 'paid';
  city: string;
}

interface FilterPanelProps {
  filters: Filters;
  categories: string[];
  onFilterChange: (filters: Filters) => void;
  className?: string;
}

function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-800 transition-colors hover:text-orange-600"
      >
        {title}
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  categories,
  onFilterChange,
  className,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = (patch: Partial<Filters>) => {
    onFilterChange({ ...filters, ...patch });
  };

  const handleClear = () => {
    onFilterChange({
      category: '',
      dateRange: { start: '', end: '' },
      isFree: 'all',
      city: '',
    });
  };

  const hasActiveFilters =
    filters.category !== '' ||
    filters.dateRange.start !== '' ||
    filters.dateRange.end !== '' ||
    filters.isFree !== 'all' ||
    filters.city !== '';

  const panelContent = (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-orange-500" />
          <h3 className="text-sm font-bold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <Section title="Category">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => update({ category: '' })}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              filters.category === ''
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => update({ category: cat })}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                filters.category === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Date Range">
        <div className="flex flex-col gap-2">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Start date</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) =>
                update({ dateRange: { ...filters.dateRange, start: e.target.value } })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">End date</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) =>
                update({ dateRange: { ...filters.dateRange, end: e.target.value } })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
        </div>
      </Section>

      <Section title="Price">
        <div className="flex gap-2">
          {(['all', 'free', 'paid'] as const).map((option) => (
            <button
              key={option}
              onClick={() => update({ isFree: option })}
              className={cn(
                'flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors',
                filters.isFree === option
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {option === 'all' ? 'All' : option === 'free' ? 'Free' : 'Paid'}
            </button>
          ))}
        </div>
      </Section>

      <Section title="City">
        <input
          type="text"
          value={filters.city}
          onChange={(e) => update({ city: e.target.value })}
          placeholder="Enter city name..."
          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
      </Section>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {hasActiveFilters && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
            !
          </span>
        )}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl animate-in slide-in-from-bottom">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Filters</h3>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {panelContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden w-64 shrink-0 rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:block',
          className
        )}
      >
        {panelContent}
      </aside>
    </>
  );
};

export default FilterPanel;

// Accessibility: focus management and screen reader support - Sprint 5
