import { useState, useRef } from "react";
import { Screen, Subscription } from "../App";

interface Props {
  navigate: (s: Screen) => void;
  subs: Subscription[];
  setSubs: (s: Subscription[]) => void;
}

interface DetectedSub {
  id: number;
  name: string;
  icon: string;
  color: string;
  value: number;
  detectedDate: string;
  detectedDateISO: string;
  category: Subscription["category"];
  confirmed: boolean;
  /** Se já existe uma assinatura ativa com esse nome, o "import" vira confirmação de pagamento em vez de criar duplicata. */
  existing: Subscription | null;
}

// Catálogo de regras para detetar serviços conhecidos no extrato
const KNOWN_SERVICES = [
  { keyword: "NETFLIX", name: "Netflix", icon: "🎬", color: "#e50914", category: "Streaming" as const },
  { keyword: "SPOTIFY", name: "Spotify", icon: "🎵", color: "#1db954", category: "Música" as const },
  { keyword: "SMARTFIT", name: "Academia", icon: "💪", color: "#f59e0b", category: "Fitness" as const },
  { keyword: "ADOBE", name: "Adobe Creative", icon: "🎨", color: "#ff0000", category: "Trabalho" as const },
  { keyword: "GITHUB", name: "GitHub Pro", icon: "💻", color: "#6e5494", category: "Trabalho" as const },
  { keyword: "CANVA", name: "Canva Pro", icon: "🖌️", color: "#8b5cf6", category: "Trabalho" as const },
];

// Converte "dd/mm/yyyy" (formato do nosso CSV) para "yyyy-mm-dd" (formato usado no resto do app)
function toISO(dateBR: string): string {
  const [d, m, y] = dateBR.split("/");
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function addCycle(iso: string, period: Subscription["period"]) {
  const d = new Date(iso + "T00:00:00");
  const months = period === "Mensal" ? 1 : period === "Trimestral" ? 3 : 12;
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ImportStatement({ navigate, subs, setSubs }: Props) {
  const [stage, setStage] = useState<"upload" | "review">("upload");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [detected, setDetected] = useState<DetectedSub[]>([]);
  const [confirmed, setConfirmed] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState<{ novas: number; confirmadas: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // MOTOR REAL DE LEITURA DO CSV
  const processCSVText = (text: string) => {
    const lines = text.split("\n");
    const found: DetectedSub[] = [];
    let idCounter = 1;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // O formato esperado do CSV é: data,descricao,valor
      const parts = line.split(",");
      if (parts.length >= 3) {
        const dateStr = parts[0].trim(); // ex: 05/09/2026
        const desc = parts[1].trim().toUpperCase(); // ex: NETFLIX.COM
        const rawValue = parseFloat(parts[2].trim()); // ex: -55.90

        // Procura se a descrição corresponde a algum serviço conhecido
        const match = KNOWN_SERVICES.find((s) => desc.includes(s.keyword));

        if (match) {
          const absoluteValue = Math.abs(rawValue); // Converte para positivo
          // Já existe uma assinatura ativa com este nome? Então isso é uma
          // cobrança de algo que já monitoramos — vamos confirmar o pagamento
          // dela em vez de criar uma assinatura duplicada.
          const existingSub = subs.find((s) => s.status === "Ativa" && s.name.toLowerCase() === match.name.toLowerCase()) ?? null;

          found.push({
            id: idCounter++,
            name: match.name,
            icon: match.icon,
            color: match.color,
            value: absoluteValue,
            detectedDate: dateStr,
            detectedDateISO: toISO(dateStr),
            category: match.category,
            confirmed: true, // Pré-selecionado por defeito
            existing: existingSub,
          });
        }
      }
    }

    setDetected(found);
    // Seleciona todos automaticamente por defeito
    setConfirmed(new Set(found.map((f) => f.id)));
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        processCSVText(text);
        setStage("review");
      }
    };
    reader.readAsText(file);
  };

  const toggle = (id: number) => {
    setConfirmed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    const userStorage = localStorage.getItem('subtracker_user');
    if (!userStorage) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = "/";
        return;
    }
    const currentUser = JSON.parse(userStorage);
    const toProcess = detected.filter((d) => confirmed.has(d.id));

    setSaving(true);
    setError(null);

    try {
      const nextSubs = [...subs];
      let novas = 0;
      let confirmadas = 0;

      for (const d of toProcess) {
        if (d.existing) {
          // Já existe: confirma o pagamento do ciclo atual em vez de duplicar.
          const updatedHistory = [...d.existing.history, { date: d.detectedDateISO, value: d.value, status: "Pago" as const }];
          const updatedNextCharge = addCycle(d.detectedDateISO, d.existing.period);
          const response = await fetch(`http://localhost:3000/subs/${d.existing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ history: updatedHistory, nextCharge: updatedNextCharge }),
          });
          if (!response.ok) throw new Error(`Falha ao confirmar pagamento de ${d.name}`);
          const updated = await response.json();
          const idx = nextSubs.findIndex((s) => s.id === d.existing!.id);
          if (idx >= 0) nextSubs[idx] = updated;
          confirmadas++;
        } else {
          // Novo: cria a assinatura com as datas reais detectadas no extrato.
          const newSub = {
            userId: currentUser.id,
            name: d.name,
            icon: d.icon,
            color: d.color,
            category: d.category,
            value: d.value,
            period: "Mensal" as const,
            nextCharge: addCycle(d.detectedDateISO, "Mensal"),
            paymentMethod: "Cartão de crédito",
            status: "Ativa" as const,
            history: [{ date: d.detectedDateISO, value: d.value, status: "Pago" as const }],
          };
          const response = await fetch("http://localhost:3000/subs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSub),
          });
          if (!response.ok) throw new Error(`Falha ao criar ${d.name}`);
          const created = await response.json();
          nextSubs.push(created);
          novas++;
        }
      }

      setSubs(nextSubs);
      setSummary({ novas, confirmadas });
      setSaved(true);
      setTimeout(() => navigate("dashboard"), 1600);
    } catch (error) {
      console.error("Erro ao processar extrato importado:", error);
      setError("Não foi possível salvar no servidor. Verifique se o json-server está rodando (npm run server) e tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ padding: "56px 24px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
        <button
          onClick={() => (stage === "review" ? setStage("upload") : navigate("dashboard"))}
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
            Importar Extrato
          </h1>
          <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", margin: 0 }}>
            {stage === "upload" ? "Envie seu arquivo CSV" : "Assinaturas detectadas"}
          </p>
        </div>
      </div>

      <div style={{ padding: "0 24px 24px" }}>
        <div style={{ height: "3px", background: "var(--border)", borderRadius: "4px" }}>
          <div style={{
            height: "100%", borderRadius: "4px",
            width: stage === "upload" ? "50%" : "100%",
            background: "var(--primary)",
            transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      <div style={{ padding: "0 24px" }}>
        {stage === "upload" && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? "var(--primary)" : "rgba(0,212,170,0.25)"}`,
              borderRadius: "20px",
              padding: "48px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              background: dragging ? "rgba(0,212,170,0.05)" : "var(--card)",
              transition: "all 0.2s",
              marginBottom: "20px",
            }}
          >
            <div style={{
              width: "64px", height: "64px", borderRadius: "20px",
              background: "rgba(0,212,170,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "32px",
            }}>
              📄
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "16px", margin: "0 0 6px" }}>
                Arraste seu arquivo aqui
              </p>
              <p style={{ fontSize: "13px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", margin: 0 }}>
                ou clique para selecionar o arquivo .csv
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>
        )}

        {stage === "review" && (
          <>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.2)",
              borderRadius: "12px", padding: "10px 14px", marginBottom: "20px",
            }}>
              <span style={{ fontSize: "18px" }}>📄</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "var(--foreground)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {fileName}
              </span>
              <span style={{
                fontSize: "11px", padding: "3px 8px", borderRadius: "8px",
                background: "rgba(0,212,170,0.15)", color: "var(--primary)",
                fontFamily: "Inter, sans-serif", fontWeight: 500, flexShrink: 0,
              }}>
                Analisado
              </span>
            </div>

            <p style={{ fontSize: "14px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", marginBottom: "14px" }}>
              <strong style={{ color: "var(--foreground)" }}>{detected.length} assinaturas</strong> encontradas na sua fatura. Selecione as que deseja monitorar:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {detected.map((d) => {
                const isChecked = confirmed.has(d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => toggle(d.id)}
                    style={{
                      background: isChecked ? `${d.color}0f` : "var(--card)",
                      border: `1.5px solid ${isChecked ? d.color + "55" : "var(--border)"}`,
                      borderRadius: "16px",
                      padding: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      transition: "all 0.18s",
                    }}
                  >
                    <div style={{
                      width: "22px", height: "22px", borderRadius: "8px",
                      border: `2px solid ${isChecked ? d.color : "var(--border)"}`,
                      background: isChecked ? d.color : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, transition: "all 0.15s",
                    }}>
                      {isChecked && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>

                    <div style={{
                      width: "42px", height: "42px", borderRadius: "12px",
                      background: `${d.color}22`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "20px", flexShrink: 0,
                    }}>
                      {d.icon}
                    </div>

                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "15px", margin: "0 0 3px" }}>
                        {d.name}
                      </p>
                      <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", margin: 0, display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <span>Detectado em {d.detectedDate} · {d.category}</span>
                        <span style={{
                          fontSize: "10px", padding: "1px 7px", borderRadius: "8px",
                          background: d.existing ? "rgba(0,212,170,0.15)" : "rgba(148,163,184,0.15)",
                          color: d.existing ? "var(--primary)" : "var(--muted-foreground)",
                          fontWeight: 600,
                        }}>
                          {d.existing ? "confirma pagamento" : "nova assinatura"}
                        </span>
                      </p>
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "16px", margin: 0, color: isChecked ? d.color : "var(--foreground)" }}>
                        {fmt(d.value)}
                      </p>
                      <p style={{ fontSize: "11px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", margin: 0 }}>
                        / mês
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {confirmed.size > 0 && (
              <div style={{
                background: "rgba(0,212,170,0.06)", border: "1px solid rgba(0,212,170,0.2)",
                borderRadius: "14px", padding: "14px 16px", marginBottom: "16px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "var(--muted-foreground)" }}>
                  {confirmed.size} selecionada{confirmed.size > 1 ? "s" : ""}
                </span>
                <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--primary)" }}>
                  +{fmt([...confirmed].reduce((acc, id) => {
                    const d = detected.find((x) => x.id === id);
                    return acc + (d?.value ?? 0);
                  }, 0))}/mês
                </span>
              </div>
            )}

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: "12px", padding: "12px 14px", marginBottom: "16px",
                color: "#ef4444", fontFamily: "Inter, sans-serif", fontSize: "13px",
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={confirmed.size === 0 || saved || saving}
              style={{
                width: "100%", padding: "16px",
                borderRadius: "16px", border: "none",
                background: confirmed.size > 0 && !saved && !saving ? "var(--primary)" : "var(--muted)",
                color: confirmed.size > 0 && !saved && !saving ? "var(--primary-foreground)" : "var(--muted-foreground)",
                fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "16px",
                cursor: confirmed.size > 0 && !saved && !saving ? "pointer" : "not-allowed",
                transition: "all 0.15s",
                marginBottom: "24px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              {saved
                ? `✓ ${summary ? [
                    summary.novas > 0 ? `${summary.novas} nova${summary.novas > 1 ? "s" : ""}` : null,
                    summary.confirmadas > 0 ? `${summary.confirmadas} confirmada${summary.confirmadas > 1 ? "s" : ""}` : null,
                  ].filter(Boolean).join(" · ") : "Concluído"}!`
                : saving
                  ? "Salvando..."
                  : `Confirmar e Monitorar${confirmed.size > 0 ? ` (${confirmed.size})` : ""}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}