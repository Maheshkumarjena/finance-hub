import { Transaction } from '@/store/useFinanceStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

interface Props {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

export function TransactionDrawer({ transaction, open, onClose }: Props) {
  if (!transaction) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Transaction Details</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Type</span>
            <Badge variant={transaction.type === 'income' ? 'default' : 'destructive'}>
              {transaction.type}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Amount</span>
            <span className={`text-lg font-bold ${transaction.type === 'income' ? 'text-income' : 'text-expense'}`}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Date</span>
            <span>{new Date(transaction.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Category</span>
            <Badge variant="secondary">{transaction.category}</Badge>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Description</span>
            <p className="mt-1">{transaction.description}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
