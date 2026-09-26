import { useState } from "react";
import { CurrentUser, CategoryBudgets, DEFAULT_BUDGETS, Screen } from "../App";

interface Props {
  user: CurrentUser;
  onUserUpdate: (u: CurrentUser) => void;
  onLogout: () => void;
  navigate: (s: Screen) => void;
}

const PAYMENTS = ["Cartão de crédito", "Débito automático", "Pix", "Boleto"];
const CATEGORIES: (keyof CategoryBudgets)[] = ["Streaming", "Trabalho", "Fitness", "Música", "Jogos", "Outros"];

export default function Profile({ user, onUserUpdate, onLogout, navigate }: Props) {
  const [nome, setNome] = useState(user.nome);
  const [telefone, setTelefone] = useState(user.telefone ?? "");
  const [paymentMethod, setPaymentMethod] = useState(user.paymentMethod ?? PAYMENTS[0]);
  const [budgets, setBudgets] = useState<CategoryBudgets>(user.budgets ?? DEFAULT_BUDGETS);

  const [savingInfo, setSavingInfo] = useState(false);
  const [savedInfo, setSavedInfo] = useState(false);
  const [savingBudgets, setSavingBudgets] = useState(false);
  const [savedBudgets, setSavedBudgets] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveInfo = async () => {
    setSavingInfo(true);
    setSavedInfo(false);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, telefone, paymentMethod }),
      });
      if (!response.ok) throw new Error("Falha ao salvar");
      onUserUpdate({ ...user, nome, telefone, paymentMethod });
      setSavedInfo(true);
      setTimeout(() => setSavedInfo(false), 2000);
    } catch (e) {
      console.error(e);
      setError("Não foi possível salvar seus dados. Verifique se o json-server está rodando.");
    } finally {
      setSavingInfo(false);
    }
  };

  const saveBudgets = async () => {
    setSavingBudgets(true);
    setSavedBudgets(false);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budgets }),
      });
      if (!response.ok) throw new Error("Falha ao salvar");
      onUserUpdate({ ...user, budgets });
      setSavedBudgets(true);
      setTimeout(() => setSavedBudgets(false), 2000);
    } catch (e) {
      console.error(e);
      setError("Não foi possível salvar suas metas. Verifique se o json-server está rodando.");
    } finally {
      setSavingBudgets(false);
    }
  };

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Header */}
      <div style={{ padding: "56px 24px 24px", display: "flex", alignItems: "center", gap: "14px" }}>
        <button
          onClick={() => navigate("dashboard")}
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
            Meu Perfil
          </h1>
          <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", margin: 0 }}>
            {user.email}
          </p>
        </div>
      </div>

      <div style={{ padding: "0 24px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "12px", padding: "12px 14px",
            color: "#ef4444", fontFamily: "Inter, sans-serif", fontSize: "13px",
          }}>
            {error}
          </div>
        )}

        {/* Dados pessoais */}
        <section style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "20px" }}>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "16px", margin: "0 0 16px" }}>
            Dados pessoais
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Field label="Nome">
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={inputStyle}
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={user.email}
                disabled
                title="O email não pode ser alterado por aqui."
                style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }}
              />
            </Field>

            <Field label="Telefone (opcional)">
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                style={inputStyle}
              />
            </Field>

            <Field label="Forma de pagamento padrão">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ ...inputStyle, appearance: "none", cursor: "pointer", colorScheme: "dark" }}
              >
                {PAYMENTS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>

            <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", margin: 0 }}>
              Guardamos só um rótulo da forma de pagamento (ex.: "Cartão de crédito"), não o número do cartão —
              este protótipo não processa pagamentos de verdade.
            </p>

            <button onClick={saveInfo} disabled={savingInfo} style={saveButtonStyle(savingInfo)}>
              {savingInfo ? "Salvando..." : savedInfo ? "✓ Salvo!" : "Salvar dados"}
            </button>
          </div>
        </section>

        {/* Metas por categoria */}
        <section style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "20px" }}>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "16px", margin: "0 0 6px" }}>
            Metas por categoria
          </h2>
          <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", margin: "0 0 16px" }}>
            Define quanto você quer gastar por mês em cada categoria. Essas metas alimentam as barras de progresso do Dashboard.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {CATEGORIES.map((cat) => (
              <Field key={cat} label={cat}>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                    fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "14px", color: "var(--primary)",
                  }}>R$</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={budgets[cat]}
                    onChange={(e) => setBudgets({ ...budgets, [cat]: Number(e.target.value) })}
                    style={{ ...inputStyle, paddingLeft: "40px" }}
                  />
                </div>
              </Field>
            ))}

            <button onClick={saveBudgets} disabled={savingBudgets} style={saveButtonStyle(savingBudgets)}>
              {savingBudgets ? "Salvando..." : savedBudgets ? "✓ Salvo!" : "Salvar metas"}
            </button>
          </div>
        </section>

        {/* Como confirmar pagamentos */}
        <section style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "18px", padding: "20px" }}>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "16px", margin: "0 0 8px" }}>
            Como confirmar pagamentos
          </h2>
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", margin: 0, lineHeight: 1.5 }}>
            Abra uma assinatura e toque em <strong style={{ color: "var(--foreground)" }}>"Confirmar Pagamento"</strong> quando
            a cobrança cair na sua conta. Se preferir, importe o extrato do banco: quando uma cobrança já existente
            é encontrada lá, o SubTracker confirma o pagamento automaticamente, em vez de criar uma assinatura duplicada.
          </p>
        </section>

        <button
          onClick={onLogout}
          style={{
            padding: "14px", borderRadius: "14px",
            border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.07)",
            color: "#ef4444", fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: "var(--background)", border: "1px solid var(--border)",
  borderRadius: "12px", padding: "12px 14px",
  fontFamily: "Inter, sans-serif", fontSize: "14px",
  color: "var(--foreground)", outline: "none",
};

function saveButtonStyle(busy: boolean): React.CSSProperties {
  return {
    width: "100%", padding: "13px",
    borderRadius: "12px", border: "none",
    background: busy ? "var(--muted)" : "var(--primary)",
    color: busy ? "var(--muted-foreground)" : "var(--primary-foreground)",
    fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "14px",
    cursor: busy ? "not-allowed" : "pointer",
    marginTop: "4px",
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", marginBottom: "6px" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
