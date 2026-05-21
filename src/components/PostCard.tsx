import { Heart, MessageCircle, Share2, Send } from "lucide-react";
import { useState, useEffect, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategoryBadge from "./CategoryBadge";
import type { Event } from "@/lib/events";
import {
  createEventComment,
  likeEvent,
  unlikeEvent,
  viewEvent,
} from "@/lib/events";

type LocalComment = {
  id: string;
  content: string;
};

const PostCard = ({ post }: { post: Event }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.isLiked ?? false);
  const [likes, setLikes] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<LocalComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [shared, setShared] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    viewEvent(post.id).catch(() => {});
  }, [post.id]);

  const openPost = () => {
    navigate(`/events/${post.id}`);
  };

  const stopCardNavigation = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const handleLike = async () => {
    const nextLiked = !liked;
    const nextLikes = nextLiked ? likes + 1 : likes - 1;

    setLiked(nextLiked);
    setLikes(nextLikes);

    try {
      if (liked) {
        await unlikeEvent(post.id);
      } else {
        await likeEvent(post.id);
      }
    } catch (err) {
      setLiked(liked);
      setLikes(likes);
      console.error("Erro ao curtir:", err);
    }
  };

  const handleComment = async () => {
    const trimmedComment = newComment.trim();

    if (!trimmedComment || commentLoading) {
      return;
    }

    const optimisticComment = {
      id: `local-${Date.now()}`,
      content: trimmedComment,
    };

    setCommentError(null);
    setCommentLoading(true);
    setComments((prev) => [...prev, optimisticComment]);
    setNewComment("");

    try {
      await createEventComment(post.id, { content: trimmedComment });
    } catch (err) {
      setComments((prev) =>
        prev.filter((comment) => comment.id !== optimisticComment.id),
      );
      setNewComment(trimmedComment);
      setCommentError("Não foi possível salvar o comentário.");
      console.error("Erro ao salvar comentário:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md rounded-2xl"
      onClick={openPost}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPost();
        }
      }}
    >
      <CardContent className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm ring-4 ring-primary/5">
            {post.ongName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm leading-tight">
              {post.ongName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {post.createdAt}
            </p>
          </div>
          <CategoryBadge category={post.category} />
        </div>

        {/* Título */}
        {post.title && (
          <p
            className="font-semibold text-sm mb-1"
            onClick={stopCardNavigation}
          >
            {post.title}
          </p>
        )}

        {/* Conteúdo */}
        <p className="text-sm leading-relaxed mb-4 text-foreground/90">
          {post.content}
        </p>

        {/* Botões */}
        <div
          className="flex items-center gap-2 sm:gap-4 pt-4 border-t flex-wrap"
          onClick={stopCardNavigation}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`gap-1.5 rounded-full px-3 transition-all ${liked ? "text-red-500 hover:text-red-600 bg-red-500/5" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} /> {likes}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className={`gap-1.5 rounded-full px-3 transition-all ${showComments ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}
          >
            <MessageCircle size={16} /> {post.comments + comments.length}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className={`gap-1.5 ml-auto rounded-full px-3 transition-all ${shared ? "text-green-600 bg-green-600/5" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}
          >
            <Share2 size={16} />
            {shared ? "Copiado!" : ""}
          </Button>
        </div>

        {/* Seção de comentários */}
        {showComments && (
          <div
            className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2"
            onClick={stopCardNavigation}
          >
            {comments.length > 0 && (
              <div className="space-y-2">
                {comments.map((comment, index) => (
                  <div key={comment.id} className="flex gap-2 items-start">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      U
                    </div>
                    <div className="bg-muted rounded-xl px-3 py-2 text-sm flex-1">
                      {comment.content}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {comments.length === 0 && (
              <p className="text-xs text-muted-foreground text-center">
                Seja o primeiro a comentar!
              </p>
            )}

            <div className="flex gap-2 items-center">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                U
              </div>
              <Input
                placeholder="Escreva um comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onClick={stopCardNavigation}
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
                className="rounded-full text-sm h-8 focus-visible:ring-primary"
              />
              <Button
                size="sm"
                onClick={handleComment}
                disabled={!newComment.trim() || commentLoading}
                className="rounded-full h-8 w-8 p-0"
              >
                <Send size={14} />
              </Button>
            </div>
            {commentError && (
              <p className="text-xs text-destructive">{commentError}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
