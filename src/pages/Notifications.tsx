// src/pages/Notifications.tsx
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import { useState } from "react";

const Notifications = () => {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-foreground">
            Notificações
          </h1>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setFilter("all")}
          >
            Todas
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setFilter("unread")}
          >
            Não lidas
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <Bell size={40} className="opacity-30" />
          <p className="text-sm">Nenhuma notificação por enquanto.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Notifications;
