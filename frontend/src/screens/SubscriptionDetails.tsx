import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Subscription, Screen, getStoredUser } from "../App";
import { updateSub, deleteSub } from "../lib/api";
import { subsQueryKey } from "../lib/queryClient";
import { CANCEL_URLS } from "../constants/catalog";

interface Props {
  sub: Subscription;
  navigate: (s: Screen, id?: string | number) => void;
}

function addCycle(iso: string, period: Subscription["period"]): string {
  const d = new Date(iso + "T00:00:00");
  const months = period === "Mensal" ? 1 : period === "Trimestral" ? 3 : 12;
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function SubscriptionDetails({ sub, navigate }: Props) {
  const queryClient = useQueryClient();
  const user = getStoredUser();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: subsQueryKey(user?.id) });

  const pauseMutation = useMutation({
    mutationFn: () => updateSub(sub.id, { status: sub.status === "Ativa" ? "Pausada" : "Ativa" }),
    onSuccess: invalidate,
  });

  const payMutation = useMutation({
    mutationFn: () => {
      const newEntry = { date: sub.nextCharge, value: sub.value, status: "Pago" as const };
      return updateSub(sub.id, {
        history: [...sub.history, newEntry],
        nextCharge: addCycle(sub.nextCharge, sub.period),
      });
    },
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteSub(sub.id),
    onSuccess: () => {
      invalidate();
      navigate("dashboard");
    },
  });

  const busy = pauseMutation.isPending ? "pause" : payMutation.isPending ? "pay" : deleteMutation.isPending ? "delete" : null;
  const error = pauseMutation.isError
    ? "Não foi possível atualizar o status. Tente novamente."
    : payMutation.isError
      ? "Não foi possível confirmar o pagamento. Tente novamente."
      : deleteMutation.isError
        ? "Não foi possível excluir a assinatura. Tente novamente."
        : null;

  const handleDelete = () => {
    const ok = window.confirm(`Tem certeza que deseja excluir "${sub.name}"? Essa ação não pode ser desfeita.`);
    if (ok) deleteMutation.mutate();
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header with gradient */}
      <div
        className="pt-14 px-6 pb-6 border-b border-border"
        style={{ background: `linear-gradient(160deg, ${sub.color}28 0%, transparent 60%)` }}
      >
        <div className="flex items-center gap-[14px] mb-6">
          <button
            onClick={() => navigate("dashboard")}
            className="w-9 h-9 rounded-sm bg-white/8 border-none cursor-pointer flex items-center justify-center text-lg text-foreground"
          >
            ←
          </button>
          <h1 className="font-heading font-bold text-xl">
            Detalhes
          </h1>
        </div>

        <div className="flex items-center gap-[18px]">
          <div
            className="w-[72px] h-[72px] rounded-lg flex items-center justify-center text-4xl border-[1.5px]"
            style={{ background: `${sub.color}22`, borderColor: `${sub.color}44` }}
          >
            {sub.icon}
          </div>
          <div>
            <h2 className="font-heading font-bold text-[26px] mb-1">
              {sub.name}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-muted-foreground font-body">
                {sub.category}
              </span>
              <span className={`text-[11px] py-[3px] px-2.5 rounded-lg font-body font-medium ${
                sub.status === "Ativa" ? "bg-primary/15 text-primary" : "bg-slate-500/20 text-muted-foreground"
              }`}>
                {sub.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main value */}
      <div className="pt-6 px-6">
        <div className="bg-card rounded-lg p-5 border border-border mb-4">
          <div className="grid grid-cols-2 gap-5">
            <InfoBlock label="Valor" value={fmt(sub.value)} large accent />
            <InfoBlock label="Periodicidade" value={sub.period} />
            <InfoBlock label="Próxima cobrança" value={formatDate(sub.nextCharge)} />
            <InfoBlock label="Pagamento" value={sub.paymentMethod} />
          </div>
        </div>

        {/* Annual projection */}
        <div
          className="border rounded-md py-4 px-5 flex justify-between items-center mb-6"
          style={{ background: `${sub.color}12`, borderColor: `${sub.color}30` }}
        >
          <div>
            <p className="text-xs text-muted-foreground font-body mb-1">
              Projeção anual
            </p>
            <p className="font-heading font-bold text-[22px] text-foreground">
              {fmt(sub.value * (sub.period === "Mensal" ? 12 : sub.period === "Trimestral" ? 4 : 1))}
            </p>
          </div>
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center text-[22px]"
            style={{ background: `${sub.color}22` }}
          >
            📊
          </div>
        </div>

        {/* Billing history */}
        <div>
          <p className="text-base font-semibold font-heading mb-3">
            Histórico de cobranças
          </p>
          {sub.history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Nenhuma cobrança registrada
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {sub.history.map((h, i) => (
                <div key={i} className="bg-card rounded-[14px] py-[14px] px-4 flex items-center justify-between border border-border">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center text-base ${
                      h.status === "Pago" ? "bg-primary/12" : "bg-amber-500/12"
                    }`}>
                      {h.status === "Pago" ? "✓" : "⏳"}
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-sm mb-0.5">
                        {new Date(h.date + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
                      </p>
                      <p className="text-xs text-muted-foreground font-body">
                        {new Date(h.date + "T00:00:00").getFullYear()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-[15px] mb-1">
                      {fmt(h.value)}
                    </p>
                    <span className={`text-[11px] py-0.5 px-2 rounded-[10px] font-body ${
                      h.status === "Pago" ? "bg-primary/15 text-primary" : "bg-amber-500/15 text-amber-500"
                    }`}>
                      {h.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="py-4 px-6 pb-6 flex flex-col gap-2.5">
        {error && (
          <div className="bg-red-500/8 border border-red-500/25 rounded-sm py-3 px-[14px] text-red-500 font-body text-[13px]">
            {error}
          </div>
        )}

        {sub.status === "Ativa" && (
          <button
            onClick={() => payMutation.mutate()}
            disabled={busy !== null}
            className={`p-[14px] rounded-[14px] border-none bg-primary text-primary-foreground font-heading font-bold text-sm ${
              busy !== null ? "cursor-not-allowed" : "cursor-pointer"
            } ${busy !== null && busy !== "pay" ? "opacity-60" : "opacity-100"}`}
          >
            {busy === "pay" ? "Confirmando..." : "✓ Confirmar Pagamento"}
          </button>
        )}

        <div className="flex gap-2.5">
          <button
            onClick={() => pauseMutation.mutate()}
            disabled={busy !== null}
            className={`flex-1 p-[14px] rounded-[14px] border border-border bg-card text-muted-foreground font-heading font-semibold text-sm ${
              busy !== null ? "cursor-not-allowed" : "cursor-pointer"
            } ${busy !== null && busy !== "pause" ? "opacity-60" : "opacity-100"}`}
          >
            {busy === "pause" ? "..." : sub.status === "Ativa" ? "⏸ Pausar" : "▶ Reativar"}
          </button>

          {/* 👇 AQUI ESTÁ A CORREÇÃO DO BOTÃO 👇 */}
          <button
            onClick={() => navigate("edit", sub.id)}
            className="flex-1 p-[14px] rounded-[14px] border-none bg-primary text-primary-foreground font-heading font-bold text-sm cursor-pointer"
          >
            ✎ Editar
          </button>
        </div>

        {/* Cancel at provider */}
        {CANCEL_URLS[sub.name] && (
          <a
            href={CANCEL_URLS[sub.name]}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-[14px] rounded-[14px] border border-red-500/30 bg-red-500/7 text-red-500 font-heading font-semibold text-sm no-underline cursor-pointer transition-colors duration-150"
          >
            <span>Cancelar no Provedor</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <path d="M2 2h10v10M12 2L2 12" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}

        {/* Remover do sistema (não depende de link externo) */}
        <button
          onClick={handleDelete}
          disabled={busy !== null}
          className={`p-[14px] rounded-[14px] border-none bg-transparent text-red-500 font-body font-semibold text-[13px] ${
            busy !== null ? "cursor-not-allowed" : "cursor-pointer"
          } ${busy !== null && busy !== "delete" ? "opacity-60" : "opacity-100"}`}
        >
          {busy === "delete" ? "Excluindo..." : "🗑 Excluir assinatura"}
        </button>
      </div>
    </div>
  );
}

function InfoBlock({ label, value, large, accent }: { label: string; value: string; large?: boolean; accent?: boolean }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground font-body mb-1 uppercase tracking-[0.05em]">
        {label}
      </p>
      <p className={`font-heading leading-[1.2] ${large ? "font-extrabold text-2xl" : "font-semibold text-[15px]"} ${
        accent ? "text-primary" : "text-foreground"
      }`}>
        {value}
      </p>
    </div>
  );
}
