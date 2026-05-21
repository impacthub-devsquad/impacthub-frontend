import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Register from "./pages/Register.tsx";
import Home from "./pages/Home.tsx";
import SearchONGs from "./pages/SearchONGs.tsx";
import NotFound from "./pages/NotFound.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import Notifications from "./pages/Notifications.tsx";
import Perfil from "./pages/Perfil.tsx";
import ONGDashboard from "./pages/ONGDashboard.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/buscar" element={<SearchONGs />} />
          <Route path="/notificacoes" element={<Notifications />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/dashboard" element={<ONGDashboard />} />
          <Route path="/recuperar-senha" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
