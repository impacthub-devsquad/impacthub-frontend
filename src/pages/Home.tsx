import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import PostCard from "@/components/PostCard";
import { getEvents } from "@/lib/events";
import type { Event } from "@/lib/events";

const Home = () => {
  const [posts, setPosts] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEvents()
      .then(setPosts)
      .catch(() => setError("Erro ao carregar o feed."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto space-y-4 w-full">
        <h1 className="text-xl font-bold mb-2">Feed</h1>

        {loading && (
          <p className="text-center text-muted-foreground py-12">
            Carregando feed...
          </p>
        )}
        {error && <p className="text-center text-red-500 py-12">{error}</p>}

        {!loading &&
          !error &&
          posts.map((post) => <PostCard key={post.id} post={post} />)}

        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            Nenhum evento no feed ainda.
          </p>
        )}
      </div>
    </AppLayout>
  );
};

export default Home;
