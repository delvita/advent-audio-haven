import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Customize from "./pages/Customize";
import Embed from "./pages/Embed";
import EmbedScript from "./pages/EmbedScript";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 3,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* Handle both /embed.js and embed.js */}
          <Route path="/embed.js" element={<EmbedScript />} />
          <Route path="embed.js" element={<Navigate to="/embed.js" replace />} />
          
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
                <Toaster />
                <Sonner />
                <Index />
              </div>
            }
          />
          <Route
            path="/customize"
            element={
              <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
                <Toaster />
                <Sonner />
                <Customize />
              </div>
            }
          />
          <Route path="/embed/:embedId" element={<Embed />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;