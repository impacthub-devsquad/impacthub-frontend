import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";
import { categories, currentUser } from "@/data/mockData";
import type { Post } from "@/data/mockData";

const CreatePost = ({ onPost }: { onPost: (post: Post) => void }) => {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(
    currentUser.category || categories[0]
  );
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) {
      setError("Escreva algo antes de publicar!");
      return;
    }

    if (content.length > 500) {
      setError("O post não pode ter mais de 500 caracteres.");
      return;
    }

    const newPost: Post = {
      id: `p${Date.now()}`,
      ongId: currentUser.ongId!,
      ongName: currentUser.ongName!,
      category,
      content: content.trim(),
      likes: 0,
      isLiked: false,
      comments: 0,
      createdAt: "agora mesmo",
    };

    onPost(newPost);
    setContent("");
    setError("");
  };

  if (currentUser.role !== "ong") return null;

  return (
    <Card className="shadow-sm border-primary/20">
      <CardContent className="p-5">
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {currentUser.ongName?.charAt(0)}
          </div>

          <div className="flex-1 space-y-3">
            <p className="font-semibold text-sm">
              {currentUser.ongName}
            </p>

            <Textarea
              placeholder="Compartilhe uma novidade, ação ou conquista da sua ONG..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError("");
              }}
              className="resize-none focus-visible:ring-primary min-h-[100px]"
              maxLength={500}
            />

            {error && (
              <p className="text-red-500 text-xs">{error}</p>
            )}

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-40 h-8 text-xs rounded-full focus:ring-primary">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="text-xs"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-xs text-muted-foreground">
                  {content.length}/500
                </span>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!content.trim()}
                className="rounded-full gap-2 h-8 px-4 text-sm"
              >
                <Send size={14} />
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;