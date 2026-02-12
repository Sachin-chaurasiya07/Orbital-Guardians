import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

/**
 * React Query client
 * Handles server-state caching and async data management
 * (useful for future integration with orbital datasets or APIs)
 */
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Provides consistent tooltip behavior across the application */}
      <TooltipProvider>
        {/* UI-level notification systems */}
        <Toaster />
        <Sonner />

        {/* Application routing */}
        <BrowserRouter>
          <Routes>
            {/* Main dashboard / landing page */}
            <Route path="/" element={<Index />} />

            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
