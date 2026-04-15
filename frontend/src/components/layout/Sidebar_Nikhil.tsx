import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: string | number;
}

interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'sticky top-16 flex h-[calc(100vh-4rem)] flex-col border-r border-gray-200 bg-white transition-all duration-200',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-orange-500')} />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-semibold',
                        isActive
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex w-full items-center justify-center rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
