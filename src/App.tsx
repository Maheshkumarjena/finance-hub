import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { useFinanceStore } from "@/store/useFinanceStore";
import ErrorBoundary from "@/components/ErrorBoundary";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetPage from "./pages/BudgetPage";
import InsightsPage from "./pages/InsightsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const darkMode = useFinanceStore((s) => s.darkMode);

  useEffect(() => {
    // Apply dark mode to document on mount and when it changes
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="bottom-right" />
          <BrowserRouter>
            <AppLayout>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/budgets" element={<BudgetPage />} />
                  <Route path="/insights" element={<InsightsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </AppLayout>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
