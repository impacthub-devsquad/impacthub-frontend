import { useState, useEffect, useMemo } from "react";
import { SearchX } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import PostCard from "@/components/PostCard";
import { getEvents } from "@/lib/events";
import type { Event } from "@/lib/events";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOngs, type ONG } from "@/lib/ongs";
import Skeleton from "@/components/Skeleton";

const Home = () => {
  const [posts, setPosts] = useState<Event[]>([]);
  const [ongs, setOngs] = useState<ONG[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOngId, setSelectedOngId] = useState<string>("all");
  const [ongLoading, setOngLoading] = useState(true);

  const skeletonItems = Array.from({ length: 3 });
  const followedOngs = useMemo(
    () => ongs.filter((ong) => ong.isFollowing),
    [ongs],
  );

  useEffect(() => {
    getEvents()
      .then(setPosts)
      .catch(() => setError("Erro ao carregar o feed."))
      .finally(() => setLoading(false));

    getOngs()
      .then(setOngs)
      .catch(() => setOngs([]))
      .finally(() => setOngLoading(false));
  }, []);

  const filteredPosts = useMemo(() => {
    if (selectedOngId === "all") return posts;
    return posts.filter((post) => post.ongId === selectedOngId);
  }, [posts, selectedOngId]);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-5 w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Feed</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe as publicações mais recentes das ONGs.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Filtrar por ONGs que você segue
          </p>
          <Select
            value={selectedOngId}
            onValueChange={setSelectedOngId}
            disabled={ongLoading || followedOngs.length === 0}
          >
            <SelectTrigger className="h-11 rounded-xl bg-card/90">
              <SelectValue placeholder="Todas as ONGs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {followedOngs.map((ong) => (
                <SelectItem key={ong.id} value={ong.id}>
                  {ong.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {followedOngs.length === 0 && !ongLoading && (
            <p className="text-xs text-muted-foreground">
              Siga uma ONG para filtrar os eventos dela aqui.
            </p>
          )}
        </div>

        {loading && (
          <div className="space-y-4">
            {skeletonItems.map((_, index) => (
              <Card key={index} className="rounded-2xl">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton variant="circle" className="h-10 w-10" />
                    <div className="flex-1 space-y-2">
                      <Skeleton variant="text" className="w-32" />
                      <Skeleton variant="text" className="h-3 w-20" />
                    </div>
                    <Skeleton variant="text" className="h-6 w-20" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton variant="text" className="w-full" />
                    <Skeleton variant="text" className="w-11/12" />
                    <Skeleton variant="text" className="w-4/5" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Skeleton
                      variant="text"
                      className="h-9 w-24 rounded-full"
                    />
                    <Skeleton
                      variant="text"
                      className="h-9 w-24 rounded-full"
                    />
                    <Skeleton
                      variant="text"
                      className="ml-auto h-9 w-20 rounded-full"
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

        {!loading &&
          !error &&
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)}

        {!loading && !error && posts.length === 0 && (
          <Card className="rounded-2xl border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <SearchX className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold">Nenhum evento no feed ainda</p>
                <p className="text-sm text-muted-foreground">
                  Quando as ONGs publicarem novidades, elas vão aparecer aqui.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading &&
          !error &&
          posts.length > 0 &&
          filteredPosts.length === 0 && (
            <Card className="rounded-2xl border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <SearchX className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">
                    Nenhum evento para esta ONG seguida
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Selecione outra ONG que você segue ou volte para a lista
                    completa.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    </AppLayout>
  );
};

export default Home;
