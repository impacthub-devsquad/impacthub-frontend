import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AppLayout from "@/components/AppLayout";
import ONGCard from "@/components/ONGCard";
import { categories } from "@/data/mockData";
import { getOngs } from "@/lib/ongs";
import type { ONG } from "@/lib/ongs";

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

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Buscar ONGs</h1>

        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Buscar por nome ou causa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 rounded-full bg-card border focus-visible:ring-primary"
          />
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !activeFilter
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(activeFilter === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeFilter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && (
          <p className="text-center text-muted-foreground py-12">
            Carregando ONGs...
          </p>
        )}
        {error && <p className="text-center text-red-500 py-12">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((ong) => (
              <ONGCard key={ong.id} ong={ong} />
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12 col-span-2">
                Nenhuma ONG encontrada com esses critérios.
              </p>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SearchONGs;
