import { Subscription, Screen } from "../App";

const CANCEL_URLS: Record<string, string> = {
  Netflix: "https://www.netflix.com/cancelplan",
  Spotify: "https://www.spotify.com/br/account/subscription/cancel",
  "Disney+": "https://www.disneyplus.com/pt-br/account",
  "HBO Max": "https://www.max.com/pt-br/account",
  "Adobe Creative": "https://account.adobe.com/plans",
  "GitHub Pro": "https://github.com/settings/billing",
  "Academia Smart": "https://www.smartfit.com.br/cancelamento",
  "PlayStation+": "https://www.playstation.com/pt-br/support/subscriptions/cancel-ps-plus/",
};

interface Props {
  sub: Subscription;
  navigate: (s: Screen) => void;
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function SubscriptionDetails({ sub, navigate }: Props) {
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Header with gradient */}
      <div style={{
        background: `linear-gradient(160deg, ${sub.color}28 0%, transparent 60%)`,
        padding: "56px 24px 24px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
          <button
            onClick={() => navigate("dashboard")}
            style={{
              width: "36px", height: "36px", borderRadius: "12px",
              background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", color: "var(--foreground)",
            }}
          >
            ←
          </button>
          <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "20px", margin: 0 }}>
            Detalhes
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "20px",
            background: `${sub.color}22`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "36px",
            border: `1.5px solid ${sub.color}44`,
          }}>
            {sub.icon}
          </div>
          <div>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "26px", margin: "0 0 4px" }}>
              {sub.name}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>
                {sub.category}
              </span>
              <span style={{
                fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
                background: sub.status === "Ativa" ? "rgba(0,212,170,0.15)" : "rgba(100,116,139,0.2)",
                color: sub.status === "Ativa" ? "var(--primary)" : "var(--muted-foreground)",
                fontFamily: "Inter, sans-serif", fontWeight: 500,
              }}>
                {sub.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main value */}
      <div style={{ padding: "24px 24px 0" }}>
        <div style={{
          background: "var(--card)", borderRadius: "20px", padding: "20px",
          border: "1px solid var(--border)", marginBottom: "16px",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <InfoBlock label="Valor" value={fmt(sub.value)} large accent />
            <InfoBlock label="Periodicidade" value={sub.period} />
            <InfoBlock label="Próxima cobrança" value={formatDate(sub.nextCharge)} />
            <InfoBlock label="Pagamento" value={sub.paymentMethod} />
          </div>
        </div>

        {/* Annual projection */}
        <div style={{
          background: `${sub.color}12`,
          border: `1px solid ${sub.color}30`,
          borderRadius: "16px", padding: "16px 20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: "24px",
        }}>
          <div>
            <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", marginBottom: "4px" }}>
              Projeção anual
            </p>
            <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--foreground)" }}>
              {fmt(sub.value * (sub.period === "Mensal" ? 12 : sub.period === "Trimestral" ? 4 : 1))}
            </p>
          </div>
          <div style={{
            width: "44px", height: "44px", borderRadius: "14px",
            background: `${sub.color}22`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px",
          }}>
            📊
          </div>
        </div>

        {/* Billing history */}
        <div>
          <p style={{ fontSize: "16px", fontWeight: "600", fontFamily: "Outfit, sans-serif", marginBottom: "12px" }}>
            Histórico de cobranças
          </p>
          {sub.history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px", color: "var(--muted-foreground)", fontSize: "14px" }}>
              Nenhuma cobrança registrada
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {sub.history.map((h, i) => (
                <div key={i} style={{
                  background: "var(--card)", borderRadius: "14px", padding: "14px 16px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  border: "1px solid var(--border)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      background: h.status === "Pago" ? "rgba(0,212,170,0.12)" : "rgba(245,158,11,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px",
                    }}>
                      {h.status === "Pago" ? "✓" : "⏳"}
                    </div>
                    <div>
                      <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "14px", marginBottom: "2px" }}>
                        {new Date(h.date + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
                      </p>
                      <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>
                        {new Date(h.date + "T00:00:00").getFullYear()}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>
                      {fmt(h.value)}
                    </p>
                    <span style={{
                      fontSize: "11px", padding: "2px 8px", borderRadius: "10px",
                      background: h.status === "Pago" ? "rgba(0,212,170,0.15)" : "rgba(245,158,11,0.15)",
                      color: h.status === "Pago" ? "var(--primary)" : "#f59e0b",
                      fontFamily: "Inter, sans-serif",
                    }}>
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
      <div style={{ padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{
            flex: 1, padding: "14px",
            borderRadius: "14px", border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--muted-foreground)",
            fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "14px",
            cursor: "pointer",
          }}>
            {sub.status === "Ativa" ? "⏸ Pausar" : "▶ Reativar"}
          </button>
          <button onClick={() => navigate("add")} style={{
            flex: 1, padding: "14px",
            borderRadius: "14px", border: "none",
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "14px",
            cursor: "pointer",
          }}>
            ✎ Editar
          </button>
        </div>

        {/* Cancel at provider */}
        {CANCEL_URLS[sub.name] && (
          <a
            href={CANCEL_URLS[sub.name]}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.07)",
              color: "#ef4444",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            <span>Cancelar no Provedor</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
              <path d="M2 2h10v10M12 2L2 12" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

function InfoBlock({ label, value, large, accent }: { label: string; value: string; large?: boolean; accent?: boolean }) {
  return (
    <div>
      <p style={{ fontSize: "11px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </p>
      <p style={{
        fontFamily: "Outfit, sans-serif",
        fontWeight: large ? 800 : 600,
        fontSize: large ? "24px" : "15px",
        color: accent ? "var(--primary)" : "var(--foreground)",
        lineHeight: 1.2,
      }}>
        {value}
      </p>
    </div>
  );
}
