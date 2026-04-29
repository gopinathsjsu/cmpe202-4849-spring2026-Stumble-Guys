import React, { useRef } from 'react';
import {
  Music,
  Cpu,
  Briefcase,
  Trophy,
  Palette,
  UtensilsCrossed,
  Heart,
  Atom,
  Users,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (id: string | null) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  music: Music,
  cpu: Cpu,
  tech: Cpu,
  technology: Cpu,
  business: Briefcase,
  sports: Trophy,
  arts: Palette,
  food: UtensilsCrossed,
  health: Heart,
  science: Atom,
  community: Users,
};

function getCategoryIcon(iconName?: string): LucideIcon {
  if (!iconName) return LayoutGrid;
  return ICON_MAP[iconName.toLowerCase()] ?? LayoutGrid;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelect,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -200 : 200;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll('left')}
        className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1.5 shadow-sm hover:bg-gray-50 md:flex"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4 text-gray-600" />
      </button>

      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-2 overflow-x-auto px-1 py-1"
        role="tablist"
        aria-label="Event categories"
      >
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
            selectedCategory === null
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          All
        </button>

        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.icon ?? cat.name);
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
                isActive
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              <Icon className="h-4 w-4" />
              {cat.name}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scroll('right')}
        className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1.5 shadow-sm hover:bg-gray-50 md:flex"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
};

export default CategoryFilter;
