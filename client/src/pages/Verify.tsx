import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

function Verify() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Token inválido");
      toast({ title: "Verificação falhou", description: "Token inválido." });
      return;
    }

    const run = async () => {
      try {
        setStatus("verifying");
        const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`, {
          method: "GET",
          headers: { "Accept": "application/json" },
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus("error");
          setMessage(data?.error || "Não foi possível verificar a conta.");
          toast({ title: "Verificação falhou", description: data?.error || "Não foi possível verificar a conta." });
          return;
        }
        setStatus("success");
        setMessage("Conta verificada com sucesso. A redirecionar...");
        toast({ title: "Conta verificada", description: "Pode iniciar sessão." });
        setTimeout(() => navigate("/login"), 1500);
      } catch (err) {
        setStatus("error");
        setMessage("Erro de rede ao verificar a conta.");
        toast({ title: "Erro de rede", description: "Tente novamente mais tarde." });
      }
    };

    run();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Verificar conta</h1>
        {status === "idle" || status === "verifying" ? (
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            <span>A verificar o seu token…</span>
          </div>
        ) : null}
        {status === "success" || status === "error" ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : null}
      </div>
    </div>
  );
}

export default Verify;