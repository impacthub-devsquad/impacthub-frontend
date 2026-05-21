import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Check } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Skeleton from "@/components/Skeleton";
import { getMe, logout, User } from "@/lib/auth";
import { api } from "@/lib/api";

const Perfil = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [formData, setFormData] = useState({ username: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getMe()
      .then((user) => {
        setUserData(user);
        setFormData({ username: user.username, description: "" });
      })
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!userData) return;
    setSaving(true);
    setError(null);
    try {
      await api.patch("/api/v1/users/me", formData);
      setUserData({ ...userData, username: formData.username });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!userData) return;
    setFormData({ username: userData.username, description: "" });
    setIsEditing(false);
    setError(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCopyUserId = async () => {
    if (!userData?.userId) return;

    try {
      await navigator.clipboard.writeText(userData.userId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Não foi possível copiar o ID.");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto w-full space-y-4">
          <Skeleton variant="text" className="h-8 w-40" />
          <Card className="rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center gap-3">
                <Skeleton variant="circle" className="h-20 w-20" />
                <Skeleton variant="text" className="h-5 w-32" />
                <Skeleton variant="text" className="h-4 w-44" />
              </div>

              <div className="space-y-4">
                <Skeleton variant="rect" className="h-11 w-full" />
                <Skeleton variant="rect" className="h-11 w-full" />
                <Skeleton variant="rect" className="h-24 w-full" />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Skeleton variant="text" className="h-11 w-full" />
                <Skeleton variant="text" className="h-11 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!userData) return null;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto w-full space-y-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Meu Perfil</h1>
          <p className="text-sm text-muted-foreground">
            Atualize suas informações básicas e mantenha seus dados em dia.
          </p>
        </div>
        <Card className="rounded-2xl">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary ring-4 ring-primary/5">
                {userData.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold leading-tight">
                {userData.username}
              </h2>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">
                  Nome
                </Label>
                {isEditing ? (
                  <Input
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="rounded-xl"
                  />
                ) : (
                  <div className="bg-muted/40 px-3 py-2 rounded-xl">
                    {userData.username}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">
                  Email
                </Label>
                <div className="bg-muted/40 px-3 py-2 rounded-xl text-muted-foreground">
                  {userData.email}
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">
                  Seu ID de voluntário
                </Label>
                <div className="bg-muted/40 px-3 py-2 rounded-xl flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground truncate">
                    {userData.userId}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyUserId}
                    className="h-8 rounded-full px-3"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">
                  Descrição
                </Label>
                {isEditing ? (
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Fale um pouco sobre você..."
                    className="rounded-xl resize-none"
                    rows={3}
                  />
                ) : (
                  <div className="bg-muted/40 px-3 py-2 rounded-xl text-sm text-muted-foreground min-h-[60px]">
                    {formData.description || "Sem descrição"}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive text-center">
                {error}
              </p>
            )}

            <div className="pt-2 flex flex-col gap-2">
              {isEditing ? (
                <div className="flex gap-2 flex-col sm:flex-row">
                  <Button
                    className="flex-1 rounded-full"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="rounded-full"
                >
                  Editar perfil
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="rounded-full"
              >
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Perfil;
