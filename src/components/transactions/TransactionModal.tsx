import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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

interface Props {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

export function TransactionModal({ transaction, open, onClose }: Props) {
  const { addTransaction, updateTransaction } = useFinanceStore();
  const isEditing = !!transaction;

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Food',
    type: 'expense' as 'income' | 'expense',
    description: '',
  });

  useEffect(() => {
    if (transaction) {
      setForm({
        date: transaction.date,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
        description: transaction.description,
      });
    } else {
      setForm({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: 'Food',
        type: 'expense',
        description: '',
      });
    }
  }, [transaction, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      date: form.date,
      amount: parseFloat(form.amount),
      category: form.category,
      type: form.type,
      description: form.description,
    };

    if (isEditing) {
      updateTransaction(transaction.id, data);
      toast.success(`Transaction updated`, { description: `Category: ${data.category}` });
    } else {
      addTransaction(data);
      toast.success(`Transaction added`, { description: `Category: ${data.category}` });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
<<<<<<< HEAD
      <DialogContent className="max-w-sm">
=======
      <DialogContent className="max-w-sm sm:max-w-md">
>>>>>>> 067612a1f07536c0111fce410abade02169fa000
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{isEditing ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <Label className="text-xs sm:text-sm">Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
<<<<<<< HEAD
                className="text-xs sm:text-sm h-8 sm:h-9"
=======
                className="h-8 sm:h-9 text-xs sm:text-sm"
>>>>>>> 067612a1f07536c0111fce410abade02169fa000
              />
            </div>
            <div>
              <Label className="text-xs sm:text-sm">Amount</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
<<<<<<< HEAD
                className="text-xs sm:text-sm h-8 sm:h-9"
=======
                className="h-8 sm:h-9 text-xs sm:text-sm"
>>>>>>> 067612a1f07536c0111fce410abade02169fa000
              />
            </div>
          </div>

          <div>
            <Label className="text-xs sm:text-sm">Description</Label>
            <Input
              placeholder="Enter description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
<<<<<<< HEAD
              className="text-xs sm:text-sm h-8 sm:h-9"
=======
              className="h-8 sm:h-9 text-xs sm:text-sm"
>>>>>>> 067612a1f07536c0111fce410abade02169fa000
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <Label className="text-xs sm:text-sm">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES_LIST.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs sm:text-sm">Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as 'income' | 'expense' })}>
                <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
<<<<<<< HEAD
            <Button type="button" variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">{isEditing ? 'Save Changes' : 'Add Transaction'}</Button>
=======
            <Button type="button" variant="outline" onClick={onClose} className="h-8 sm:h-9 text-xs sm:text-sm">Cancel</Button>
            <Button type="submit" className="h-8 sm:h-9 text-xs sm:text-sm">{isEditing ? 'Save Changes' : 'Add Transaction'}</Button>
>>>>>>> 067612a1f07536c0111fce410abade02169fa000
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
