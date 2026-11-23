import type { PrismaClient } from "@prisma/client";
import type { CreateSubscriptionInput, UpdateSubscriptionInput } from "@subtracker/shared";
import { AppError } from "../../utils/AppError";
import type { Subscription, SubscriptionRepository } from "../types";
import { toSubscription, WITH_HISTORY } from "./mappers";

export class PrismaSubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly db: PrismaClient) {}

  async listByUser(userId: string): Promise<Subscription[]> {
    const rows = await this.db.subscription.findMany({
      where: { userId },
      include: WITH_HISTORY,
      orderBy: { createdAt: "asc" },
    });
    return rows.map(toSubscription);
  }

  async findOwned(userId: string, id: string): Promise<Subscription | null> {
    const row = await this.db.subscription.findUnique({
      where: { id },
      include: WITH_HISTORY,
    });
    if (!row) {
      return null;
    }
    if (row.userId !== userId) {
      throw new AppError("Você não tem permissão para acessar esta assinatura.", 403);
    }
    return toSubscription(row);
  }

  async create(userId: string, data: CreateSubscriptionInput): Promise<Subscription> {
    const row = await this.db.subscription.create({
      data: { ...data, userId, history: { create: data.history } },
      include: WITH_HISTORY,
    });
    return toSubscription(row);
  }

  async update(
    userId: string,
    id: string,
    patch: UpdateSubscriptionInput,
  ): Promise<Subscription | null> {
    const row = await this.db.subscription.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    if (!row) {
      return null;
    }
    if (row.userId !== userId) {
      throw new AppError("Você não tem permissão para editar esta assinatura.", 403);
    }

    const { history, ...fields } = patch;
    const updated = await this.db.subscription.update({
      where: { id },
      data: {
        ...fields,
        // Se "history" veio no corpo, substitui o histórico inteiro (mesmo
        // comportamento do PATCH de array completo no json-server).
        ...(history ? { history: { deleteMany: {}, create: history } } : {}),
      },
      include: WITH_HISTORY,
    });
    return toSubscription(updated);
  }

  async remove(userId: string, id: string): Promise<boolean> {
    const row = await this.db.subscription.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    if (!row) {
      return false;
    }
    if (row.userId !== userId) {
      throw new AppError("Você não tem permissão para excluir esta assinatura.", 403);
    }

    const { count } = await this.db.subscription.deleteMany({ where: { id } });
    return count > 0;
  }
}
