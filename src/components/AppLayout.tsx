import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Bell, User, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Logo from "./Logo";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Search, label: "Buscar ONGs", path: "/buscar" },
  { icon: Bell, label: "Notificações", path: "/notificacoes" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: User, label: "Perfil", path: "/perfil" },
];

const AppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="w-full flex items-center gap-4 px-4 h-14">
          <Link to="/home">
            <Logo size="sm" />
          </Link>
          <div className="flex-1" />
          <Avatar className="w-8 h-8 cursor-pointer ml-auto">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              U
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 p-4 gap-1 sticky top-14 h-[calc(100vh-3.5rem)] ml-4">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 pb-20 md:pb-6">{children}</main>
      </div>

      {/* Mobile Bottom Tab */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
