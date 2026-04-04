import { Search, Bell, Moon, Sun, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useFinanceStore } from '@/store/useFinanceStore';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function TopNavbar() {
  const { filters, setFilters, darkMode, toggleDarkMode } =
    useFinanceStore();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-2 motion-safe:animate-fade-in supports-[backdrop-filter]:bg-card/90 supports-[backdrop-filter]:backdrop-blur sm:gap-3 sm:px-4">
      <SidebarTrigger className="mr-1 transition-transform duration-200 hover:scale-105 active:scale-95" />

      {/* Search bar - responsive width */}
      <div className="group relative flex max-w-xs flex-1 sm:max-w-md">
        <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground transition-[color,transform] duration-200 group-focus-within:scale-105 group-focus-within:text-foreground sm:h-4 sm:w-4" />
        <Input
          placeholder="Search..."
          value={filters.searchTerm}
          onChange={(e) => setFilters({ searchTerm: e.target.value })}
          className="h-8 border-0 bg-secondary pl-8 text-xs transition-[background-color,box-shadow,transform] duration-200 focus-visible:bg-background focus-visible:shadow-sm motion-safe:focus-visible:-translate-y-px sm:h-9 sm:pl-9 sm:text-sm"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="group h-8 w-8 transition-transform duration-200 hover:scale-105 active:scale-95 sm:h-9 sm:w-9"
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:rotate-12" />
              ) : (
                <Moon className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:-rotate-12" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle dark mode</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="group relative h-8 w-8 overflow-hidden transition-transform duration-200 hover:scale-105 active:scale-95 sm:h-9 sm:w-9"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5" />
              <span
                className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary transition-transform duration-200 motion-safe:group-hover:scale-125"
                aria-hidden="true"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary transition-transform duration-200 hover:scale-105 sm:h-8 sm:w-8">
          <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
        </div>
      </div>
    </header>
  );
}
