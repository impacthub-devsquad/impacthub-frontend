import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import ONGDetail from "./pages/ONGDetail.tsx";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/home" replace /> : children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Index />
              </PublicRoute>
            }
          />
          <Route
            path="/cadastro"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/recuperar-senha"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/buscar"
            element={
              <PrivateRoute>
                <SearchONGs />
              </PrivateRoute>
            }
          />
          <Route
            path="/notificacoes"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <ONGDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/ongs/:ongId"
            element={
              <PrivateRoute>
                <ONGDetail />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
