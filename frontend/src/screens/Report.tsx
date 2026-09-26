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
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Header */}
      <div style={{ padding: "56px 24px 24px" }}>
        <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "26px", marginBottom: "4px" }}>
          Relatório
        </h1>
        <p style={{ fontSize: "13px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>
          Setembro 2026
        </p>
      </div>

      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <KpiCard label="Total mensal" value={fmt(monthly)} sub={`${active.length} assinaturas`} accent />
          <KpiCard label="Projeção anual" value={fmt(annual)} sub="estimativa" />
        </div>

        {/* Donut chart */}
        <div style={{
          background: "var(--card)", borderRadius: "20px", padding: "24px",
          border: "1px solid var(--border)",
        }}>
          <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "16px", marginBottom: "20px" }}>
            Gastos por categoria
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <svg width={size} height={size} style={{ flexShrink: 0 }}>
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
                style={{ fill: "var(--foreground)", fontFamily: "Outfit, sans-serif", fontWeight: "800", fontSize: "15px" }}
              >
                {fmt(monthly).replace("R$ ", "R$ ")}
              </text>
              <text
                x={cx} y={cy + 12}
                textAnchor="middle"
                style={{ fill: "#64748b", fontFamily: "Inter, sans-serif", fontSize: "10px" }}
              >
                por mês
              </text>
            </svg>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              {sorted.map(([cat, val]) => (
                <div key={cat}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: CATEGORY_COLOR[cat] ?? "#64748b", flexShrink: 0 }} />
                      <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "var(--foreground)" }}>{cat}</span>
                    </div>
                    <span style={{ fontSize: "12px", fontFamily: "Outfit, sans-serif", fontWeight: 600, color: "var(--foreground)" }}>
                      {((val / monthly) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div style={{ height: "3px", background: "var(--border)", borderRadius: "4px" }}>
                    <div style={{ height: "100%", borderRadius: "4px", background: CATEGORY_COLOR[cat] ?? "#64748b", width: `${(val / maxCat) * 100}%`, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top subs */}
        <div>
          <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "16px", marginBottom: "12px" }}>
            Maiores gastos
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {topSubs.map((s, i) => (
              <button
                key={s.id}
                onClick={() => navigate("details", s.id)}
                style={{
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: "16px", padding: "16px",
                  display: "flex", alignItems: "center", gap: "14px",
                  cursor: "pointer", textAlign: "left", width: "100%",
                }}
              >
                <div style={{
                  width: "32px", height: "32px", borderRadius: "10px",
                  background: "var(--secondary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontFamily: "Outfit, sans-serif", fontWeight: 800,
                  color: i === 0 ? "#f59e0b" : i === 1 ? "var(--muted-foreground)" : "var(--muted-foreground)",
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "12px",
                  background: `${s.color}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px", flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "15px", marginBottom: "3px" }}>{s.name}</p>
                  <div style={{ height: "4px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: "4px",
                      background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`,
                      width: `${(s.monthly / topSubs[0].monthly) * 100}%`,
                    }} />
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "15px" }}>{fmt(s.monthly)}</p>
                  <p style={{ fontSize: "11px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>/ mês</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Monthly breakdown */}
        <div style={{
          background: "var(--card)", borderRadius: "20px", padding: "20px",
          border: "1px solid var(--border)", marginBottom: "8px",
        }}>
          <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "16px", marginBottom: "16px" }}>
            Resumo financeiro
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Row label="Gasto este mês" value={fmt(monthly)} />
            <div style={{ height: "1px", background: "var(--border)" }} />
            <Row label="Projeção próximo mês" value={fmt(monthly)} />
            <div style={{ height: "1px", background: "var(--border)" }} />
            <Row label="Projeção anual" value={fmt(annual)} highlight />
            <div style={{ height: "1px", background: "var(--border)" }} />
            <Row label="Assinaturas ativas" value={`${active.length}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div style={{
      background: accent ? "rgba(0,212,170,0.08)" : "var(--card)",
      border: `1px solid ${accent ? "rgba(0,212,170,0.2)" : "var(--border)"}`,
      borderRadius: "18px", padding: "18px",
    }}>
      <p style={{ fontSize: "11px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </p>
      <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "22px", color: accent ? "var(--primary)" : "var(--foreground)", marginBottom: "4px", lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>
        {sub}
      </p>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "14px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>{label}</span>
      <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "15px", color: highlight ? "var(--primary)" : "var(--foreground)" }}>
        {value}
      </span>
    </div>
  );
}
