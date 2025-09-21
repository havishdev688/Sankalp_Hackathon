import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Patterns from "./pages/Patterns";
import Submit from "./pages/Submit";
import Dashboard from "./pages/Dashboard";
import Framework from "./pages/Framework";
import Protection from "./pages/Protection";
import CancellationAssistant from "./pages/CancellationAssistant";
import Education from "./pages/Education";
import CompanyAccountability from "./pages/CompanyAccountability";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/patterns" element={<Patterns />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/framework" element={<Framework />} />
            <Route path="/protection" element={<Protection />} />
            <Route path="/cancellation-assistant" element={<CancellationAssistant />} />
            <Route path="/education" element={<Education />} />
            <Route path="/accountability" element={<CompanyAccountability />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
