import { Search, Bell, Moon, Sun, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useFinanceStore } from '@/store/useFinanceStore';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function TopNavbar() {
  const { role, setRole, filters, setFilters, darkMode, toggleDarkMode } =
    useFinanceStore();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-2 sm:px-4 gap-2 sm:gap-3 shrink-0">
      <SidebarTrigger className="mr-1" />

      {/* Search bar - hidden on mobile, visible on tablet and up */}
      <div className="hidden sm:flex relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          value={filters.searchTerm}
          onChange={(e) => setFilters({ searchTerm: e.target.value })}
          className="pl-9 h-9 bg-secondary border-0"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Role toggle - hidden on mobile, visible on tablet and up */}
        <div className="hidden sm:flex items-center gap-1 sm:gap-2">
          <span className={`text-xs font-medium ${role === 'viewer' ? 'text-foreground' : 'text-muted-foreground'}`}>
            View
          </span>
          <Switch
            checked={role === 'admin'}
            onCheckedChange={(checked) => setRole(checked ? 'admin' : 'viewer')}
            className="scale-75 sm:scale-100"
          />
          <span className={`text-xs font-medium ${role === 'admin' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Admin
          </span>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 sm:h-9 w-8 sm:w-9" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle dark mode</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 sm:h-9 w-8 sm:w-9 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        <div className="h-7 sm:h-8 w-7 sm:w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
        </div>
      </div>
    </header>
  );
}
