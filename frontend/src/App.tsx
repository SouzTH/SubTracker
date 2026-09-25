import { useState, useEffect } from "react";
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
    nextCharge: "2026-10-05",
    paymentMethod: "Cartão de crédito",
    status: "Ativa",
    color: "#e50914",
    icon: "🎬",
    history: [{ date: "2026-09-05", value: 55.90, status: "Pago" }],
  },
  {
    id: 2,
    name: "Spotify",
    category: "Música",
    value: 21.90,
    period: "Mensal",
    nextCharge: "2026-10-08",
    paymentMethod: "Débito automático",
    status: "Ativa",
    color: "#1db954",
    icon: "🎵",
    history: [{ date: "2026-09-08", value: 21.90, status: "Pago" }],
  }
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [subs, setSubs] = useState<Subscription[]>(INITIAL_SUBS);
  
  // Deteta se o ecrã atual é telemóvel (menos de 768px de largura)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          <div style={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row", 
            width: "100vw", 
            minHeight: "100vh", 
            background: "var(--background)" 
          }}>
            
            {/* Se for COMPUTADOR: Mostra a Barra Lateral (Sidebar) */}
            {!isMobile && (
              <aside style={{ 
                width: "260px", 
                background: "rgba(8,14,29,0.95)", 
                borderRight: "1px solid rgba(255,255,255,0.06)",
                display: "flex", 
                flexDirection: "column", 
                padding: "24px 16px",
                justifyContent: "space-between",
                height: "100vh",
                position: "sticky",
                top: 0
              }}>
                <div>
                  <div style={{ fontSize: "20px", fontWeight: "bold", color: "#fff", marginBottom: "32px", paddingLeft: "12px" }}>
                    Sub<span style={{ color: "var(--primary, #00d4aa)" }}>Tracker</span>
                  </div>
                  <DesktopNav screen={screen} navigate={navigate} />
                </div>

                <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <button 
                    onClick={() => navigate("dashboard" as Screen)} 
                    style={{ background: "none", border: "none", color: "var(--muted-foreground, #a1a1aa)", cursor: "pointer", fontSize: "14px", width: "100%", textAlign: "left" }}
                  >
                    Terminar Sessão
                  </button>
                </div>
              </aside>
            )}

            {/* Conteúdo Principal do Site / App */}
            <main style={{ 
              flex: 1, 
              display: "flex", 
              flexDirection: "column", 
              overflowY: "auto", 
              minHeight: "100vh",
              paddingBottom: isMobile ? "80px" : "0" // Espaço para a barra móvel não tapar o conteúdo
            }}>
              <div style={{ 
                width: "100%", 
                maxWidth: isMobile ? "100%" : "1200px", 
                margin: "0 auto", 
                padding: isMobile ? "16px" : "40px" 
              }}>
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
              </div>
            </main>

            {/* Se for TELEMÓVEL: Mostra a Barra de Navegação Inferior (BottomNav) */}
            {isMobile && (
              <BottomNav screen={screen} navigate={navigate} />
            )}

          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

function DesktopNav({ screen, navigate }: { screen: Screen; navigate: (s: Screen) => void }) {
  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {[
        { key: "dashboard", icon: "⊞", label: "Dashboard" },
        { key: "report", icon: "◎", label: "Relatórios" },
        { key: "add", icon: "+", label: "Nova Subscrição" },
        { key: "import", icon: "📄", label: "Importar Fatura" },
      ].map((item) => {
        const active = screen === item.key || (screen === "details" && item.key === "dashboard");
        return (
          <button
            key={item.key}
            onClick={() => navigate(item.key as Screen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: active ? "rgba(0, 212, 170, 0.1)" : "transparent",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              padding: "12px 16px",
              color: active ? "var(--primary, #00d4aa)" : "var(--muted-foreground, #a1a1aa)",
              fontSize: "15px",
              fontWeight: active ? 600 : 400,
              transition: "0.2s",
              width: "100%",
              textAlign: "left"
            }}
          >
            <span style={{ fontSize: "18px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function BottomNav({ screen, navigate }: { screen: Screen; navigate: (s: Screen) => void }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(8,14,29,0.95)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center", // Alinha os itens ao centro verticalmente
        padding: "12px 16px 20px", // Ajuste no espaçamento
        zIndex: 50,
      }}
    >
      {[
        { key: "dashboard", icon: "⊞", label: "Início" },
        { key: "add", icon: "+", label: "Adicionar" },
        { key: "report", icon: "◎", label: "Relatório" },
      ].map((item) => {
        const active =
          screen === item.key ||
          (screen === "details" && item.key === "dashboard") ||
          (screen === "import" && item.key === "dashboard");

        // ESTILO ESPECIAL PARA O BOTÃO ADICIONAR
        if (item.key === "add") {
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.key as Screen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "var(--primary)", // O teu verde
                color: "#080e1d", // Fundo escuro para a letra e ícone destacarem
                border: "none",
                borderRadius: "24px",
                padding: "10px 20px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,212,170,0.3)",
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>{item.icon}</span>
              <span style={{ fontSize: "14px", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
                {item.label}
              </span>
            </button>
          );
        }

        // ESTILO NORMAL PARA OS OUTROS BOTÕES (Início e Relatório)
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
              padding: "4px 12px",
              color: active ? "var(--primary)" : "var(--muted-foreground)",
              transition: "color 0.2s",
            }}
          >
            <span style={{ fontSize: "20px", lineHeight: 1 }}>{item.icon}</span>
            <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", fontWeight: active ? 600 : 400 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}