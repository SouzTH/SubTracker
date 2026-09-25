import { useState } from "react";
import Dashboard from "./screens/Dashboard";
import AddSubscription from "./screens/AddSubscription";
import SubscriptionDetails from "./screens/SubscriptionDetails";
import Report from "./screens/Report";
import ImportStatement from "./screens/ImportStatement";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Login/Cadastro';

export type Screen = "dashboard" | "add" | "details" | "report" | "import";

export interface Subscription {
  id: number;
  name: string;
  category: "Streaming" | "Trabalho" | "Fitness" | "Música" | "Jogos" | "Outros";
  value: number;
  period: "Mensal" | "Trimestral" | "Anual";
  nextCharge: string;
  paymentMethod: string;
  status: "Ativa" | "Pausada";
  color: string;
  icon: string;
  history: { date: string; value: number; status: "Pago" | "Pendente" }[];
}

const INITIAL_SUBS: Subscription[] = [
  {
    id: 1,
    name: "Netflix",
    category: "Streaming",
    value: 55.90,
    period: "Mensal",
    nextCharge: "2026-09-05",
    paymentMethod: "Cartão de crédito",
    status: "Ativa",
    color: "#e50914",
    icon: "🎬",
    history: [
      { date: "2026-08-05", value: 55.90, status: "Pago" },
      { date: "2026-07-05", value: 55.90, status: "Pago" },
      { date: "2026-06-05", value: 55.90, status: "Pago" },
    ],
  },
  {
    id: 2,
    name: "Spotify",
    category: "Música",
    value: 21.90,
    period: "Mensal",
    nextCharge: "2026-09-08",
    paymentMethod: "Débito automático",
    status: "Ativa",
    color: "#1db954",
    icon: "🎵",
    history: [
      { date: "2026-08-08", value: 21.90, status: "Pago" },
      { date: "2026-07-08", value: 21.90, status: "Pago" },
    ],
  },
  {
    id: 3,
    name: "Adobe Creative",
    category: "Trabalho",
    value: 299.00,
    period: "Mensal",
    nextCharge: "2026-09-12",
    paymentMethod: "Cartão de crédito",
    status: "Ativa",
    color: "#ff0000",
    icon: "🎨",
    history: [
      { date: "2026-08-12", value: 299.00, status: "Pago" },
      { date: "2026-07-12", value: 299.00, status: "Pago" },
    ],
  },
  {
    id: 4,
    name: "Academia Smart",
    category: "Fitness",
    value: 89.90,
    period: "Mensal",
    nextCharge: "2026-09-15",
    paymentMethod: "Pix",
    status: "Ativa",
    color: "#f59e0b",
    icon: "💪",
    history: [
      { date: "2026-08-15", value: 89.90, status: "Pago" },
      { date: "2026-07-15", value: 89.90, status: "Pendente" },
    ],
  },
  {
    id: 5,
    name: "GitHub Pro",
    category: "Trabalho",
    value: 24.90,
    period: "Mensal",
    nextCharge: "2026-09-20",
    paymentMethod: "Cartão de crédito",
    status: "Ativa",
    color: "#6e5494",
    icon: "💻",
    history: [
      { date: "2026-08-20", value: 24.90, status: "Pago" },
    ],
  },
  {
    id: 6,
    name: "Disney+",
    category: "Streaming",
    value: 43.90,
    period: "Mensal",
    nextCharge: "2026-09-22",
    paymentMethod: "Cartão de crédito",
    status: "Pausada",
    color: "#0063e5",
    icon: "✨",
    history: [
      { date: "2026-08-22", value: 43.90, status: "Pago" },
    ],
  },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [subs, setSubs] = useState<Subscription[]>(INITIAL_SUBS);

  const navigate = (s: Screen, id?: number) => {
    setScreen(s);
    if (id !== undefined) setSelectedId(id);
  };

  const selectedSub = subs.find((s) => s.id === selectedId) ?? null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        
        <Route path="/painel" element={
          <div className="min-h-full flex items-center justify-center" style={{ background: "var(--background)", padding: "24px 16px", minHeight: "100vh" }}>
            <div
              style={{
                width: "390px",
                minHeight: "844px",
                background: "var(--background)",
                borderRadius: "44px",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 40px 120px rgba(0,212,170,0.1), 0 0 0 1px rgba(255,255,255,0.06)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {screen === "dashboard" && (
                <Dashboard subs={subs} navigate={navigate} />
              )}
              {screen === "add" && (
                <AddSubscription subs={subs} setSubs={setSubs} navigate={navigate} />
              )}
              {screen === "details" && selectedSub && (
                <SubscriptionDetails sub={selectedSub} navigate={navigate} />
              )}
              {screen === "report" && (
                <Report subs={subs} navigate={navigate} />
              )}
              {screen === "import" && (
                <ImportStatement subs={subs} setSubs={setSubs} navigate={navigate} />
              )}

              <BottomNav screen={screen} navigate={navigate} />
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

function BottomNav({ screen, navigate }: { screen: Screen; navigate: (s: Screen) => void }) {
  return (
    <div
      style={{
        position: "sticky",
        bottom: 0,
        background: "rgba(8,14,29,0.95)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-around",
        padding: "12px 0 20px",
        zIndex: 50,
      }}
    >
      {[
        { key: "dashboard", icon: "⊞", label: "Início" },
        { key: "report", icon: "◎", label: "Relatório" },
      ].map((item) => {
        const active =
          screen === item.key ||
          (screen === "details" && item.key === "dashboard") ||
          (screen === "add" && item.key === "dashboard") ||
          (screen === "import" && item.key === "dashboard");
        return (
          <button
            key={item.key}
            onClick={() => navigate(item.key as Screen)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 32px",
              color: active ? "var(--primary)" : "var(--muted-foreground)",
              transition: "color 0.2s",
            }}
          >
            <span style={{ fontSize: "22px", lineHeight: 1 }}>{item.icon}</span>
            <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", fontWeight: active ? 600 : 400 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}