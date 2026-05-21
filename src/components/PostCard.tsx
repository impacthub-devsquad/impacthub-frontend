import { Heart, MessageCircle, Share2, Send } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategoryBadge from "./CategoryBadge";
import type { Event } from "@/lib/events";
import { likeEvent, unlikeEvent } from "@/lib/events";

const PostCard = ({ post }: { post: Event }) => {
  const [liked, setLiked] = useState(post.isLiked ?? false);
  const [likes, setLikes] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [shared, setShared] = useState(false);

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikeEvent(post.id);
        setLikes((prev) => prev - 1);
      } else {
        await likeEvent(post.id);
        setLikes((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (err) {
      console.error("Erro ao curtir:", err);
    }
  };

  const handleComment = () => {
    if (newComment.trim()) {
      setComments((prev) => [...prev, newComment.trim()]);
      setNewComment("");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {post.ongName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{post.ongName}</p>
            <p className="text-xs text-muted-foreground">{post.createdAt}</p>
          </div>
          <CategoryBadge category={post.category} />
        </div>

        {/* Título */}
        {post.title && (
          <p className="font-semibold text-sm mb-1">{post.title}</p>
        )}

        {/* Conteúdo */}
        <p className="text-sm leading-relaxed mb-4">{post.content}</p>

        {/* Botões */}
        <div className="flex items-center gap-4 pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`gap-1.5 transition-colors ${liked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-primary"}`}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} /> {likes}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className={`gap-1.5 transition-colors ${showComments ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            <MessageCircle size={16} /> {post.comments + comments.length}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className={`gap-1.5 ml-auto transition-colors ${shared ? "text-green-600" : "text-muted-foreground hover:text-primary"}`}
          >
            <Share2 size={16} />
            {shared ? "Copiado!" : ""}
          </Button>
        </div>

        {/* Seção de comentários */}
        {showComments && (
          <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
            {comments.length > 0 && (
              <div className="space-y-2">
                {comments.map((comment, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      U
                    </div>
                    <div className="bg-muted rounded-xl px-3 py-2 text-sm flex-1">
                      {comment}
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
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
                className="rounded-full text-sm h-8 focus-visible:ring-primary"
              />
              <Button
                size="sm"
                onClick={handleComment}
                disabled={!newComment.trim()}
                className="rounded-full h-8 w-8 p-0"
              >
                <Send size={14} />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
