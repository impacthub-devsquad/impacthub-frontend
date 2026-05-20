import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { Leaf } from "lucide-react";
import { login } from "@/lib/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "E-mail é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "E-mail inválido";
    if (!password) newErrors.password = "Senha é obrigatória";
    else if (password.length < 8)
      newErrors.password = "Senha deve ter pelo menos 8 caracteres";
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
      await login({ email, password });
      navigate("/home");
    } catch (err: any) {
      setErrors({ password: err.message || "E-mail ou senha inválidos" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-10 left-10 opacity-10">
        <Leaf size={120} className="text-primary" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10 rotate-45">
        <Leaf size={160} className="text-primary" />
      </div>
      <div className="absolute top-1/3 right-20 opacity-5">
        <Leaf size={80} className="text-primary" />
      </div>

      <Card className="w-full max-w-md shadow-lg border-0">
        <CardContent className="p-8">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <p className="text-center text-muted-foreground mb-6">
            Conectando pessoas e ONGs por um mundo melhor
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={`focus-visible:ring-primary ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className={`focus-visible:ring-primary ${errors.password ? "border-red-500" : ""}`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>
            <div className="text-right">
              <Link
                to="/recuperar-senha"
                className="text-xs text-primary hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full text-base h-11"
            >
              Entrar
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Não tem conta?{" "}
            <Link
              to="/cadastro"
              className="text-primary font-medium hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
