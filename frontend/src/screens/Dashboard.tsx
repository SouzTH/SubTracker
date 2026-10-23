import { Subscription, Screen } from "../App"
import { fmt, toMonthlyValue } from "../lib/money"

interface Props {
  subs: Subscription[]
  navigate: (screen: Screen, id?: string | number) => void;
  budgets: Record<string, number>
  userName: string
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00")
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}

const daysUntil = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    // Divide "2026-10-01" em partes numéricas seguras
    const [year, month, day] = dateString.split('-').map(Number);
    const target = new Date(year, month - 1, day);
    
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

const CATEGORY_COLOR: Record<string, string> = {
  Streaming: "#e50914",
  Trabalho: "#6e5494",
  Fitness: "#f59e0b",
  Música: "#1db954",
  Jogos: "#0ea5e9",
  Outros: "#64748b",
}

export default function Dashboard({ subs, navigate, budgets, userName }: Props) {

  const currentMonthName = new Date().toLocaleString('pt-BR', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const formattedDateString = `${currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1)} ${currentYear}`;
  // FIM DA LÓGICA DINÂMICA

  const active = subs.filter((s) => s.status === "Ativa")
  const total = active.reduce((acc, s) => acc + toMonthlyValue(s), 0)
  const sorted = [...subs].sort(
    (a, b) =>
      new Date(a.nextCharge).getTime() - new Date(b.nextCharge).getTime(),
  )

  // Build category totals for progress bars (sempre em valor mensal
  // equivalente, para bater com os totais do Relatório)
  const byCategory: Record<string, number> = {}
  active.forEach((s) => {
    byCategory[s.category] = (byCategory[s.category] ?? 0) + toMonthlyValue(s)
  })
  const usedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1])

  return (
    <div className="flex-1 overflow-y-auto pb-2">
      {/* Header */}
      <div className="pt-14 px-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-lg text-muted-foreground font-body mb-0.5 font-bold">
              Olá, {userName}!
            </p>
            <p className="text-[13px] text-muted-foreground font-body">
              {formattedDateString}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {/* Importar Extrato button */}
            <button
              onClick={() => navigate("import")}
              className="flex items-center gap-[5px] bg-primary/10 border border-primary/25 rounded-[10px] py-[7px] px-[11px] cursor-pointer text-primary font-body font-medium text-xs whitespace-nowrap"
            >
              <span className="text-sm">⬆</span>
              Importar Extrato
            </button>
            <div
              onClick={() => navigate("profile")}
              title="Meu perfil"
              className="size-10 rounded-full bg-[linear-gradient(135deg,var(--primary),#0099aa)] flex items-center justify-center text-lg shrink-0 cursor-pointer"
            >
              👤
            </div>
          </div>
        </div>
      </div>

      {/* Total Card */}
      <div className="pt-5 px-6">
        <div className="bg-[linear-gradient(135deg,#00d4aa18_0%,#0063e518_100%)] border border-primary/20 rounded-xl py-7 px-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 size-40 rounded-full bg-[radial-gradient(circle,rgba(0,212,170,0.12)_0%,transparent_70%)]" />
          <p className="text-[13px] text-muted-foreground font-body mb-2">
            Total gasto no mês
          </p>
          <p className="text-[42px] font-extrabold font-heading text-primary leading-[1.1] mb-4">
            {fmt(total)}
          </p>
          <div className="flex gap-4">
            <Stat label="Assinaturas" value={`${active.length} ativas`} />
            <Stat
              label="Pausadas"
              value={`${subs.filter((s) => s.status === "Pausada").length}`}
            />
            <Stat
              label="Próxima"
              value={sorted[0] ? formatDate(sorted[0].nextCharge) : "—"}
            />
          </div>
        </div>
      </div>

      {/* Category progress bars */}
      <div className="pt-5 px-6">
        <p className="text-[13px] font-semibold font-heading text-muted-foreground mb-2.5 uppercase tracking-[0.06em]">
          Metas por categoria
        </p>
        <div className="flex flex-col gap-2.5">
          {usedCategories.map(([cat, spent]) => {
            const limit = budgets[cat] ?? 100
            const pct = Math.min((spent / limit) * 100, 100)
            const over = spent > limit
            const color = CATEGORY_COLOR[cat] ?? "#64748b"
            return (
              <div
                key={cat}
                className={`bg-card border rounded-[14px] py-3 px-[14px] ${over ? "border-red-500/25" : "border-border"}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-[7px]">
                    <div className="size-2 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-[13px] font-body text-foreground font-medium">
                      {cat}
                    </span>
                    {over && (
                      <span className="text-[10px] py-px px-1.5 rounded-[8px] bg-red-500/15 text-red-500 font-body">
                        Limite
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-heading font-semibold ${over ? "text-red-500" : "text-muted-foreground"}`}>
                    {fmt(spent)}{" "}
                    <span className="text-muted-foreground font-normal">
                      / {fmt(limit)}
                    </span>
                  </span>
                </div>
                <div className="h-[5px] bg-border rounded-[4px] overflow-hidden">
                  <div
                    className="h-full rounded-[4px] transition-[width] duration-[600ms] ease-in-out"
                    style={{
                      width: `${pct}%`,
                      background: over
                        ? "linear-gradient(90deg, #ef4444, #f87171)"
                        : `linear-gradient(90deg, ${color}, ${color}aa)`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Subscriptions list */}
      <div className="pt-5 px-6">
        <p className="text-base font-semibold font-heading mb-3">
          Próximas cobranças
        </p>
        <div className="flex flex-col gap-2.5">
          {sorted.map((sub) => {
            const days = daysUntil(sub.nextCharge)
            const urgent = days <= 3
            return (
              <button
                key={sub.id}
                onClick={() => navigate("details", sub.id)}
                className={`bg-card border rounded-md p-4 flex items-center gap-[14px] cursor-pointer text-left w-full transition-all duration-200 ${
                  urgent && sub.status === "Ativa" ? "border-amber-500/30" : "border-border"
                }`}
              >
                <div
                  className="size-12 rounded-[14px] flex items-center justify-center text-[22px] shrink-0 border"
                  style={{ background: `${sub.color}22`, borderColor: `${sub.color}33` }}
                >
                  {sub.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading font-semibold text-[15px]">
                      {sub.name}
                    </span>
                    {sub.status === "Pausada" && (
                      <span className="text-[10px] py-0.5 px-[7px] rounded-[10px] bg-slate-500/20 text-muted-foreground font-body">
                        Pausada
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-body">
                      {sub.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ·
                    </span>
                    <span className={`text-xs font-body ${urgent && sub.status === "Ativa" ? "text-amber-500" : "text-muted-foreground"}`}>
                      {sub.status === "Ativa"
                        ? days === 0
                          ? "Hoje"
                          : days === 1
                            ? "Amanhã"
                            : `Em ${days} dias`
                        : formatDate(sub.nextCharge)}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-heading font-bold text-base mb-1">
                    {fmt(sub.value)}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-body">
                    {sub.period.toLowerCase()}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground font-body mb-0.5">
        {label}
      </p>
      <p className="text-sm font-semibold font-heading text-foreground">
        {value}
      </p>
    </div>
  )
}
