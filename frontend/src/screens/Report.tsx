import { Subscription, Screen } from "../App";

interface Props {
  subs: Subscription[];
  navigate: (s: Screen, id?: string | number) => void;
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const CATEGORY_COLOR: Record<string, string> = {
  Streaming: "#e50914",
  Trabalho: "#6e5494",
  Fitness: "#f59e0b",
  Música: "#1db954",
  Jogos: "#0ea5e9",
  Outros: "#64748b",
};

export default function Report({ subs, navigate }: Props) {
  const active = subs.filter((s) => s.status === "Ativa");
  const monthly = active.reduce((acc, s) => {
    const v = s.period === "Anual" ? s.value / 12 : s.period === "Trimestral" ? s.value / 3 : s.value;
    return acc + v;
  }, 0);
  const annual = monthly * 12;

  // Category totals
  const byCategory: Record<string, number> = {};
  active.forEach((s) => {
    const v = s.period === "Anual" ? s.value / 12 : s.period === "Trimestral" ? s.value / 3 : s.value;
    byCategory[s.category] = (byCategory[s.category] ?? 0) + v;
  });
  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const maxCat = sorted[0]?.[1] ?? 1;

  // Top subscriptions
  const topSubs = [...active]
    .map((s) => ({
      ...s,
      monthly: s.period === "Anual" ? s.value / 12 : s.period === "Trimestral" ? s.value / 3 : s.value,
    }))
    .sort((a, b) => b.monthly - a.monthly)
    .slice(0, 3);

  // Mês/ano atuais (em vez de um texto fixo)
  const currentMonthName = new Date().toLocaleString("pt-BR", { month: "long" });
  const currentPeriodLabel = `${currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1)} ${new Date().getFullYear()}`;

  // Simple donut chart as SVG
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 60;
  const stroke = 20;

  let cumAngle = -Math.PI / 2;
  const arcs = sorted.map(([cat, val]) => {
    const angle = (val / monthly) * 2 * Math.PI;
    const start = cumAngle;
    cumAngle += angle;
    return { cat, val, start, end: cumAngle, angle };
  });

  function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const s = polarToCartesian(cx, cy, r, startAngle);
    const e = polarToCartesian(cx, cy, r, endAngle);
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="pt-14 px-6 pb-6">
        <h1 className="font-heading font-bold text-[26px] mb-1">
          Relatório
        </h1>
        <p className="text-[13px] text-muted-foreground font-body">
          {currentPeriodLabel}
        </p>
      </div>

      <div className="px-6 flex flex-col gap-4">
        {/* KPI row */}
        <div className="grid grid-cols-2 gap-3">
          <KpiCard label="Total mensal" value={fmt(monthly)} sub={`${active.length} assinaturas`} accent />
          <KpiCard label="Projeção anual" value={fmt(annual)} sub="estimativa" />
        </div>

        {/* Donut chart */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <p className="font-heading font-semibold text-base mb-5">
            Gastos por categoria
          </p>
          <div className="flex items-center gap-5">
            <svg width={size} height={size} className="shrink-0">
              {arcs.map(({ cat, start, end }, i) => (
                <path
                  key={i}
                  d={arcPath(cx, cy, r, start, end)}
                  fill="none"
                  stroke={CATEGORY_COLOR[cat] ?? "#64748b"}
                  strokeWidth={stroke}
                  strokeLinecap="butt"
                />
              ))}
              {/* Center text */}
              <text
                x={cx} y={cy - 6}
                textAnchor="middle"
                fill="var(--foreground)"
                className="font-heading font-extrabold text-[15px]"
              >
                {fmt(monthly).replace("R$ ", "R$ ")}
              </text>
              <text
                x={cx} y={cy + 12}
                textAnchor="middle"
                fill="#64748b"
                className="font-body text-[10px]"
              >
                por mês
              </text>
            </svg>

            <div className="flex-1 flex flex-col gap-2.5">
              {sorted.map(([cat, val]) => (
                <div key={cat}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full shrink-0" style={{ background: CATEGORY_COLOR[cat] ?? "#64748b" }} />
                      <span className="text-xs font-body text-foreground">{cat}</span>
                    </div>
                    <span className="text-xs font-heading font-semibold text-foreground">
                      {((val / monthly) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-[3px] bg-border rounded-[4px]">
                    <div
                      className="h-full rounded-[4px] transition-[width] duration-[600ms] ease-in-out"
                      style={{ background: CATEGORY_COLOR[cat] ?? "#64748b", width: `${(val / maxCat) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top subs */}
        <div>
          <p className="font-heading font-semibold text-base mb-3">
            Maiores gastos
          </p>
          <div className="flex flex-col gap-2.5">
            {topSubs.map((s, i) => (
              <button
                key={s.id}
                onClick={() => navigate("details", s.id)}
                className="bg-card border border-border rounded-md p-4 flex items-center gap-[14px] cursor-pointer text-left w-full"
              >
                <div className={`w-8 h-8 rounded-[10px] bg-secondary flex items-center justify-center text-sm font-heading font-extrabold shrink-0 ${
                  i === 0 ? "text-amber-500" : "text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${s.color}22` }}
                >
                  {s.icon}
                </div>
                <div className="flex-1">
                  <p className="font-heading font-semibold text-[15px] mb-[3px]">{s.name}</p>
                  <div className="h-1 bg-border rounded-[4px] overflow-hidden">
                    <div
                      className="h-full rounded-[4px]"
                      style={{
                        background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`,
                        width: `${(s.monthly / topSubs[0].monthly) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-heading font-bold text-[15px]">{fmt(s.monthly)}</p>
                  <p className="text-[11px] text-muted-foreground font-body">/ mês</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Monthly breakdown */}
        <div className="bg-card rounded-lg p-5 border border-border mb-2">
          <p className="font-heading font-semibold text-base mb-4">
            Resumo financeiro
          </p>
          <div className="flex flex-col gap-3">
            <Row label="Gasto este mês" value={fmt(monthly)} />
            <div className="h-px bg-border" />
            <Row label="Projeção próximo mês" value={fmt(monthly)} />
            <div className="h-px bg-border" />
            <Row label="Projeção anual" value={fmt(annual)} highlight />
            <div className="h-px bg-border" />
            <Row label="Assinaturas ativas" value={`${active.length}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`rounded-[18px] p-[18px] border ${accent ? "bg-primary/8 border-primary/20" : "bg-card border-border"}`}>
      <p className="text-[11px] text-muted-foreground font-body mb-2 uppercase tracking-[0.04em]">
        {label}
      </p>
      <p className={`font-heading font-extrabold text-[22px] mb-1 leading-none ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground font-body">
        {sub}
      </p>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground font-body">{label}</span>
      <span className={`font-heading font-bold text-[15px] ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}
