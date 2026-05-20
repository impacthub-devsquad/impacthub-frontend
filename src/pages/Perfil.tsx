import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMe, logout, User } from "@/lib/auth";

const Perfil = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((user) => {
        setUserData(user);
        setFormData({ username: user.username, email: user.email });
      })
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = () => {
    if (!userData) return;
    setUserData({ ...userData, ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!userData) return;
    setFormData({ username: userData.username, email: userData.email });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-40 text-muted-foreground">
          Carregando perfil...
        </div>
      </AppLayout>
    );
  }

  if (!userData) return null;

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto w-full">
        <h1 className="text-xl font-bold mb-4">Meu Perfil</h1>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {userData.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-semibold">{userData.username}</h2>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Nome</Label>
                {isEditing ? (
                  <Input
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="rounded-lg"
                  />
                ) : (
                  <div className="bg-muted/40 px-3 py-2 rounded-lg">
                    {userData.username}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Email</Label>
                {isEditing ? (
                  <Input
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="rounded-lg"
                  />
                ) : (
                  <div className="bg-muted/40 px-3 py-2 rounded-lg">
                    {userData.email}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              {isEditing ? (
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleSave}>
                    Salvar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Editar perfil
                </Button>
              )}
              <Button variant="destructive" onClick={handleLogout}>
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
