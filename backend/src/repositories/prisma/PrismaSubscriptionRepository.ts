import type { PrismaClient } from "@prisma/client";
import type { CreateSubscriptionInput, UpdateSubscriptionInput } from "@subtracker/shared";
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

  // Todo acesso por id filtra TAMBÉM por userId: é isso que impede um
  // usuário de ler ou alterar a assinatura de outro só adivinhando o id
  // (o json-server não tinha essa proteção).
  async findOwned(userId: string, id: string): Promise<Subscription | null> {
    const row = await this.db.subscription.findFirst({
      where: { id, userId },
      include: WITH_HISTORY,
    });
    return row ? toSubscription(row) : null;
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
    const owned = await this.db.subscription.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!owned) {
      return null;
    }

    const { history, ...fields } = patch;
    const row = await this.db.subscription.update({
      where: { id },
      data: {
        ...fields,
        // Se "history" veio no corpo, substitui o histórico inteiro (mesmo
        // comportamento do PATCH de array completo no json-server).
        ...(history ? { history: { deleteMany: {}, create: history } } : {}),
      },
      include: WITH_HISTORY,
    });
    return toSubscription(row);
  }

  async remove(userId: string, id: string): Promise<boolean> {
    // deleteMany aceita filtro composto (id + userId); o histórico some
    // junto por causa do onDelete: Cascade do schema.
    const { count } = await this.db.subscription.deleteMany({ where: { id, userId } });
    return count > 0;
  }
}
