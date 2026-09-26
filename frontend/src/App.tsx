import { useState, useEffect, ReactNode } from "react";
import Dashboard from "./screens/Dashboard";
import AddSubscription from "./screens/AddSubscription";
import SubscriptionDetails from "./screens/SubscriptionDetails";
import Report from "./screens/Report";
import ImportStatement from "./screens/ImportStatement";
import Profile from "./screens/Profile";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Login/Cadastro';
import { ForgotPassword } from './pages/Login/ForgotPassword';
import EditSubscription from "./screens/EditSubscription";

export type Screen = "dashboard" | "add" | "edit" | "details" | "report" | "import" | "profile";

export interface Subscription {
  id: string | number; // Flexibilizado para não quebrar os outros componentes
  userId?: string;
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

export type CategoryBudgets = Record<Subscription["category"], number>;

export const DEFAULT_BUDGETS: CategoryBudgets = {
  Streaming: 120,
  Trabalho: 350,
  Fitness: 100,
  Música: 30,
  Jogos: 80,
  Outros: 50,
};

export interface CurrentUser {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  paymentMethod?: string;
  budgets?: CategoryBudgets;
}

const SESSION_KEY = "subtracker_user";

export function getStoredUser(): CurrentUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as CurrentUser) : null;
  } catch {
    return null;
  }
}

function saveStoredUser(user: CurrentUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

// Correção: Uso de ReactNode em vez de JSX.Element para evitar o erro ts(2503)
function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = localStorage.getItem(SESSION_KEY);
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route
          path="/painel"
          element={
            <ProtectedRoute>
              <Painel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function Painel() {
  const routerNavigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  const [subs, setSubs] = useState<Subscription[]>([]);
  const [user, setUser] = useState<CurrentUser | null>(() => getStoredUser());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Busca apenas as assinaturas do utilizador com sessão iniciada.
  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:3000/subs?userId=${user.id}`)
      .then(response => response.json())
      .then(data => setSubs(data))
      .catch(error => console.error("Erro ao carregar dados:", error));
  }, [user]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = (s: Screen, id?: any) => {
    setScreen(s);
    if (id !== undefined) setSelectedId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY); // Remove a sessão do navegador
    setSubs([]); // <-- Limpa as assinaturas do ecrã
    setUser(null); // <-- Limpa o utilizador da memória
    routerNavigate('/');
  };

  // Chamado pela tela de Perfil depois de salvar no servidor, para refletir
  // as mudanças (nome, metas por categoria, etc.) em toda a aplicação na hora.
  const handleUserUpdate = (updated: CurrentUser) => {
    setUser(updated);
    saveStoredUser(updated);
  };

  const selectedSub = subs.find((s) => s.id === selectedId) ?? null;

  if (!user) return null;

  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      width: "100vw",
      minHeight: "100vh",
      background: "var(--background)"
    }}>

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
            <p style={{
              fontSize: "13px",
              color: "var(--foreground, #fff)",
              fontWeight: 600,
              margin: "0 0 8px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {user.nome}
            </p>
            <button
              onClick={handleLogout}
              style={{ background: "none", border: "none", color: "var(--muted-foreground, #a1a1aa)", cursor: "pointer", fontSize: "14px", width: "100%", textAlign: "left" }}
            >
              Terminar Sessão
            </button>
          </div>
        </aside>
      )}

      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        minHeight: "100vh",
        paddingBottom: isMobile ? "80px" : "0"
      }}>
        <div style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "1200px",
          margin: "0 auto",
          padding: isMobile ? "16px" : "40px"
        }}>
          {screen === "dashboard" && (
            <Dashboard subs={subs} navigate={navigate} budgets={user.budgets ?? DEFAULT_BUDGETS} />
          )}
          {screen === "add" && (
            <AddSubscription subs={subs} setSubs={setSubs} navigate={navigate} />
          )}

          {screen === "edit" && selectedSub && (
            <EditSubscription sub={selectedSub as any} subs={subs} setSubs={setSubs} navigate={navigate} />
          )}
          
          {screen === "details" && selectedSub && (
            <SubscriptionDetails sub={selectedSub as any} subs={subs} setSubs={setSubs} navigate={navigate} />
          )}
          {screen === "report" && (
            <Report subs={subs} navigate={navigate} />
          )}
          {screen === "import" && (
            <ImportStatement subs={subs} setSubs={setSubs} navigate={navigate} />
          )}
          {screen === "profile" && (
            <Profile user={user} onUserUpdate={handleUserUpdate} onLogout={handleLogout} navigate={navigate} />
          )}
        </div>
      </main>

      {isMobile && (
        <BottomNav screen={screen} navigate={navigate} />
      )}

    </div>
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
        { key: "profile", icon: "👤", label: "Meu Perfil" },
      ].map((item) => {
        const active = screen === item.key || ((screen === "details" || screen === "edit") && item.key === "dashboard");
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
        alignItems: "center",
        padding: "12px 16px 20px",
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
          (screen === "edit" && item.key === "dashboard") ||
          (screen === "import" && item.key === "dashboard") ||
          (screen === "profile" && item.key === "dashboard");

        if (item.key === "add") {
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.key as Screen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "var(--primary)",
                color: "#080e1d",
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