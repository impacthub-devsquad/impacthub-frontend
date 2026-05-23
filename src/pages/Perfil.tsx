import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Check, Camera } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userData, setUserData] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    description: "",
  });

  // Novos estados para controle do upload de imagem
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getMe()
      .then((user) => {
        console.log("USER RECEBIDO:", user.role);
        setUserData(user);
        setFormData({
          username: user.username || user.name,
          description: user.description || "",
        });
      })
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [navigate]);

  // Função para lidar com a seleção do arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Cria uma URL temporária local para renderizar o preview da imagem
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSave = async () => {
    if (!userData) return;

    setSaving(true);
    setError(null);

    try {
      let response;

      // Cenário 1: O usuário selecionou uma nova foto
      if (selectedFile) {
        // Convertemos o arquivo binário para uma String Base64 limpa
        const base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(selectedFile);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });

        // Enviamos como objeto JSON tradicional, o que sua 'api' aceita perfeitamente
        response = await api.patch("/api/v1/users/me", {
          username: formData.username.trim(),
          description: formData.description.trim(),
          avatar: base64Image, // Envia a string da imagem. Ajuste o nome da chave se o back pedir 'profilePicture'
        });
      } else {
        // Cenário 2: O usuário SÓ editou o nome ou descrição (sem foto)
        response = await api.patch("/api/v1/users/me", {
          username: formData.username.trim(),
          description: formData.description.trim(),
        });
      }

      // Tratamento seguro do retorno 'unknown' da API
      const responseData = response as Record<string, any>;
      const actualData = responseData?.data ? responseData.data : responseData;
      const updatedAvatar = actualData?.avatar || previewUrl || userData.avatar;

      setUserData({
        ...userData,
        username: formData.username,
        description: formData.description,
        avatar: updatedAvatar,
        profilePicture: updatedAvatar,
      });

      setIsEditing(false);
      setSelectedFile(null);
    } catch (err: unknown) {
      console.error("Erro completo do envio:", err);
      const message =
        err instanceof Error ? err.message : "Erro ao salvar perfil";

      setError(message);
    } finally {
      setSaving(false);
    }
  };
  const handleCancel = () => {
    if (!userData) return;
    setFormData({
      username: userData.username || userData.name,
      description: userData.description || "",
    });

    // Reseta os estados de imagem adicionados
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Limpa a memória
      setPreviewUrl(null);
    }

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

  // Decide qual imagem exibir: Preview local > Imagem salva no backend > Inicial do Nome
  const avatarImageSrc =
    previewUrl || userData.avatar || userData.profilePicture;
  const userInitial = (userData.username || userData.name)
    ?.charAt(0)
    .toUpperCase();

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
            {/* Bloco de Avatar Otimizado com Suporte a Upload */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary ring-4 ring-primary/5 overflow-hidden">
                  {avatarImageSrc ? (
                    <img
                      src={avatarImageSrc}
                      alt="Avatar do usuário"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userInitial
                  )}
                </div>

                {/* Input Invisível para Upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  disabled={!isEditing}
                />

                {/* Botão de câmera visível apenas em modo de edição */}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white transition-opacity duration-200"
                    title="Alterar foto de perfil"
                  >
                    <Camera size={20} />
                  </button>
                )}
              </div>

              <h2 className="text-xl font-semibold leading-tight mt-1">
                {isEditing
                  ? formData.username
                  : userData.username || userData.name}
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
                    {userData.username || userData.name}
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
                  Seu ID de usuário
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

              {/* Bloco específico por tipo de conta */}
<div className="pt-4 border-t border-border">
  {userData.role === "ong" ? (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-primary">
          Conta de ONG
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Obrigado por apoiar as causas! Aqui você pode acessar
          o seu painel de controle para gerenciar publicações e eventos.
        </p>
      </div>

      <Button
        size="sm"
        variant="secondary"
        className="w-full sm:w-auto text-xs rounded-full"
        onClick={() => navigate("/dashboard")}
      >
        Ir para o Dashboard
      </Button>
    </div>
  ) : (
    <div className="rounded-xl border border-muted bg-muted/30 p-4 space-y-1">
      <h3 className="text-sm font-semibold text-foreground">
        Conta de Voluntário
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Obrigado por apoiar as causas! No seu perfil você pode
        acompanhar suas informações básicas e histórico de ações.
      </p>
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
