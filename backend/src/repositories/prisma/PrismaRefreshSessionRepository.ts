import type { PrismaClient } from "@prisma/client";
import type { RefreshSessionRepository } from "../types";

export class PrismaRefreshSessionRepository implements RefreshSessionRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(jti: string, userId: string, expiresAt: Date): Promise<void> {
    await this.db.refreshSession.create({
      data: { jti, userId, expiresAt },
    });
  }

  async consume(jti: string, userId: string, now: Date): Promise<boolean> {
    const { count } = await this.db.refreshSession.deleteMany({
      where: { jti, userId, expiresAt: { gt: now } },
    });
    return count === 1;
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.db.refreshSession.deleteMany({ where: { userId } });
  }
}
