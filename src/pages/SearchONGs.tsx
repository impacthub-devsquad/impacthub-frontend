import { useState, useEffect } from "react";
import { Search, SearchX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";
import ONGCard from "@/components/ONGCard";
import { categories } from "@/data/mockData";
import { getOngs } from "@/lib/ongs";
import type { ONG } from "@/lib/ongs";
import Skeleton from "@/components/Skeleton";

const SearchONGs = () => {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [ongs, setOngs] = useState<ONG[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOngs()
      .then(setOngs)
      .catch(() => setError("Erro ao carregar ONGs."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = ongs.filter((ong) => {
    const matchesQuery =
      ong.name.toLowerCase().includes(query.toLowerCase()) ||
      ong.description.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = !activeFilter || ong.category === activeFilter;
    return matchesQuery && matchesFilter;
  });

  const skeletonItems = Array.from({ length: 4 });

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Buscar ONGs</h1>
          <p className="text-sm text-muted-foreground">
            Filtre por nome, causa ou categoria.
          </p>
        </div>

        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Buscar por nome ou causa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11 rounded-full bg-card/90 border focus-visible:ring-primary"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveFilter(null)}
            className={`h-9 px-4 rounded-full text-xs font-medium transition-all ${
              !activeFilter
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(activeFilter === cat ? null : cat)}
              className={`h-9 px-4 rounded-full text-xs font-medium transition-all ${
                activeFilter === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skeletonItems.map((_, index) => (
              <Card key={index} className="rounded-2xl">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Skeleton
                      variant="circle"
                      className="h-12 w-12 rounded-2xl"
                    />
                    <div className="flex-1 space-y-2">
                      <Skeleton variant="text" className="w-32" />
                      <Skeleton variant="text" className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton variant="text" className="h-6 w-24" />
                  <div className="space-y-2">
                    <Skeleton variant="text" className="w-full" />
                    <Skeleton variant="text" className="w-5/6" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Skeleton variant="text" className="h-4 w-24" />
                    <Skeleton
                      variant="text"
                      className="h-9 w-24 rounded-full"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {error && (
          <Card className="rounded-2xl border-destructive/30 bg-destructive/5">
            <CardContent className="flex items-center gap-3 p-5 text-sm text-destructive">
              <SearchX className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((ong) => (
              <ONGCard key={ong.id} ong={ong} />
            ))}
            {filtered.length === 0 && (
              <Card className="col-span-2 rounded-2xl border-dashed">
                <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <SearchX className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">Nenhuma ONG encontrada</p>
                    <p className="text-sm text-muted-foreground">
                      Tente ajustar o texto da busca ou os filtros de categoria.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SearchONGs;
