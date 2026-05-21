import { useState, useEffect } from "react";
import { SearchX } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import PostCard from "@/components/PostCard";
import { getEvents } from "@/lib/events";
import type { Event } from "@/lib/events";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const [posts, setPosts] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const skeletonItems = Array.from({ length: 3 });

  useEffect(() => {
    getEvents()
      .then(setPosts)
      .catch(() => setError("Erro ao carregar o feed."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-5 w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Feed</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe as publicações mais recentes das ONGs.
          </p>
        </div>

        {loading && (
          <div className="space-y-4">
            {skeletonItems.map((_, index) => (
              <Card key={index}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32 rounded-full" />
                      <Skeleton className="h-3 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-full" />
                    <Skeleton className="h-4 w-11/12 rounded-full" />
                    <Skeleton className="h-4 w-4/5 rounded-full" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-9 w-24 rounded-full" />
                    <Skeleton className="h-9 w-24 rounded-full" />
                    <Skeleton className="ml-auto h-9 w-20 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="flex items-center gap-3 p-5 text-sm text-destructive">
              <SearchX className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </CardContent>
          </Card>
        )}

        {!loading &&
          !error &&
          posts.map((post) => <PostCard key={post.id} post={post} />)}

        {!loading && !error && posts.length === 0 && (
          <Card className="border-dashed">
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
      </div>
    </AppLayout>
  );
};

export default Home;
