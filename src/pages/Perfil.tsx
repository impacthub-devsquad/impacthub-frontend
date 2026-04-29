import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currentUser } from "@/data/mockData";

const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);

  const handleSave = () => {
    // aqui futuramente vai integrar com API
    setIsEditing(false);
  };

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto w-full">
        <h1 className="text-xl font-bold mb-4">Meu Perfil</h1>

        <Card>
          <CardContent className="p-6 space-y-4">

            {/* Nome */}
            <div className="space-y-1">
              <Label>Nome</Label>
              {isEditing ? (
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              ) : (
                <p className="text-muted-foreground">{name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label>Email</Label>
              {isEditing ? (
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              ) : (
                <p className="text-muted-foreground">{email}</p>
              )}
            </div>

            {/* Tipo de usuário */}
            <div className="space-y-1">
              <Label>Tipo</Label>
              <p className="text-muted-foreground capitalize">
                {currentUser.type}
              </p>
            </div>

            {/* ONG (se existir) */}
            {currentUser.type === "ong" && (
              <div className="space-y-1">
                <Label>Nome da ONG</Label>
                <p className="text-muted-foreground">
                  {currentUser.ongName}
                </p>
              </div>
            )}

            {/* Ações */}
            <div className="pt-4 flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave}>Salvar</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Editar perfil
                </Button>
              )}
            </div>

          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Perfil;