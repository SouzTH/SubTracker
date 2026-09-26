import { useState } from "react";
import { Subscription, Screen } from "../App";

interface Props {
  sub: Subscription;
  subs: Subscription[];
  setSubs: (s: Subscription[]) => void;
  navigate: (s: Screen, id?: string | number) => void;
}

const CATEGORIES = ["Streaming", "Trabalho", "Fitness", "Música", "Jogos", "Outros"] as const;
const PERIODS = ["Mensal", "Trimestral", "Anual"] as const;
const PAYMENTS = ["Cartão de crédito", "Débito automático", "Pix", "Boleto"];

export default function EditSubscription({ sub, subs, setSubs, navigate }: Props) {
  // Inicializamos os estados com os valores atuais da assinatura (sub)
  const [value, setValue] = useState(sub.value.toString());
  const [period, setPeriod] = useState(sub.period);
  const [nextCharge, setNextCharge] = useState(sub.nextCharge);
  const [category, setCategory] = useState(sub.category);
  const [payment, setPayment] = useState(sub.paymentMethod);
  
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!value) return;
    setSaving(true);

    const updatedData = {
      category,
      value: parseFloat(value.replace(",", ".")),
      period,
      nextCharge,
      paymentMethod: payment,
    };

    try {
      // Fazemos um PATCH para atualizar apenas os dados modificados
      const response = await fetch(`http://localhost:3000/subs/${sub.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const savedSub = await response.json();
        // Atualiza a lista local trocando a assinatura antiga pela nova
        setSubs(subs.map(s => s.id === sub.id ? savedSub : s));
        // Volta para a tela de detalhes da assinatura editada
        navigate("details", sub.id);
      } else {
        alert("Erro ao guardar as alterações no servidor.");
      }
    } catch (error) {
      console.error("Erro de ligação:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Header */}
      <div style={{ padding: "56px 24px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={() => navigate("details", sub.id)}
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
            Editar assinatura
          </h1>
          <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", margin: 0 }}>
            Atualize os dados de {sub.name}
          </p>
        </div>
      </div>

      <div style={{ padding: "0 24px" }}>
        {/* Card do Serviço Atual (Estático) */}
        <div style={{
          display: "flex", alignItems: "center", gap: "14px",
          background: "var(--card)", borderRadius: "16px", padding: "16px",
          marginBottom: "24px", border: "1px solid var(--border)",
        }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "14px",
            background: `${sub.color}22`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "26px",
          }}>
            {sub.icon}
          </div>
          <div>
            <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "17px" }}>{sub.name}</p>
            <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>Originalmente detectado como {sub.category}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Valor */}
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

          {/* Periodicidade */}
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

          {/* Próxima cobrança */}
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

          {/* Categoria */}
          <Field label="Categoria">
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c as any)}
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

          {/* Forma de Pagamento */}
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

          {/* Salvar */}
          <button
            onClick={handleSave}
            disabled={!value || saving}
            style={{
              width: "100%", padding: "16px",
              borderRadius: "16px", border: "none",
              background: value && !saving ? "var(--primary)" : "var(--muted)",
              color: value && !saving ? "var(--primary-foreground)" : "var(--muted-foreground)",
              fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "16px",
              cursor: value && !saving ? "pointer" : "not-allowed",
              transition: "all 0.15s",
              marginBottom: "24px",
            }}
          >
            {saving ? "A guardar..." : "Salvar alterações"}
          </button>
        </div>
      </div>
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