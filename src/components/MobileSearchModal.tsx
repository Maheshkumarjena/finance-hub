import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface MobileSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function MobileSearchModal({
  open,
  onOpenChange,
  searchTerm,
  onSearchChange,
}: MobileSearchModalProps) {
  const [tempSearch, setTempSearch] = useState(searchTerm);

  useEffect(() => {
    if (open) {
      setTempSearch(searchTerm);
    }
  }, [open, searchTerm]);

  const handleSearch = (value: string) => {
    setTempSearch(value);
    onSearchChange(value);
  };

  const handleClear = () => {
    setTempSearch('');
    onSearchChange('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] rounded-lg">
        <DialogHeader className="sr-only">
          <DialogTitle>Search Transactions</DialogTitle>
        </DialogHeader>
        <div className="relative pt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            autoFocus
            type="text"
            placeholder="Search transactions..."
            value={tempSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 pr-9 h-10 bg-secondary border-0 text-base"
          />
          {tempSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Search by transaction description, category, or amount
        </p>
      </DialogContent>
    </Dialog>
  );
}
