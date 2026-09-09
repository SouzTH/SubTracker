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
  category: Subscription["category"];
  confirmed: boolean;
}

const DETECTED: DetectedSub[] = [
  {
    id: 101,
    name: "Spotify",
    icon: "🎵",
    color: "#1db954",
    value: 21.90,
    detectedDate: "10/08/2026",
    category: "Música",
    confirmed: false,
  },
  {
    id: 102,
    name: "iCloud+",
    icon: "☁️",
    color: "#0ea5e9",
    value: 9.90,
    detectedDate: "12/08/2026",
    category: "Outros",
    confirmed: false,
  },
  {
    id: 103,
    name: "Canva Pro",
    icon: "🖌️",
    color: "#8b5cf6",
    value: 54.90,
    detectedDate: "18/08/2026",
    category: "Trabalho",
    confirmed: false,
  },
];

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ImportStatement({ navigate, subs, setSubs }: Props) {
  const [stage, setStage] = useState<"upload" | "review">("upload");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [detected, setDetected] = useState<DetectedSub[]>(DETECTED);
  const [confirmed, setConfirmed] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (name: string) => {
    setFileName(name);
    setTimeout(() => setStage("review"), 800);
  };

  const toggle = (id: number) => {
    setConfirmed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    const toAdd = detected
      .filter((d) => confirmed.has(d.id))
      .map((d) => ({
        id: d.id,
        name: d.name,
        icon: d.icon,
        color: d.color,
        category: d.category,
        value: d.value,
        period: "Mensal" as const,
        nextCharge: "2026-09-10",
        paymentMethod: "Cartão de crédito",
        status: "Ativa" as const,
        history: [{ date: "2026-08-" + d.detectedDate.split("/")[0], value: d.value, status: "Pago" as const }],
      }));
    setSubs([...subs, ...toAdd]);
    setSaved(true);
    setTimeout(() => navigate("dashboard"), 1400);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Header */}
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
            {stage === "upload" ? "Envie seu arquivo OFX ou CSV" : "Assinaturas detectadas"}
          </p>
        </div>
      </div>

      {/* Progress */}
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
          <>
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f.name);
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
                  ou clique para selecionar
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {["OFX", "CSV"].map((ext) => (
                  <span key={ext} style={{
                    fontSize: "11px", padding: "4px 10px", borderRadius: "8px",
                    background: "var(--secondary)", color: "var(--muted-foreground)",
                    fontFamily: "Inter, sans-serif", fontWeight: 500,
                  }}>
                    .{ext}
                  </span>
                ))}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".ofx,.csv"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f.name);
                }}
              />
            </div>

          </>
        )}

        {stage === "review" && (
          <>
            {/* File badge */}
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
                    {/* Checkbox */}
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
                      <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", margin: 0 }}>
                        Detectado em {d.detectedDate} · {d.category}
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

            {/* Summary + CTA */}
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

            <button
              onClick={handleSave}
              disabled={confirmed.size === 0 || saved}
              style={{
                width: "100%", padding: "16px",
                borderRadius: "16px", border: "none",
                background: confirmed.size > 0 && !saved ? "var(--primary)" : "var(--muted)",
                color: confirmed.size > 0 && !saved ? "var(--primary-foreground)" : "var(--muted-foreground)",
                fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "16px",
                cursor: confirmed.size > 0 && !saved ? "pointer" : "not-allowed",
                transition: "all 0.15s",
                marginBottom: "24px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              {saved ? "✓ Assinaturas adicionadas!" : `Confirmar e Monitorar${confirmed.size > 0 ? ` (${confirmed.size})` : ""}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
