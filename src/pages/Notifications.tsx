// src/pages/Notifications.tsx
import { Bell, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";
import { useState } from "react";

const Notifications = () => {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Notificações
          </h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe alertas e novidades das suas interações.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            className="rounded-full h-9 px-4"
            onClick={() => setFilter("all")}
          >
            Todas
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            className="rounded-full h-9 px-4"
            onClick={() => setFilter("unread")}
          >
            Não lidas
          </Button>
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center text-muted-foreground">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BellRing className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">
                Nenhuma notificação por enquanto
              </p>
              <p className="text-sm text-muted-foreground">
                Quando houver novidades, elas aparecerão aqui.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Notifications;
