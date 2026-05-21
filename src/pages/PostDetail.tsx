import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Heart,
  MessageCircle,
  Send,
  User,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import Skeleton from "@/components/Skeleton";
import CategoryBadge from "@/components/CategoryBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createEventComment, type CommentPayload } from "@/lib/events";
import { getPostById, likePost, unlikePost, type Post } from "@/lib/posts";

type LocalComment = {
  id: string;
  content: string;
};

const PostDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<LocalComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    getPostById(eventId)
      .then((data) => {
        setPost(data);
        setNotFound(false);
        setLiked(data.isLiked ?? false);
        setLikes(data.likes);
        setComments([]);
        setCommentText("");
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "";
        if (message.includes("404")) {
          setNotFound(true);
          return;
        }
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleLike = async () => {
    if (!post || likeLoading) return;

    const nextLiked = !liked;
    const nextLikes = nextLiked ? likes + 1 : likes - 1;

    setActionError(null);
    setLiked(nextLiked);
    setLikes(nextLikes);
    setLikeLoading(true);

    try {
      if (nextLiked) {
        await likePost(post.id);
      } else {
        await unlikePost(post.id);
      }
    } catch (error) {
      setLiked(!nextLiked);
      setLikes(likes);
      setActionError("Não foi possível atualizar o like.");
      console.error("Erro ao atualizar like:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async () => {
    if (!post || commentLoading) return;

    const trimmedComment = commentText.trim();
    if (!trimmedComment) return;

    const optimisticComment: LocalComment = {
      id: `local-${Date.now()}`,
      content: trimmedComment,
    };
    const payload: CommentPayload = { content: trimmedComment };

    setActionError(null);
    setCommentLoading(true);
    setComments((prev) => [...prev, optimisticComment]);
    setCommentText("");

    try {
      await createEventComment(post.id, payload);
    } catch (error) {
      setComments((prev) =>
        prev.filter((comment) => comment.id !== optimisticComment.id),
      );
      setCommentText(trimmedComment);
      setActionError("Não foi possível salvar o comentário.");
      console.error("Erro ao salvar comentário:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto space-y-4 w-full">
          <Button
            variant="ghost"
            className="w-fit rounded-full px-0 hover:bg-transparent"
          >
            <Skeleton variant="text" className="h-4 w-20" />
          </Button>

          <Card className="rounded-2xl">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <Skeleton variant="circle" className="h-12 w-12" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="h-5 w-40" />
                  <Skeleton variant="text" className="h-4 w-24" />
                </div>
                <Skeleton variant="text" className="h-6 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton variant="text" className="h-6 w-3/4" />
                <Skeleton variant="text" className="h-4 w-full" />
                <Skeleton variant="text" className="h-4 w-11/12" />
                <Skeleton variant="text" className="h-4 w-4/5" />
              </div>
              <div className="flex gap-3 pt-3 border-t">
                <Skeleton variant="text" className="h-8 w-24 rounded-full" />
                <Skeleton variant="text" className="h-8 w-24 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (notFound || !post) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          <Card className="rounded-2xl border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold">Post não encontrado</p>
                <p className="text-sm text-muted-foreground">
                  O conteúdo pode ter sido removido ou está indisponível.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-4 w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base ring-4 ring-primary/5 shrink-0">
                {post.ongName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold leading-tight">{post.ongName}</p>
                  <Badge variant="outline" className="rounded-full">
                    Autor
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {post.createdAt}
                </p>
              </div>
              <CategoryBadge category={post.category} />
            </div>

            {post.title && (
              <h1 className="text-2xl font-semibold tracking-tight leading-tight">
                {post.title}
              </h1>
            )}

            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {post.content}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t text-sm text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={likeLoading}
                className={`gap-1.5 rounded-full px-3 transition-all ${liked ? "text-red-500 hover:text-red-600 bg-red-500/5" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}
              >
                <Heart size={16} fill={liked ? "currentColor" : "none"} />
                {likes}
              </Button>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5">
                <MessageCircle className="h-4 w-4" />
                {post.comments + comments.length} comentários
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5">
                <User className="h-4 w-4" />
                {post.ongName}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Comentários
                </h2>
                <p className="text-sm text-muted-foreground">
                  Compartilhe uma mensagem sobre este post.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      U
                    </div>
                    <div className="flex-1 rounded-2xl bg-muted/50 px-3 py-2 text-sm">
                      {comment.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground text-center">
                  Ainda não há comentários neste post.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Escreva um comentário..."
                className="min-h-24 rounded-2xl resize-none"
              />
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  O comentário será publicado assim que salvar.
                </p>
                <Button
                  onClick={handleComment}
                  disabled={!commentText.trim() || commentLoading}
                  className="rounded-full"
                >
                  <Send className="h-4 w-4" />
                  Enviar
                </Button>
              </div>
            </div>

            {actionError && (
              <p className="text-sm text-destructive">{actionError}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PostDetail;
