// Contratos da camada de acesso a dados (padrão DAO/Repository, como na
// aula): os controllers conhecem SÓ estas interfaces. Quem sabe falar com
// o banco (Prisma hoje; Mongoose, se um dia for preciso) é a implementação,
// escolhida em src/repositories/index.ts. Por isso nenhum tipo do Prisma
// aparece aqui — os repositórios devolvem objetos de domínio simples.

import type {
  Category,
  CategoryBudgets,
  CreateSubscriptionInput,
  PaymentStatus,
  Period,
  SubscriptionStatus,
  UpdateBudgetsInput,
  UpdateProfileInput,
  UpdateSubscriptionInput,
} from "@subtracker/shared";

export interface User {
  id: string;
  nome: string;
  email: string;
  passwordHash: string;
  telefone?: string;
  paymentMethod?: string;
  // Sempre completo: categorias nunca personalizadas vêm com o valor padrão.
  budgets: CategoryBudgets;
}

export interface PaymentHistoryItem {
  date: string;
  value: number;
  status: PaymentStatus;
}

// Mesmo formato que `frontend/src/App.tsx` espera em `Subscription`
// (aqui o id é sempre string).
export interface Subscription {
  id: string;
  name: string;
  category: Category;
  value: number;
  period: Period;
  nextCharge: string;
  paymentMethod: string;
  status: SubscriptionStatus;
  color: string;
  icon: string;
  history: PaymentHistoryItem[];
}

export interface NewUser {
  nome: string;
  email: string;
  passwordHash: string;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  /** Lança AppError 409 se o e-mail já existir. */
  create(data: NewUser): Promise<User>;
  /** Devolve null se o usuário não existir mais. */
  update(id: string, patch: UpdateProfileInput): Promise<User | null>;
}

// Todos os métodos recebem `userId`: o isolamento entre contas é
// responsabilidade da camada de dados, não de quem chama.
export interface SubscriptionRepository {
  listByUser(userId: string): Promise<Subscription[]>;
  findOwned(userId: string, id: string): Promise<Subscription | null>;
  create(userId: string, data: CreateSubscriptionInput): Promise<Subscription>;
  /** Devolve null se a assinatura não existir ou não for do usuário. */
  update(userId: string, id: string, patch: UpdateSubscriptionInput): Promise<Subscription | null>;
  /** Devolve false se a assinatura não existir ou não for do usuário. */
  remove(userId: string, id: string): Promise<boolean>;
}

export interface BudgetRepository {
  getByUser(userId: string): Promise<CategoryBudgets>;
  /** Atualiza só as categorias presentes em `patch` e devolve o conjunto completo. */
  updateMany(userId: string, patch: UpdateBudgetsInput): Promise<CategoryBudgets>;
}

export interface Repositories {
  users: UserRepository;
  subscriptions: SubscriptionRepository;
  budgets: BudgetRepository;
}
