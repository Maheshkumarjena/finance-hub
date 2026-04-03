import { Transaction } from '@/store/useFinanceStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

interface Props {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (transaction: Transaction) => void;
}

export function TransactionDrawer({ transaction, open, onClose, onEdit }: Props) {
  if (!transaction) return null;

  const handleEdit = () => {
    onEdit?.(transaction);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Transaction Details</SheetTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 ml-auto"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
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
          {transaction.tags && transaction.tags.length > 0 && (
            <div>
              <span className="text-muted-foreground text-sm">Tags</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {transaction.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
