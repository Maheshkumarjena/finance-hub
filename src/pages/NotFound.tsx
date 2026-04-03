import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="text-center max-w-md">
        <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-2">404</h1>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Tried to access: {location.pathname}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)} className="text-sm">
              Go Back
            </Button>
            <Button onClick={() => navigate("/")} className="text-sm">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
