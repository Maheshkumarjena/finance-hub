import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PageErrorFallbackProps {
  pageName?: string;
  onReset?: () => void;
}

export function PageErrorFallback({
  pageName = 'Page',
  onReset,
}: PageErrorFallbackProps) {
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 sm:p-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-center mb-2">
            Unable to Load {pageName}
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            An error occurred while loading this page. Please try again.
          </p>

          <Button
            onClick={handleReset}
            className="w-full gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
