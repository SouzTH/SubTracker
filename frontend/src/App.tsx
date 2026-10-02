import { useState, ReactNode } from "react";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
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
import { queryClient, subsQueryKey } from "./lib/queryClient";
import { getSubsByUser } from "./lib/api";

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

function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = localStorage.getItem(SESSION_KEY);
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

function Painel() {
  const routerNavigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(() => getStoredUser());

  // TanStack Query cuida do fetch, do cache e do estado de carregamento das
  // assinaturas — cada tela que precisa alterar dados invalida esta mesma
  // chave (subsQueryKey) depois de uma mutação, em vez de recebermos um
  // `setSubs` para atualizar manualmente.
  const { data: subs = [] } = useQuery({
    queryKey: subsQueryKey(user?.id),
    queryFn: () => getSubsByUser(user!.id),
    enabled: !!user,
  });

  const navigate = (s: Screen, id?: any) => {
    setScreen(s);
    if (id !== undefined) setSelectedId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
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
    <div className="flex flex-col md:flex-row w-screen min-h-screen bg-background">

      {/* Sidebar — só aparece a partir do breakpoint md (768px), via CSS puro */}
      <aside className="hidden md:flex w-[260px] bg-[rgba(8,14,29,0.95)] border-r border-[rgba(255,255,255,0.06)] flex-col py-6 px-4 justify-between h-screen sticky top-0">
        <div>
          <div className="text-xl font-bold text-white mb-8 pl-3 font-heading">
            Sub<span className="text-primary">Tracker</span>
          </div>
          <DesktopNav screen={screen} navigate={navigate} />
        </div>

        <div className="p-3 border-t border-[rgba(255,255,255,0.06)]">
          <p className="text-[13px] text-foreground font-semibold mb-2 overflow-hidden text-ellipsis whitespace-nowrap font-body">
            {user.nome}
          </p>
          <button
            onClick={handleLogout}
            className="bg-transparent border-none text-muted-foreground cursor-pointer text-sm w-full text-left hover:text-foreground transition-colors font-body"
          >
            Terminar Sessão
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto min-h-screen pb-20 md:pb-0">
        <div className="w-full max-w-full md:max-w-[1200px] mx-auto p-4 md:p-10">
          {screen === "dashboard" && (
            <Dashboard subs={subs} navigate={navigate} budgets={user.budgets ?? DEFAULT_BUDGETS} userName={user.nome} />
          )}
          {screen === "add" && (
            <AddSubscription navigate={navigate} />
          )}
          {screen === "edit" && selectedSub && (
            <EditSubscription sub={selectedSub as any} navigate={navigate} />
          )}
          {screen === "details" && selectedSub && (
            <SubscriptionDetails sub={selectedSub as any} navigate={navigate} />
          )}
          {screen === "report" && (
            <Report subs={subs} navigate={navigate} />
          )}
          {screen === "import" && (
            <ImportStatement subs={subs} navigate={navigate} />
          )}
          {screen === "profile" && (
            <Profile user={user} onUserUpdate={handleUserUpdate} onLogout={handleLogout} navigate={navigate} />
          )}
        </div>
      </main>

      {/* Bottom nav — só aparece ABAIXO do breakpoint md, via CSS puro */}
      <BottomNav screen={screen} navigate={navigate} />

    </div>
  );
}

function DesktopNav({ screen, navigate }: { screen: Screen; navigate: (s: Screen) => void }) {
  return (
    <nav className="flex flex-col gap-2">
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
            className={`flex items-center gap-3 border-none rounded-sm cursor-pointer py-3 px-4 text-[15px] w-full text-left transition-colors font-body ${
              active ? "bg-primary/10 text-primary font-semibold" : "bg-transparent text-muted-foreground font-normal"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function BottomNav({ screen, navigate }: { screen: Screen; navigate: (s: Screen) => void }) {
  return (
    <div className="flex md:hidden fixed bottom-0 left-0 right-0 bg-[rgba(8,14,29,0.95)] backdrop-blur-[16px] border-t border-border justify-around items-center pt-3 px-4 pb-5 z-50">
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
              className="flex items-center gap-1.5 bg-primary text-primary-foreground border-none rounded-xl py-2.5 px-5 cursor-pointer shadow-[0_4px_12px_rgba(0,212,170,0.3)]"
            >
              <span className="text-xl font-bold">{item.icon}</span>
              <span className="text-sm font-bold font-body">{item.label}</span>
            </button>
          );
        }

        return (
          <button
            key={item.key}
            onClick={() => navigate(item.key as Screen)}
            className={`flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer py-1 px-3 transition-colors ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className={`text-[11px] font-body ${active ? "font-semibold" : "font-normal"}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
