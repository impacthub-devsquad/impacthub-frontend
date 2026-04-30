import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currentUser } from "@/data/mockData";

const Perfil = () => {
  const navigate = useNavigate();

  // Estado persistido (dados salvos)
  const [userData, setUserData] = useState({
    name: currentUser.name,
    email: currentUser.email,
  });

  // Estado temporário (edição)
  const [formData, setFormData] = useState(userData);

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setUserData(formData); // salva alterações
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(userData); // restaura valores originais
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto w-full">
        <h1 className="text-xl font-bold mb-4">Meu Perfil</h1>

        <Card>
          <CardContent className="p-6 space-y-6">

            {/* Header do Perfil */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {userData.name.charAt(0)}
              </div>
              <h2 className="text-lg font-semibold">{userData.name}</h2>
              <p className="text-sm text-muted-foreground">
                {userData.email}
              </p>
            </div>

            {/* Informações */}
            <div className="space-y-4">

              {/* Nome */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Nome
                </Label>
                {isEditing ? (
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="rounded-lg"
                  />
                ) : (
                  <div className="bg-muted/40 px-3 py-2 rounded-lg">
                    {userData.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Email
                </Label>
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

              {/* Tipo */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Tipo de usuário
                </Label>
                <div className="bg-muted/40 px-3 py-2 rounded-lg capitalize">
                  {currentUser.type}
                </div>
              </div>

              {/* ONG */}
              {currentUser.type === "ong" && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    ONG
                  </Label>
                  <div className="bg-muted/40 px-3 py-2 rounded-lg">
                    {currentUser.ongName}
                  </div>
                </div>
              )}
            </div>

            {/* Ações */}
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