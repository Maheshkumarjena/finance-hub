import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFinanceStore, CATEGORIES_LIST, Transaction } from '@/store/useFinanceStore';
import { TagSelector } from '@/components/TagSelector';

interface Props {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

interface FormState {
  date: string;
  amount: string;
  category: string;
  type: 'income' | 'expense';
  description: string;
  tags: string[];
}

interface FormErrors {
  amount?: string;
  description?: string;
  date?: string;
}

export function TransactionModal({ transaction, open, onClose }: Props) {
  const { addTransaction, updateTransaction } = useFinanceStore();
  const isEditing = !!transaction;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<FormState>({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Food',
    type: 'expense' as 'income' | 'expense',
    description: '',
    tags: [] as string[],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (transaction) {
      setForm({
        date: transaction.date,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
        description: transaction.description,
        tags: transaction.tags || [],
      });
    } else {
      setForm({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: 'Food',
        type: 'expense',
        description: '',
        tags: [],
      });
    }
    setErrors({});
    setTouched(new Set());
    setIsSubmitting(false);
  }, [transaction, open]);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.amount || parseFloat(form.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!form.date) {
      newErrors.date = 'Date is required';
    }
    const selectedDate = new Date(form.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      newErrors.date = 'Cannot select a future date';
    }

    return newErrors;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));
    const newErrors = validateForm();
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(new Set(['amount', 'description', 'date']));

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the errors above', { description: 'Check all required fields' });
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        date: form.date,
        amount: parseFloat(form.amount),
        category: form.category,
        type: form.type,
        description: form.description,
        tags: form.tags,
      };

      if (isEditing) {
        updateTransaction(transaction.id, data);
        toast.success(`Transaction updated`, { description: `Category: ${data.category}` });
      } else {
        addTransaction(data);
        toast.success(`Transaction added`, { description: `Category: ${data.category}` });
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAmountError = touched.has('amount') && errors.amount;
  const hasDescriptionError = touched.has('description') && errors.description;
  const hasDateError = touched.has('date') && errors.date;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{isEditing ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          {/* Date Field */}
          <div>
            <Label className="text-xs sm:text-sm font-medium">Date</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              onBlur={() => handleBlur('date')}
              className={`text-xs sm:text-sm h-8 sm:h-9 mt-1 ${hasDateError ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {hasDateError && (
              <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                {errors.date}
              </div>
            )}
          </div>

          {/* Amount and Category Row */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <Label className="text-xs sm:text-sm font-medium">Amount</Label>
              <div className="relative mt-1">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  onBlur={() => handleBlur('amount')}
                  className={`text-xs sm:text-sm h-8 sm:h-9 ${hasAmountError ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
              </div>
              {hasAmountError && (
                <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  {errors.amount}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Enter amount in dollars</p>
            </div>
            <div>
              <Label className="text-xs sm:text-sm font-medium">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES_LIST.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description Field */}
          <div>
            <Label className="text-xs sm:text-sm font-medium">Description</Label>
            <Input
              placeholder="e.g., Groceries, Gas, Salary"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              onBlur={() => handleBlur('description')}
              maxLength={50}
              className={`text-xs sm:text-sm h-8 sm:h-9 mt-1 ${hasDescriptionError ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {hasDescriptionError && (
              <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                {errors.description}
              </div>
            )}
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">Be specific for better tracking</p>
              <span className="text-xs text-muted-foreground">{form.description.length}/50</span>
            </div>
          </div>

          {/* Type Field */}
          <div>
            <Label className="text-xs sm:text-sm font-medium">Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as 'income' | 'expense' })}>
              <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <TagSelector
            selectedTags={form.tags}
            onTagsChange={(tags) => setForm({ ...form, tags })}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm h-8 sm:h-9"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs sm:text-sm h-8 sm:h-9"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditing ? 'Saving...' : 'Adding...'}
                </div>
              ) : (
                isEditing ? 'Save Changes' : 'Add Transaction'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
