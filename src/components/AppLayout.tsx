import { ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Bell, User, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "./Logo";
import Skeleton from "@/components/Skeleton";
import { getMe, type User as LoggedUser } from "@/lib/auth";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Search, label: "Buscar ONGs", path: "/buscar" },
  { icon: Bell, label: "Notificações", path: "/notificacoes" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: User, label: "Perfil", path: "/perfil" },
];

const AppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [user, setUser] = useState<LoggedUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getMe()
      .then((me) => {
        if (mounted) setUser(me);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setUserLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const avatarSrc = user?.avatar || user?.profilePicture || "";
  const avatarFallback = useMemo(() => {
    const label = user?.name?.trim() || user?.username?.trim() || "U";
    return label.charAt(0).toUpperCase();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
        <div className="w-full flex items-center gap-4 px-4 h-16 md:px-6">
          <Link to="/home">
            <Logo size="sm" />
          </Link>
          <div className="flex-1" />
          <Avatar className="w-9 h-9 cursor-pointer ml-auto ring-2 ring-transparent transition-shadow hover:shadow-md">
            {userLoading ? (
              <Skeleton variant="circle" className="h-9 w-9" />
            ) : (
              <>
                <AvatarImage
                  src={avatarSrc}
                  alt={user?.name || user?.username || "Usuário logado"}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {avatarFallback}
                </AvatarFallback>
              </>
            )}
          </Avatar>
        </div>
      </header>

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-60 shrink-0 p-4 gap-1 sticky top-16 h-[calc(100vh-4rem)] ml-4 border-r border-border/70">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/70 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
        <div className="flex justify-around py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-xs transition-colors ${
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground"
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
