import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  ArrowLeft,
  Calendar,
  MapPin,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import CategoryBadge from "@/components/CategoryBadge";
import {
  getOngById,
  getOngEvents,
  followOng,
  unfollowOng,
  type ONGDetail,
  type ONGEvent,
} from "@/lib/ongs";
import Skeleton from "@/components/Skeleton";
import { Card, CardContent } from "@/components/ui/card";

const ONGDetail = () => {
  const { ongId } = useParams<{ ongId: string }>();
  const navigate = useNavigate();
  const [ong, setOng] = useState<ONGDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [events, setEvents] = useState<ONGEvent[]>([]);

  useEffect(() => {
    if (!ongId) return;

    const loadData = async () => {
      try {
        const [ongResponse, eventsResponse] = await Promise.allSettled([
          getOngById(ongId),
          getOngEvents(ongId),
        ]);

        if (ongResponse.status === "fulfilled") {
          setOng(ongResponse.value);
          setFollowing(ongResponse.value.isFollowing);
        } else {
          setError(true);
          return;
        }

        if (eventsResponse.status === "fulfilled") {
          setEvents(eventsResponse.value);
        } else {
          setEvents([]);
        }
      } finally {
        setLoading(false);
      }
    };

    void loadData();
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
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton variant="text" className="h-4 w-24" />
          <Card className="rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <Skeleton variant="circle" className="h-16 w-16" />
                <div className="flex-1 space-y-3">
                  <Skeleton variant="text" className="h-6 w-40" />
                  <Skeleton variant="text" className="h-4 w-56" />
                  <Skeleton variant="text" className="h-6 w-24" />
                </div>
                <Skeleton variant="text" className="h-9 w-24 rounded-full" />
              </div>

              <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
                <Skeleton variant="text" className="h-4 w-28" />
                <Skeleton variant="text" className="h-4 w-28" />
                <Skeleton variant="text" className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6 space-y-3">
              <Skeleton variant="text" className="h-5 w-20" />
              <Skeleton variant="text" className="h-4 w-full" />
              <Skeleton variant="text" className="h-4 w-11/12" />
              <Skeleton variant="text" className="h-4 w-4/5" />
            </CardContent>
          </Card>

          <Skeleton variant="rect" className="h-14 w-full rounded-2xl" />
          <Skeleton variant="rect" className="h-14 w-full rounded-2xl" />
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
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        {/* Header da ONG */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shrink-0 ring-4 ring-primary/5">
              {ong.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight">
                {ong.name}
              </h1>
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
          <div className="flex flex-wrap gap-4 md:gap-6 mt-5 pt-5 border-t border-border">
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
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold mb-2">Sobre</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {ong.description}
            </p>
          </div>
        )}

        {/* Status do usuário */}
        {ong.isInvited && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 text-sm text-primary shadow-sm">
            Você foi convidado para participar desta ONG!
          </div>
        )}
        {ong.isParticipant && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-sm text-green-700 shadow-sm">
            Você é participante desta ONG.
          </div>
        )}

        {/* Eventos da ONG */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Eventos</h2>
              <p className="text-sm text-muted-foreground">
                Confira as próximas ações e publicações desta ONG.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays size={14} />
              Até 10 eventos
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="rounded-2xl">
                  <CardContent className="p-5 space-y-3">
                    <Skeleton variant="text" className="h-5 w-48" />
                    <Skeleton variant="text" className="h-4 w-24" />
                    <Skeleton variant="text" className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : events.length === 0 ? (
            <Card className="rounded-2xl border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">No events for this ONG yet</p>
                  <p className="text-sm text-muted-foreground">
                    Quando houver novos eventos, eles aparecerão aqui.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <Card key={event.id} className="rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <h3 className="text-base font-semibold leading-tight">
                          {event.name}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          {event.date && (
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar size={14} />
                              {event.date}
                            </span>
                          )}
                          {event.location && (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin size={14} />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
};

export default ONGDetail;
