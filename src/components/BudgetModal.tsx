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

    if (!category) {
      newErrors.category = 'Select a category';
    }

    const limitNum = parseFloat(limit);
    if (!limit || isNaN(limitNum) || limitNum <= 0) {
      newErrors.limit = 'Enter an amount greater than $0';
    }

    return newErrors;
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
      onSave(category, parseFloat(limit));
      setCategory('');
      setLimit('');
      setErrors({});
      setTouched(new Set());
      onOpenChange(false);
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
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className={hasCategoryError ? 'border-red-500 focus:ring-red-500' : ''}>
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
            {hasCategoryError && (
              <div className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                {errors.category}
              </div>
            )}
          </div>

          {/* Limit Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Monthly Budget Limit</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">$</span>
              <Input
                type="number"
                placeholder="0.00"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                onBlur={() => handleBlur('limit')}
                min="0"
                step="0.01"
                className={`flex-1 ${hasLimitError ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
            </div>
            {hasLimitError && (
              <div className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                {errors.limit}
              </div>
            )}
            <p className="text-xs text-muted-foreground">We'll alert you when spending approaches this limit</p>
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
