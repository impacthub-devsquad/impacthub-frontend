import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg rounded-2xl shadow-sm border">
        <CardContent className="p-8 sm:p-10 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <SearchX className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">Erro 404</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Página não encontrada
            </h1>
            <p className="text-sm text-muted-foreground">
              Não encontramos o conteúdo que você tentou acessar. Volte para a
              página inicial e continue explorando o ImpactHub.
            </p>
          </div>

          <Button asChild className="rounded-full px-6">
            <Link to="/home">Ir para Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
