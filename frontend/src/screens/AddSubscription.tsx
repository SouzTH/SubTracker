import { useState } from "react";
import { Subscription, Screen } from "../App";

interface Props {
  subs: Subscription[];
  setSubs: (s: Subscription[]) => void;
  navigate: (s: Screen) => void;
}

const SERVICES = [
  { name: "Netflix", icon: "🎬", color: "#e50914", category: "Streaming" },
  { name: "Spotify", icon: "🎵", color: "#1db954", category: "Música" },
  { name: "Disney+", icon: "✨", color: "#0063e5", category: "Streaming" },
  { name: "HBO Max", icon: "📺", color: "#5822a4", category: "Streaming" },
  { name: "Adobe Creative", icon: "🎨", color: "#ff0000", category: "Trabalho" },
  { name: "GitHub Pro", icon: "💻", color: "#6e5494", category: "Trabalho" },
  { name: "Academia", icon: "💪", color: "#f59e0b", category: "Fitness" },
  { name: "PlayStation+", icon: "🎮", color: "#003087", category: "Jogos" },
  { name: "Outro", icon: "📦", color: "#64748b", category: "Outros" },
];

const CATEGORIES = ["Streaming", "Trabalho", "Fitness", "Música", "Jogos", "Outros"] as const;
const PERIODS = ["Mensal", "Trimestral", "Anual"] as const;
const PAYMENTS = ["Cartão de crédito", "Débito automático", "Pix", "Boleto"];

export default function AddSubscription({ subs, setSubs, navigate }: Props) {
  const [step, setStep] = useState<"service" | "details">("service");
  const [selected, setSelected] = useState<typeof SERVICES[0] | null>(null);
  const [value, setValue] = useState("");
  const [period, setPeriod] = useState<"Mensal" | "Trimestral" | "Anual">("Mensal");
  const [nextCharge, setNextCharge] = useState("2026-10-01");
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("Streaming");
  const [payment, setPayment] = useState(PAYMENTS[0]);

  const handleSelectService = (s: typeof SERVICES[0]) => {
    setSelected(s);
    setCategory(s.category as typeof CATEGORIES[number]);
    setStep("details");
  };

  const handleSave = () => {
    if (!selected || !value) return;
    const newSub: Subscription = {
      id: Date.now(),
      name: selected.name,
      category,
      value: parseFloat(value.replace(",", ".")),
      period,
      nextCharge,
      paymentMethod: payment,
      status: "Ativa",
      color: selected.color,
      icon: selected.icon,
      history: [],
    };
    setSubs([...subs, newSub]);
    navigate("dashboard");
  };

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Header */}
      <div style={{ padding: "56px 24px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={() => step === "details" ? setStep("service") : navigate("dashboard")}
          style={{
            width: "36px", height: "36px", borderRadius: "12px",
            background: "var(--secondary)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", color: "var(--foreground)",
          }}
        >
          ←
        </button>
        <div>
          <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "22px", margin: 0 }}>
            {step === "service" ? "Escolher serviço" : "Detalhes"}
          </h1>
          <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", margin: 0 }}>
            {step === "service" ? "Passo 1 de 2" : "Passo 2 de 2"}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding: "0 24px 24px" }}>
        <div style={{ height: "3px", background: "var(--border)", borderRadius: "4px" }}>
          <div style={{
            height: "100%", borderRadius: "4px",
            width: step === "service" ? "50%" : "100%",
            background: "var(--primary)",
            transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {step === "service" && (
        <div style={{ padding: "0 24px" }}>
          <p style={{ fontSize: "14px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", marginBottom: "16px" }}>
            Selecione o serviço que deseja adicionar
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            {SERVICES.map((s) => (
              <button
                key={s.name}
                onClick={() => handleSelectService(s)}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "20px 8px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
              >
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: `${s.color}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px",
                }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--foreground)", textAlign: "center" }}>
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "details" && selected && (
        <div style={{ padding: "0 24px" }}>
          {/* Selected service preview */}
          <div style={{
            display: "flex", alignItems: "center", gap: "14px",
            background: "var(--card)", borderRadius: "16px", padding: "16px",
            marginBottom: "24px", border: "1px solid var(--border)",
          }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px",
              background: `${selected.color}22`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "26px",
            }}>
              {selected.icon}
            </div>
            <div>
              <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "17px" }}>{selected.name}</p>
              <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>{selected.category}</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Value */}
            <Field label="Valor da assinatura">
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                  fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "16px", color: "var(--primary)",
                }}>R$</span>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="0,00"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "var(--card)", border: "1px solid var(--border)",
                    borderRadius: "12px", padding: "14px 14px 14px 44px",
                    fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "18px",
                    color: "var(--foreground)", outline: "none",
                  }}
                />
              </div>
            </Field>

            {/* Period */}
            <Field label="Periodicidade">
              <div style={{ display: "flex", gap: "8px" }}>
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    style={{
                      flex: 1, padding: "12px 4px", borderRadius: "12px", border: "none",
                      background: period === p ? "var(--primary)" : "var(--card)",
                      color: period === p ? "var(--primary-foreground)" : "var(--muted-foreground)",
                      fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "13px",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </Field>

            {/* Next charge */}
            <Field label="Próxima cobrança">
              <input
                type="date"
                value={nextCharge}
                onChange={(e) => setNextCharge(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: "12px", padding: "14px",
                  fontFamily: "Inter, sans-serif", fontSize: "14px",
                  color: "var(--foreground)", outline: "none",
                  colorScheme: "dark",
                }}
              />
            </Field>

            {/* Category */}
            <Field label="Categoria">
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    style={{
                      padding: "8px 14px", borderRadius: "20px",
                      border: `1px solid ${category === c ? "var(--primary)" : "var(--border)"}`,
                      background: category === c ? "rgba(0,212,170,0.1)" : "transparent",
                      color: category === c ? "var(--primary)" : "var(--muted-foreground)",
                      fontFamily: "Inter, sans-serif", fontSize: "13px", cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </Field>

            {/* Payment */}
            <Field label="Forma de pagamento">
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: "12px", padding: "14px",
                  fontFamily: "Inter, sans-serif", fontSize: "14px",
                  color: "var(--foreground)", outline: "none",
                  colorScheme: "dark", appearance: "none",
                  cursor: "pointer",
                }}
              >
                {PAYMENTS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={!value}
              style={{
                width: "100%", padding: "16px",
                borderRadius: "16px", border: "none",
                background: value ? "var(--primary)" : "var(--muted)",
                color: value ? "var(--primary-foreground)" : "var(--muted-foreground)",
                fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "16px",
                cursor: value ? "pointer" : "not-allowed",
                transition: "all 0.15s",
                marginBottom: "24px",
              }}
            >
              Salvar assinatura
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "13px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", marginBottom: "8px" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
