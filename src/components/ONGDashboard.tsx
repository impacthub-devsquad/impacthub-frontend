import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Loader2,
  PencilLine,
  Plus,
  RefreshCcw,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getMe, type User } from "@/lib/auth";
import { api } from "@/lib/api";
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
  type Event,
  type EventPayload,
} from "@/lib/events";

type FormState = { title: string; description: string };
const initialFormState: FormState = { title: "", description: "" };

interface Participant {
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
}

const formatNameInitial = (user: User | null) => {
  const value = user?.username?.trim() || user?.email?.trim() || "ONG";
  return value.charAt(0).toUpperCase();
};

const buildPayload = (user: User, form: FormState): EventPayload => ({
  ongId: localStorage.getItem("ongId") ?? user.id,
  title: form.title.trim(),
  description: form.description.trim(),
});

const ONGDashboard = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Participantes
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Convidar
  const [inviteUserId, setInviteUserId] = useState("");
  const [inviteRole, setInviteRole] = useState<"adm" | "mod">("mod");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const ongId = localStorage.getItem("ongId");

  const loadParticipants = async () => {
    if (!ongId) return;
    try {
      const res = await api.get<any>(`/api/v1/ongs/${ongId}/participants`);
      const list = res?.data?.content ?? res?.data ?? [];
      setParticipants(Array.isArray(list) ? list : []);
    } catch {
      // silencioso
    }
  };

  const loadDashboard = async (showRefreshingState = false) => {
    if (showRefreshingState) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const [user, list] = await Promise.all([getMe(), getEvents()]);
      setCurrentUser(user);
      setEvents(list);
      await loadParticipants();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar o painel.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const ownedEvents = useMemo(() => {
    if (!ongId) return events;
    return events.filter((event) => event.ongId === ongId);
  }, [events]);

  const openCreateDialog = () => {
    setEditingEvent(null);
    setFormState(initialFormState);
    setFormError(null);
    setDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setFormState({ title: event.title, description: event.description });
    setFormError(null);
    setDialogOpen(true);
  };

  const closeDialog = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingEvent(null);
      setFormError(null);
      setFormState(initialFormState);
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      setFormError("Não foi possível identificar a ONG logada.");
      return;
    }
    if (!formState.title.trim()) {
      setFormError("Escreva o título do post antes de salvar.");
      return;
    }
    if (!formState.description.trim()) {
      setFormError("Escreva a descrição antes de salvar.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const payload = buildPayload(currentUser, formState);
      if (editingEvent) {
        await updateEvent(editingEvent.id, payload);
        toast.success("Post atualizado com sucesso.");
      } else {
        await createEvent(payload);
        toast.success("Post criado com sucesso.");
      }
      closeDialog(false);
      await loadDashboard(true);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar o post.";
      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteEvent(deleteTarget.id);
      toast.success("Post excluído com sucesso.");
      setDeleteTarget(null);
      await loadDashboard(true);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível excluir o post.";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleInvite = async () => {
    if (!ongId || !inviteUserId.trim()) {
      setInviteError("Preencha o ID do usuário.");
      return;
    }
    setInviting(true);
    setInviteError(null);
    try {
      await api.post(`/api/v1/ongs/${ongId}/invites`, {
        userID: inviteUserId.trim(),
        role: inviteRole,
      });
      toast.success("Convite enviado com sucesso!");
      setInviteUserId("");
    } catch (err: any) {
      setInviteError(err.message || "Erro ao enviar convite.");
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveParticipant = async (userId: string) => {
    if (!ongId) return;
    setRemovingId(userId);
    try {
      await api.delete(`/api/v1/ongs/${ongId}/participants/${userId}`);
      toast.success("Participante removido.");
      await loadParticipants();
    } catch (err: any) {
      toast.error(err.message || "Erro ao remover participante.");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto w-full space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-56 rounded-lg bg-muted animate-pulse" />
            <div className="h-4 w-80 rounded-lg bg-muted animate-pulse" />
          </div>
          <div className="h-10 w-36 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-24 rounded-2xl bg-muted animate-pulse" />
          <div className="h-24 rounded-2xl bg-muted animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-44 rounded-2xl bg-muted animate-pulse" />
          <div className="h-44 rounded-2xl bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (error && !currentUser) {
    return (
      <div className="max-w-5xl mx-auto w-full">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-6 flex flex-col gap-4 items-start sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-destructive">
                Não foi possível carregar o painel.
              </p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
            <Button onClick={() => void loadDashboard()} variant="outline">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary text-lg font-bold">
              {formatNameInitial(currentUser)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Painel da ONG</p>
              <h1 className="text-2xl font-bold tracking-tight">
                Gerencie seus posts e eventos
              </h1>
            </div>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Crie, edite e exclua conteúdos da sua ONG sem sair desta tela.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => void loadDashboard(true)}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Atualizar
          </Button>
          <Button onClick={openCreateDialog} className="shadow-sm">
            <Plus className="h-4 w-4" />
            Novo post
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Posts da ONG</p>
            <p className="mt-2 text-3xl font-bold">{ownedEvents.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Participantes</p>
            <p className="mt-2 text-3xl font-bold">{participants.length}</p>
          </CardContent>
        </Card>
      </section>

      {/* Convidar voluntário */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Convidar voluntário
          </h2>
          <p className="text-sm text-muted-foreground">
            Cole o ID do usuário que deseja convidar.
          </p>
        </div>
        <Card>
          <CardContent className="p-5 space-y-3">
            <div className="space-y-1">
              <Label>ID do usuário</Label>
              <Input
                placeholder="ex: ee3c1a67-abf1-41dc-805f-cbff175ba0fc"
                value={inviteUserId}
                onChange={(e) => setInviteUserId(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Função</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={inviteRole === "mod" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setInviteRole("mod")}
                >
                  Moderador
                </Button>
                <Button
                  type="button"
                  variant={inviteRole === "adm" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setInviteRole("adm")}
                >
                  Administrador
                </Button>
              </div>
            </div>
            {inviteError && (
              <p className="text-sm text-destructive">{inviteError}</p>
            )}
            <Button
              onClick={handleInvite}
              disabled={inviting || !inviteUserId.trim()}
            >
              {inviting && <Loader2 className="h-4 w-4 animate-spin" />}
              Enviar convite
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Participantes */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" /> Participantes
          </h2>
          <p className="text-sm text-muted-foreground">
            Membros ativos da sua ONG.
          </p>
        </div>
        {participants.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Nenhum participante ainda.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {participants.map((p) => (
              <Card key={p.userId}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {p.userName?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{p.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.userEmail} · {p.role}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={removingId === p.userId}
                    onClick={() => handleRemoveParticipant(p.userId)}
                  >
                    {removingId === p.userId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Remover
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Lista de posts */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Publicações</h2>
          <p className="text-sm text-muted-foreground">
            Todos os conteúdos publicados pela ONG logada.
          </p>
        </div>

        {error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4 text-sm text-destructive">
              {error}
            </CardContent>
          </Card>
        )}

        {ownedEvents.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold">Nenhum post publicado ainda</p>
                <p className="text-sm text-muted-foreground">
                  Crie a primeira publicação para aparecer no feed da
                  plataforma.
                </p>
              </div>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4" />
                Criar primeiro post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {ownedEvents.map((event) => (
              <Card
                key={event.id}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {formatNameInitial(currentUser)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {event.createdAt}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(event)}
                      >
                        <PencilLine className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteTarget(event)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Modal criar/editar */}
      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Editar post" : "Novo post"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para publicar ou atualizar o conteúdo da
              ONG.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dashboard-title">Título</Label>
              <Input
                id="dashboard-title"
                value={formState.title}
                onChange={(e) =>
                  setFormState((cur) => ({ ...cur, title: e.target.value }))
                }
                placeholder="Título do post..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dashboard-description">Descrição</Label>
              <Textarea
                id="dashboard-description"
                value={formState.description}
                onChange={(e) =>
                  setFormState((cur) => ({
                    ...cur,
                    description: e.target.value,
                  }))
                }
                placeholder="Descreva a ação, campanha ou novidade da ONG..."
                className="min-h-40 resize-none"
              />
            </div>
            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => closeDialog(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button onClick={() => void handleSubmit()} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingEvent ? "Salvar alterações" : "Publicar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmação de exclusão */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir post</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é permanente. O post será removido do feed e não poderá
              ser recuperado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleDelete()}
              disabled={deleting}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ONGDashboard;
