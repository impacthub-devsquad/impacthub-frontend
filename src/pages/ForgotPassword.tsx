import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { Leaf, Mail } from "lucide-react";

type Step = "email" | "sent";

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();

  const validate = () => {
    if (!email) return "E-mail é obrigatório";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "E-mail inválido";
    return undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(undefined);
    setStep("sent");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative leaves — igual ao Login */}
      <div className="absolute top-10 left-10 opacity-10">
        <Leaf size={120} className="text-primary" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10 rotate-45">
        <Leaf size={160} className="text-primary" />
      </div>
      <div className="absolute top-1/3 right-20 opacity-5">
        <Leaf size={80} className="text-primary" />
      </div>

      <Card className="w-full max-w-md shadow-xl border-0 rounded-3xl">
        <CardContent className="p-8">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          {step === "email" ? (
            <>
              <p className="text-center text-muted-foreground mb-6">
                Digite seu e-mail para redefinir a senha
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
                      setError(undefined);
                    }}
                    className={`focus-visible:ring-primary ${error ? "border-red-500" : ""}`}
                  />
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full text-base h-11"
                >
                  Enviar link de recuperação
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Lembrou a senha?{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Entrar
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail size={32} className="text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  Verifique seu e-mail
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Enviamos um link para{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                  <br />
                  Siga as instruções para redefinir sua senha.
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full rounded-full text-base h-11"
                onClick={() => setStep("email")}
              >
                Reenviar e-mail
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-6">
                <Link
                  to="/"
                  className="text-primary font-medium hover:underline"
                >
                  Voltar para o login
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
