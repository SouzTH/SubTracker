import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Screen, Subscription, getStoredUser } from "../App";
import { createSub, updateSub, ApiError } from "../lib/api";
import { subsQueryKey } from "../lib/queryClient";
import { fmt } from "../lib/money";

interface Props {
  navigate: (s: Screen) => void;
  subs: Subscription[];
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

export default function ImportStatement({ navigate, subs }: Props) {
  const [stage, setStage] = useState<"upload" | "review">("upload");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [detected, setDetected] = useState<DetectedSub[]>([]);
  const [confirmed, setConfirmed] = useState<Set<number>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const user = getStoredUser();

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
    saveMutation.reset();
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

  const saveMutation = useMutation({
    mutationFn: async (toProcess: DetectedSub[]) => {
      if (!user) throw new ApiError("Sessão expirada. Faça login novamente.");

      let novas = 0;
      let confirmadas = 0;

      for (const d of toProcess) {
        if (d.existing) {
          // Já existe: confirma o pagamento do ciclo atual em vez de duplicar.
          const updatedHistory = [...d.existing.history, { date: d.detectedDateISO, value: d.value, status: "Pago" as const }];
          const updatedNextCharge = addCycle(d.detectedDateISO, d.existing.period);
          await updateSub(d.existing.id, { history: updatedHistory, nextCharge: updatedNextCharge });
          confirmadas++;
        } else {
          // Novo: cria a assinatura com as datas reais detectadas no extrato.
          await createSub({
            userId: user.id,
            name: d.name,
            icon: d.icon,
            color: d.color,
            category: d.category,
            value: d.value,
            period: "Mensal",
            nextCharge: addCycle(d.detectedDateISO, "Mensal"),
            paymentMethod: "Cartão de crédito",
            status: "Ativa",
            history: [{ date: d.detectedDateISO, value: d.value, status: "Pago" }],
          });
          novas++;
        }
      }

      return { novas, confirmadas };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subsQueryKey(user?.id) });
      setTimeout(() => navigate("dashboard"), 1600);
    },
  });

  const handleSave = () => {
    const toProcess = detected.filter((d) => confirmed.has(d.id));
    saveMutation.mutate(toProcess);
  };

  const saved = saveMutation.isSuccess;
  const saving = saveMutation.isPending;
  const summary = saveMutation.data ?? null;
  const error = saveMutation.isError
    ? saveMutation.error instanceof ApiError
      ? saveMutation.error.message
      : "Não foi possível salvar no servidor. Verifique se o json-server está rodando (npm run server) e tente novamente."
    : null;

  const canSubmit = confirmed.size > 0 && !saved && !saving;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="pt-14 px-6 pb-5 flex items-center gap-[14px]">
        <button
          onClick={() => (stage === "review" ? setStage("upload") : navigate("dashboard"))}
          className="w-9 h-9 rounded-sm bg-secondary border-none cursor-pointer flex items-center justify-center text-lg text-foreground"
        >
          ←
        </button>
        <div>
          <h1 className="font-heading font-bold text-[22px]">
            Importar Extrato
          </h1>
          <p className="text-xs text-muted-foreground font-body">
            {stage === "upload" ? "Envie seu arquivo CSV" : "Assinaturas detectadas"}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="h-[3px] bg-border rounded-[4px]">
          <div className={`h-full rounded-[4px] bg-primary transition-[width] duration-[400ms] ease-in-out ${
            stage === "upload" ? "w-1/2" : "w-full"
          }`} />
        </div>
      </div>

      <div className="px-6">
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
            className={`border-2 border-dashed rounded-lg py-12 px-6 flex flex-col items-center gap-3 cursor-pointer transition-colors duration-200 mb-5 ${
              dragging ? "border-primary bg-primary/5" : "border-primary/25 bg-card"
            }`}
          >
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-[32px]">
              📄
            </div>
            <div className="text-center">
              <p className="font-heading font-semibold text-base mb-1.5">
                Arraste seu arquivo aqui
              </p>
              <p className="text-[13px] text-muted-foreground font-body">
                ou clique para selecionar o arquivo .csv
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>
        )}

        {stage === "review" && (
          <>
            <div className="flex items-center gap-2.5 bg-primary/8 border border-primary/20 rounded-sm py-2.5 px-[14px] mb-5">
              <span className="text-lg">📄</span>
              <span className="font-body text-[13px] text-foreground flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {fileName}
              </span>
              <span className="text-[11px] py-[3px] px-2 rounded-[8px] bg-primary/15 text-primary font-body font-medium shrink-0">
                Analisado
              </span>
            </div>

            <p className="text-sm text-muted-foreground font-body mb-3.5">
              <strong className="text-foreground">{detected.length} assinaturas</strong> encontradas na sua fatura. Selecione as que deseja monitorar:
            </p>

            <div className="flex flex-col gap-2.5 mb-6">
              {detected.map((d) => {
                const isChecked = confirmed.has(d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => toggle(d.id)}
                    className="rounded-md py-4 px-4 flex items-center gap-[14px] cursor-pointer text-left w-full transition-colors duration-[180ms] border-[1.5px]"
                    style={{
                      background: isChecked ? `${d.color}0f` : "var(--card)",
                      borderColor: isChecked ? `${d.color}55` : "var(--border)",
                    }}
                  >
                    <div
                      className="w-[22px] h-[22px] rounded-[8px] border-2 flex items-center justify-center shrink-0 transition-colors duration-150"
                      style={{ borderColor: isChecked ? d.color : "var(--border)", background: isChecked ? d.color : "transparent" }}
                    >
                      {isChecked && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>

                    <div
                      className="w-[42px] h-[42px] rounded-sm flex items-center justify-center text-xl shrink-0"
                      style={{ background: `${d.color}22` }}
                    >
                      {d.icon}
                    </div>

                    <div className="flex-1">
                      <p className="font-heading font-semibold text-[15px] mb-[3px]">
                        {d.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-body flex items-center gap-1.5 flex-wrap">
                        <span>Detectado em {d.detectedDate} · {d.category}</span>
                        <span className={`text-[10px] py-px px-[7px] rounded-[8px] font-semibold ${
                          d.existing ? "bg-primary/15 text-primary" : "bg-slate-400/15 text-muted-foreground"
                        }`}>
                          {d.existing ? "confirma pagamento" : "nova assinatura"}
                        </span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-heading font-bold text-base" style={{ color: isChecked ? d.color : "var(--foreground)" }}>
                        {fmt(d.value)}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-body">
                        / mês
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {confirmed.size > 0 && (
              <div className="bg-primary/6 border border-primary/20 rounded-[14px] py-[14px] px-4 mb-4 flex justify-between items-center">
                <span className="font-body text-[13px] text-muted-foreground">
                  {confirmed.size} selecionada{confirmed.size > 1 ? "s" : ""}
                </span>
                <span className="font-heading font-bold text-[15px] text-primary">
                  +{fmt([...confirmed].reduce((acc, id) => {
                    const d = detected.find((x) => x.id === id);
                    return acc + (d?.value ?? 0);
                  }, 0))}/mês
                </span>
              </div>
            )}

            {error && (
              <div className="bg-red-500/8 border border-red-500/25 rounded-sm py-3 px-[14px] mb-4 text-red-500 font-body text-[13px]">
                {error}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={!canSubmit}
              className={`w-full p-4 rounded-md border-none font-heading font-bold text-base transition-colors mb-6 flex items-center justify-center gap-2 ${
                canSubmit ? "bg-primary text-primary-foreground cursor-pointer" : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
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
