import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Calendar, X, AlertCircle } from 'lucide-react';

interface DateRangePickerProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onClear: () => void;
}

interface DateErrors {
  fromDate?: string;
  toDate?: string;
}

export function DateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClear,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<DateErrors>({});

  const isActive = dateFrom || dateTo;

  const validateDates = (): DateErrors => {
    const newErrors: DateErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      if (fromDate > today) {
        newErrors.fromDate = 'From date cannot be in the future';
      }
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      if (toDate > today) {
        newErrors.toDate = 'To date cannot be in the future';
      }
    }

    if (dateFrom && dateTo) {
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      if (fromDate > toDate) {
        newErrors.fromDate = 'From date must be before To date';
      }
    }

    return newErrors;
  };

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    if (field === 'from') {
      onDateFromChange(value);
    } else {
      onDateToChange(value);
    }
    // Validate after change
    const newErrors = validateDates();
    setErrors(newErrors);
  };

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
          className="h-8 sm:h-9 text-xs sm:text-sm transition-colors hover:scale-105 active:scale-95"
        >
          <Calendar className="h-4 w-4 mr-2" />
          {formatDisplay()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          {/* From Date */}
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">
              From Date
            </label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => handleDateChange('from', e.target.value)}
              className={`text-xs h-8 transition-colors ${
                errors.fromDate
                  ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-950/20'
                  : dateFrom
                  ? 'border-green-500 focus:ring-green-500'
                  : ''
              }`}
            />
            {errors.fromDate && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 rounded">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{errors.fromDate}</span>
              </div>
            )}
          </div>

          {/* To Date */}
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">
              To Date
            </label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => handleDateChange('to', e.target.value)}
              className={`text-xs h-8 transition-colors ${
                errors.toDate
                  ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-950/20'
                  : dateTo
                  ? 'border-green-500 focus:ring-green-500'
                  : ''
              }`}
            />
            {errors.toDate && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 rounded">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{errors.toDate}</span>
              </div>
            )}
          </div>

          {/* Info Text */}
          {dateFrom && dateTo && !errors.fromDate && !errors.toDate && (
            <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2.5 py-1.5 rounded">
              ✓ Valid date range selected
            </div>
          )}

          {/* Clear Button */}
          {isActive && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs transition-colors hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400"
              onClick={() => {
                onClear();
                setErrors({});
                setOpen(false);
              }}
            >
              <X className="h-3 w-3 mr-1.5" />
              Clear Dates
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
