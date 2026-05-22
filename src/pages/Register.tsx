import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { Leaf } from "lucide-react";
import { register } from "@/lib/auth";
import { createOng } from "@/lib/ongs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ONG_CATEGORIES = [
  { value: "education", label: "Educação" },
  { value: "health", label: "Saúde" },
  { value: "environment", label: "Meio Ambiente" },
  { value: "animal_welfare", label: "Bem-estar Animal" },
  { value: "human_rights", label: "Direitos Humanos" },
  { value: "poverty_alleviation", label: "Combate à Pobreza" },
  { value: "arts_and_culture", label: "Arte e Cultura" },
  { value: "sports_and_recreation", label: "Esporte e Lazer" },
];

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  ongName?: string;
  ongCategory?: string;
};

const Register = () => {
  const [userType, setUserType] = useState<"volunteer" | "ong">("volunteer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ongName, setOngName] = useState("");
  const [ongCategory, setOngCategory] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Errors = {};
    if (!name.trim()) newErrors.name = "Nome é obrigatório";
    if (!email) newErrors.email = "E-mail é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "E-mail inválido";
    if (!password) newErrors.password = "Senha é obrigatória";
    else if (password.length < 8)
      newErrors.password = "Senha deve ter pelo menos 8 caracteres";
    if (!confirmPassword) newErrors.confirmPassword = "Confirme sua senha";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "As senhas não coincidem";
    if (userType === "ong") {
      if (!ongName.trim()) newErrors.ongName = "Nome da ONG é obrigatório";
      if (!ongCategory) newErrors.ongCategory = "Selecione uma categoria";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register({ username: name, email, password });

      if (userType === "ong") {
        const ongId = await createOng({
          name: ongName,
          title: ongName,
          description: `ONG ${ongName}`,
          category: ongCategory,
        });
        localStorage.setItem("ongId", ongId);
      }

      navigate("/home");
    } catch (err: any) {
      setErrors({ email: err.message || "Erro ao criar conta" });
    }
  };

  const clearError = (field: keyof Errors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute top-10 right-10 opacity-10">
        <Leaf size={120} className="text-primary" />
      </div>
      <div className="absolute bottom-10 left-10 opacity-10 -rotate-45">
        <Leaf size={140} className="text-primary" />
      </div>

      <Card className="w-full max-w-md shadow-lg border-0">
        <CardContent className="p-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          <p className="text-center text-muted-foreground mb-6">
            Crie sua conta e faça parte da rede
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError("name");
                }}
                className={`focus-visible:ring-primary ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email">E-mail</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                className={`focus-visible:ring-primary ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password">Senha</Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError("password");
                }}
                className={`focus-visible:ring-primary ${errors.password ? "border-red-500" : ""}`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError("confirmPassword");
                }}
                className={`focus-visible:ring-primary ${errors.confirmPassword ? "border-red-500" : ""}`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tipo de usuário</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={userType === "volunteer" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setUserType("volunteer")}
                >
                  Voluntário
                </Button>
                <Button
                  type="button"
                  variant={userType === "ong" ? "default" : "outline"}
                  className="flex-1 rounded-full"
                  onClick={() => setUserType("ong")}
                >
                  ONG
                </Button>
              </div>
            </div>

            {userType === "ong" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label htmlFor="ong-name">Nome da ONG</Label>
                  <Input
                    id="ong-name"
                    placeholder="Nome da organização"
                    value={ongName}
                    onChange={(e) => {
                      setOngName(e.target.value);
                      clearError("ongName");
                    }}
                    className={`focus-visible:ring-primary ${errors.ongName ? "border-red-500" : ""}`}
                  />
                  {errors.ongName && (
                    <p className="text-red-500 text-xs">{errors.ongName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Categoria da ONG</Label>
                  <Select
                    value={ongCategory}
                    onValueChange={(val) => {
                      setOngCategory(val);
                      clearError("ongCategory");
                    }}
                  >
                    <SelectTrigger
                      className={errors.ongCategory ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {ONG_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ongCategory && (
                    <p className="text-red-500 text-xs">{errors.ongCategory}</p>
                  )}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-full text-base h-11"
            >
              Criar conta
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Já tem conta?{" "}
            <Link to="/" className="text-primary font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
