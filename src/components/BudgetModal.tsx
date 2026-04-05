import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES_LIST } from '@/store/useFinanceStore';

interface BudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (category: string, limit: number) => void;
  initialCategory?: string;
  initialLimit?: number;
  title?: string;
}

interface FormErrors {
  category?: string;
  limit?: string;
}

const MAX_BUDGET_LIMIT = 1000000; // $1M max
const MIN_BUDGET_LIMIT = 0.01; // $0.01 min

export function BudgetModal({
  open,
  onOpenChange,
  onSave,
  initialCategory,
  initialLimit,
  title = 'Add Budget',
}: BudgetModalProps) {
  const [category, setCategory] = useState(initialCategory || '');
  const [limit, setLimit] = useState(initialLimit?.toString() || '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Category validation
    if (!category || category.trim() === '') {
      newErrors.category = 'Please select a category';
    }

    // Limit validation
    if (!limit || limit.trim() === '') {
      newErrors.limit = 'Budget limit is required';
    } else {
      const limitNum = parseFloat(limit);
      if (isNaN(limitNum)) {
        newErrors.limit = 'Please enter a valid number';
      } else if (limitNum < MIN_BUDGET_LIMIT) {
        newErrors.limit = `Budget must be at least $${MIN_BUDGET_LIMIT.toFixed(2)}`;
      } else if (limitNum > MAX_BUDGET_LIMIT) {
        newErrors.limit = `Budget cannot exceed $${MAX_BUDGET_LIMIT.toLocaleString()}`;
      }
    }

    return newErrors;
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'category') setCategory(value);
    if (field === 'limit') setLimit(value);
    
    // Real-time validation if field has been touched
    if (touched.has(field)) {
      const newErrors = validateForm();
      setErrors(newErrors);
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));
    const newErrors = validateForm();
    setErrors(newErrors);
  };

  const handleSave = async () => {
    setTouched(new Set(['category', 'limit']));
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const limitAmount = parseFloat(limit);
      if (isNaN(limitAmount) || limitAmount <= 0) {
        throw new Error('Invalid budget amount');
      }
      
      onSave(category, limitAmount);
      setCategory('');
      setLimit('');
      setErrors({});
      setTouched(new Set());
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save budget:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save budget';
      setErrors({ limit: `${errorMessage}. Please try again.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasCategoryError = touched.has('category') && errors.category;
  const hasLimitError = touched.has('limit') && errors.limit;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Set a monthly spending limit for a category to track expenses</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Category Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Category <span className="text-red-500">*</span>
            </label>
            <Select value={category} onValueChange={(v) => handleChange('category', v)}>
              <SelectTrigger 
                className={`transition-colors ${
                  hasCategoryError 
                    ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-950/20' 
                    : touched.has('category') 
                    ? 'border-green-500 focus:ring-green-500'
                    : ''
                }`}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES_LIST.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasCategoryError ? (
              <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 rounded">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{errors.category}</span>
              </div>
            ) : touched.has('category') ? (
              <div className="text-xs text-green-600 dark:text-green-400">✓ Valid selection</div>
            ) : null}
          </div>

          {/* Limit Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Monthly Budget Limit <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium transition-colors ${
                hasLimitError 
                  ? 'text-red-500' 
                  : touched.has('limit') 
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-muted-foreground'
              }`}>
                $
              </span>
              <Input
                type="number"
                placeholder="0.00"
                value={limit}
                onChange={(e) => handleChange('limit', e.target.value)}
                onBlur={() => handleBlur('limit')}
                min="0"
                step="0.01"
                max={MAX_BUDGET_LIMIT}
                disabled={isSubmitting}
                className={`flex-1 transition-colors ${
                  hasLimitError 
                    ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-950/20' 
                    : touched.has('limit') 
                    ? 'border-green-500 focus:ring-green-500'
                    : ''
                }`}
              />
            </div>
            {hasLimitError ? (
              <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 rounded">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{errors.limit}</span>
              </div>
            ) : touched.has('limit') ? (
              <div className="text-xs text-green-600 dark:text-green-400">✓ Valid amount</div>
            ) : null}
            <p className="text-xs text-muted-foreground">We'll alert you when spending approaches 80% of this limit</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              'Save Budget'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
