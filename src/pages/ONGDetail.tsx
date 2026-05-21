import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Users, ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import CategoryBadge from "@/components/CategoryBadge";
import { getOngById, followOng, unfollowOng, type ONGDetail } from "@/lib/ongs";

const ONGDetail = () => {
  const { ongId } = useParams<{ ongId: string }>();
  const navigate = useNavigate();
  const [ong, setOng] = useState<ONGDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (!ongId) return;
    getOngById(ongId)
      .then((data) => {
        setOng(data);
        setFollowing(data.isFollowing);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [ongId]);

  const handleFollow = async () => {
    if (!ongId) return;
    setFollowLoading(true);
    try {
      if (following) {
        await unfollowOng(ongId);
      } else {
        await followOng(ongId);
      }
      setFollowing(!following);
    } catch (e) {
      console.error("Erro ao seguir/deixar de seguir ONG", e);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto py-16 text-center text-muted-foreground text-sm">
          Carregando...
        </div>
      </AppLayout>
    );
  }

  if (error || !ong) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto py-16 text-center text-muted-foreground text-sm">
          ONG não encontrada.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        {/* Header da ONG */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shrink-0">
              {ong.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold">{ong.name}</h1>
              {ong.title && (
                <p className="text-sm text-muted-foreground">{ong.title}</p>
              )}
              <div className="mt-2">
                <CategoryBadge category={ong.category} />
              </div>
            </div>
            <Button
              size="sm"
              variant={following ? "secondary" : "default"}
              onClick={handleFollow}
              disabled={followLoading}
              className="rounded-full text-xs px-4 shrink-0"
            >
              {followLoading ? "..." : following ? "Seguindo" : "Seguir"}
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-5 pt-5 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={15} />
              <span>
                <span className="font-semibold text-foreground">
                  {ong.followersCount.toLocaleString()}
                </span>{" "}
                seguidores
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={15} />
              <span>
                <span className="font-semibold text-foreground">
                  {ong.participantsCount.toLocaleString()}
                </span>{" "}
                participantes
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={15} />
              <span>
                Desde{" "}
                {new Date(ong.createdAt).toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Descrição */}
        {ong.description && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-4">
            <h2 className="text-sm font-semibold mb-2">Sobre</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {ong.description}
            </p>
          </div>
        )}

        {/* Status do usuário */}
        {ong.isInvited && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 text-sm text-primary">
            Você foi convidado para participar desta ONG!
          </div>
        )}
        {ong.isParticipant && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-sm text-green-700">
            Você é participante desta ONG.
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ONGDetail;
