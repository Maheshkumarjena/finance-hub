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
  category?: string;
}

const MAX_AMOUNT = 999999.99;
const MIN_AMOUNT = 0.01;
const MAX_DESCRIPTION_LENGTH = 100;

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

    // Date validation
    if (!form.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        newErrors.date = 'Cannot select a future date';
      }
    }

    // Amount validation
    if (!form.amount || form.amount.trim() === '') {
      newErrors.amount = 'Amount is required';
    } else {
      const amountNum = parseFloat(form.amount);
      if (isNaN(amountNum)) {
        newErrors.amount = 'Please enter a valid number';
      } else if (amountNum < MIN_AMOUNT) {
        newErrors.amount = `Amount must be at least $${MIN_AMOUNT.toFixed(2)}`;
      } else if (amountNum > MAX_AMOUNT) {
        newErrors.amount = `Amount cannot exceed $${MAX_AMOUNT.toLocaleString()}`;
      }
    }

    // Category validation
    if (!form.category || !CATEGORIES_LIST.includes(form.category)) {
      newErrors.category = 'Please select a valid category';
    }

    // Description validation
    if (!form.description || form.description.trim() === '') {
      newErrors.description = 'Description is required';
    } else if (form.description.trim().length < 2) {
      newErrors.description = 'Description must be at least 2 characters';
    }

    return newErrors;
  };

  const handleFieldChange = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(new Set(['amount', 'description', 'date', 'category']));

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix validation errors', { 
        description: 'Check highlighted fields above' 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        date: form.date,
        amount: parseFloat(form.amount),
        category: form.category,
        type: form.type,
        description: form.description.trim(),
        tags: form.tags,
      };

      if (isEditing) {
        updateTransaction(transaction.id, data);
        toast.success('Transaction updated', { description: `Amount: $${data.amount.toFixed(2)}` });
      } else {
        addTransaction(data);
        toast.success('Transaction added', { description: `Amount: $${data.amount.toFixed(2)}` });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save transaction:', error);
      toast.error('Failed to save transaction', { description: 'Please try again' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAmountError = touched.has('amount') && errors.amount;
  const hasDescriptionError = touched.has('description') && errors.description;
  const hasDateError = touched.has('date') && errors.date;
  const hasCategoryError = touched.has('category') && errors.category;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{isEditing ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 mt-2">
          {/* Date Field */}
          <div>
            <Label className="text-xs sm:text-sm font-medium text-foreground">
              Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => handleFieldChange('date', e.target.value)}
              onBlur={() => handleBlur('date')}
              disabled={isSubmitting}
              className={`text-xs sm:text-sm h-8 sm:h-9 mt-1.5 transition-colors ${
                hasDateError 
                  ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-950/20' 
                  : touched.has('date') 
                  ? 'border-green-500 focus:ring-green-500'
                  : ''
              }`}
            />
            {hasDateError ? (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 rounded">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{errors.date}</span>
              </div>
            ) : touched.has('date') ? (
              <div className="text-xs text-green-600 dark:text-green-400 mt-1.5">✓ Valid date</div>
            ) : null}
          </div>

          {/* Amount and Category Row */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <Label className="text-xs sm:text-sm font-medium text-foreground">
                Amount <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1.5 flex items-center">
                <span className={`text-xs sm:text-sm font-medium transition-colors p-2 ${
                  hasAmountError 
                    ? 'text-red-500' 
                    : touched.has('amount') 
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-muted-foreground'
                }`}>
                  $
                </span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => handleFieldChange('amount', e.target.value)}
                  onBlur={() => handleBlur('amount')}
                  disabled={isSubmitting}
                  max={MAX_AMOUNT}
                  className={`text-xs sm:text-sm h-8 sm:h-9 flex-1 pl-0 transition-colors ${
                    hasAmountError 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-950/20' 
                      : touched.has('amount') 
                      ? 'border-green-500 focus:ring-green-500'
                      : ''
                  }`}
                />
              </div>
              {hasAmountError ? (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 rounded">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{errors.amount}</span>
                </div>
              ) : touched.has('amount') ? (
                <div className="text-xs text-green-600 dark:text-green-400 mt-1.5">✓ Valid amount</div>
              ) : null}
              <p className="text-xs text-muted-foreground mt-1">0.01 - $999,999.99</p>
            </div>
            <div>
              <Label className="text-xs sm:text-sm font-medium text-foreground">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={form.category} 
                onValueChange={(v) => handleFieldChange('category', v)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={`h-8 sm:h-9 text-xs sm:text-sm mt-1.5 transition-colors ${
                  hasCategoryError 
                    ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-950/20' 
                    : touched.has('category') 
                    ? 'border-green-500 focus:ring-green-500'
                    : ''
                }`}>
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
              {hasCategoryError ? (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 rounded">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{errors.category}</span>
                </div>
              ) : touched.has('category') ? (
                <div className="text-xs text-green-600 dark:text-green-400 mt-1.5">✓ Valid category</div>
              ) : null}
            </div>
          </div>

          {/* Description Field */}
          <div>
            <Label className="text-xs sm:text-sm font-medium text-foreground">
              Description <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g., Groceries at Whole Foods, Monthly electricity bill"
              value={form.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              maxLength={MAX_DESCRIPTION_LENGTH}
              disabled={isSubmitting}
              className={`text-xs sm:text-sm h-8 sm:h-9 mt-1.5 transition-colors ${
                hasDescriptionError 
                  ? 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-950/20' 
                  : touched.has('description') 
                  ? 'border-green-500 focus:ring-green-500'
                  : ''
              }`}
            />
            {hasDescriptionError ? (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 rounded">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{errors.description}</span>
              </div>
            ) : touched.has('description') ? (
              <div className="text-xs text-green-600 dark:text-green-400 mt-1.5">✓ Valid description</div>
            ) : null}
            <div className="flex justify-between items-center mt-1.5">
              <p className="text-xs text-muted-foreground">Be specific for better tracking</p>
              <span className={`text-xs ${
                form.description.length > MAX_DESCRIPTION_LENGTH * 0.8
                  ? 'text-orange-600 dark:text-orange-400 font-medium'
                  : 'text-muted-foreground'
              }`}>
                {form.description.length}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
          </div>

          {/* Type Field */}
          <div>
            <Label className="text-xs sm:text-sm font-medium text-foreground">Type</Label>
            <Select 
              value={form.type} 
              onValueChange={(v) => handleFieldChange('type', v as 'income' | 'expense')}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income (Green)</SelectItem>
                <SelectItem value="expense">Expense (Red)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <TagSelector
              selectedTags={form.tags}
              onTagsChange={(tags) => handleFieldChange('tags', tags)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2 sm:pt-4">
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
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isEditing ? 'Saving...' : 'Adding...'}</span>
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
