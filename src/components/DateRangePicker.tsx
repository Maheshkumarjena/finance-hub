import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Calendar, X } from 'lucide-react';

interface DateRangePickerProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onClear: () => void;
}

export function DateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClear,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const isActive = dateFrom || dateTo;

  const formatDisplay = () => {
    if (!dateFrom && !dateTo) return 'Date Range';
    if (dateFrom && dateTo) {
      const from = new Date(dateFrom).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const to = new Date(dateTo).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      return `${from} - ${to}`;
    }
    if (dateFrom) {
      return `From ${new Date(dateFrom).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}`;
    }
    return `Until ${new Date(dateTo).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isActive ? 'default' : 'outline'}
          size="sm"
          className="h-8 sm:h-9 text-xs sm:text-sm"
        >
          <Calendar className="h-4 w-4 mr-2" />
          {formatDisplay()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="start">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              From Date
            </label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="text-xs h-8"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              To Date
            </label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className="text-xs h-8"
            />
          </div>
          {isActive && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                onClear();
                setOpen(false);
              }}
            >
              <X className="h-3 w-3 mr-1" />
              Clear Dates
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
