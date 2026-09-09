import { Subscription, Screen } from "../App"

interface Props {
  subs: Subscription[]
  navigate: (s: Screen, id?: number) => void
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00")
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}

function daysUntil(iso: string) {
  const today = new Date("2026-09-01")
  const d = new Date(iso + "T00:00:00")
  const diff = Math.ceil(
    (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  )
  return diff
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

const CATEGORY_COLOR: Record<string, string> = {
  Streaming: "#e50914",
  Trabalho: "#6e5494",
  Fitness: "#f59e0b",
  Música: "#1db954",
  Jogos: "#0ea5e9",
  Outros: "#64748b",
}

const CATEGORY_LIMITS: Record<string, number> = {
  Streaming: 120,
  Trabalho: 350,
  Fitness: 100,
  Música: 30,
  Jogos: 80,
  Outros: 50,
}

export default function Dashboard({ subs, navigate }: Props) {
  const active = subs.filter((s) => s.status === "Ativa")
  const total = active.reduce((acc, s) => acc + s.value, 0)
  const sorted = [...subs].sort(
    (a, b) =>
      new Date(a.nextCharge).getTime() - new Date(b.nextCharge).getTime(),
  )

  // Build category totals for progress bars
  const byCategory: Record<string, number> = {}
  active.forEach((s) => {
    byCategory[s.category] = (byCategory[s.category] ?? 0) + s.value
  })
  const usedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1])

  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: "8px" }}>
      {/* Header */}
      <div style={{ padding: "56px 24px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "18px",
                color: "var(--muted-foreground)",
                fontFamily: "Inter, sans-serif",
                marginBottom: "2px",
                fontWeight: "bold",
              }}
            >
              Olá, Matheus!
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "var(--muted-foreground)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Setembro 2026
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Importar Extrato button */}
            <button
              onClick={() => navigate("import")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                background: "rgba(0,212,170,0.1)",
                border: "1px solid rgba(0,212,170,0.25)",
                borderRadius: "10px",
                padding: "7px 11px",
                cursor: "pointer",
                color: "var(--primary)",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: "14px" }}>⬆</span>
              Importar Extrato
            </button>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary), #0099aa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                flexShrink: 0,
              }}
            >
              👤
            </div>
          </div>
        </div>
      </div>

      {/* Total Card */}
      <div style={{ padding: "20px 24px 0" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #00d4aa18 0%, #0063e518 100%)",
            border: "1px solid rgba(0,212,170,0.2)",
            borderRadius: "24px",
            padding: "28px 24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)",
            }}
          />
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              fontFamily: "Inter, sans-serif",
              marginBottom: "8px",
            }}
          >
            Total gasto no mês
          </p>
          <p
            style={{
              fontSize: "42px",
              fontWeight: "800",
              fontFamily: "Outfit, sans-serif",
              color: "var(--primary)",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            {fmt(total)}
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
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
      <div style={{ padding: "20px 24px 0" }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            fontFamily: "Outfit, sans-serif",
            color: "var(--muted-foreground)",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Metas por categoria
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {usedCategories.map(([cat, spent]) => {
            const limit = CATEGORY_LIMITS[cat] ?? 100
            const pct = Math.min((spent / limit) * 100, 100)
            const over = spent > limit
            const color = CATEGORY_COLOR[cat] ?? "#64748b"
            return (
              <div
                key={cat}
                style={{
                  background: "var(--card)",
                  border: `1px solid ${over ? "rgba(239,68,68,0.25)" : "var(--border)"}`,
                  borderRadius: "14px",
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "13px",
                        fontFamily: "Inter, sans-serif",
                        color: "var(--foreground)",
                        fontWeight: 500,
                      }}
                    >
                      {cat}
                    </span>
                    {over && (
                      <span
                        style={{
                          fontSize: "10px",
                          padding: "1px 6px",
                          borderRadius: "8px",
                          background: "rgba(239,68,68,0.15)",
                          color: "#ef4444",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Limite
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 600,
                      color: over ? "#ef4444" : "var(--muted-foreground)",
                    }}
                  >
                    {fmt(spent)}{" "}
                    <span
                      style={{ color: "var(--muted-foreground)", fontWeight: 400 }}
                    >
                      / {fmt(limit)}
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    height: "5px",
                    background: "var(--border)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: "4px",
                      width: `${pct}%`,
                      background: over
                        ? "linear-gradient(90deg, #ef4444, #f87171)"
                        : `linear-gradient(90deg, ${color}, ${color}aa)`,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Subscriptions list */}
      <div style={{ padding: "20px 24px 0" }}>
        <p
          style={{
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: "Outfit, sans-serif",
            marginBottom: "12px",
          }}
        >
          Próximas cobranças
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {sorted.map((sub) => {
            const days = daysUntil(sub.nextCharge)
            const urgent = days <= 3
            return (
              <button
                key={sub.id}
                onClick={() => navigate("details", sub.id)}
                style={{
                  background: "var(--card)",
                  border: `1px solid ${
                    urgent && sub.status === "Ativa"
                      ? "rgba(245,158,11,0.3)"
                      : "var(--border)"
                  }`,
                  borderRadius: "16px",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "border-color 0.2s, transform 0.1s",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: `${sub.color}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    flexShrink: 0,
                    border: `1px solid ${sub.color}33`,
                  }}
                >
                  {sub.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Outfit, sans-serif",
                        fontWeight: 600,
                        fontSize: "15px",
                      }}
                    >
                      {sub.name}
                    </span>
                    {sub.status === "Pausada" && (
                      <span
                        style={{
                          fontSize: "10px",
                          padding: "2px 7px",
                          borderRadius: "10px",
                          background: "rgba(100,116,139,0.2)",
                          color: "var(--muted-foreground)",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Pausada
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {sub.category}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      ·
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color:
                          urgent && sub.status === "Ativa"
                            ? "#f59e0b"
                            : "var(--muted-foreground)",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
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
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 700,
                      fontSize: "16px",
                      marginBottom: "4px",
                    }}
                  >
                    {fmt(sub.value)}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {sub.period.toLowerCase()}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate("add")}
        style={{
          position: "fixed",
          bottom: "96px",
          right: "calc(50% - 195px + 20px)",
          width: "56px",
          height: "56px",
          borderRadius: "18px",
          background: "var(--primary)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          color: "var(--primary-foreground)",
          fontWeight: "300",
          boxShadow: "0 8px 32px rgba(0,212,170,0.4)",
          zIndex: 40,
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
      >
        +
      </button>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        style={{
          fontSize: "10px",
          color: "var(--muted-foreground)",
          fontFamily: "Inter, sans-serif",
          marginBottom: "2px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "14px",
          fontWeight: "600",
          fontFamily: "Outfit, sans-serif",
          color: "var(--foreground)",
        }}
      >
        {value}
      </p>
    </div>
  )
}
