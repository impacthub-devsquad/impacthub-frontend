import { MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CategoryBadge from "./CategoryBadge";
import type { ONG } from "@/lib/ongs";
import { followOng, unfollowOng } from "@/lib/ongs";
import { useState } from "react";

const ONGCard = ({ ong }: { ong: ONG }) => {
  const navigate = useNavigate();
  const [following, setFollowing] = useState(ong.isFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      if (following) {
        await unfollowOng(ong.id);
      } else {
        await followOng(ong.id);
      }
      setFollowing(!following);
    } catch (e) {
      console.error("Erro ao seguir/deixar de seguir ONG", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/ongs/${ong.id}`)}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
            {ong.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{ong.name}</p>
            {ong.city && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={12} />
                <span>{ong.city}</span>
              </div>
            )}
          </div>
        </div>
        <CategoryBadge category={ong.category} />
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {ong.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users size={14} />
            <span>{(ong.followers ?? 0).toLocaleString()} seguidores</span>
          </div>
          <Button
            size="sm"
            variant={following ? "secondary" : "default"}
            onClick={handleFollow}
            disabled={loading}
            className="rounded-full text-xs px-4"
          >
            {loading ? "..." : following ? "Seguindo" : "Seguir"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ONGCard;
