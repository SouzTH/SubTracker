import type { PrismaClient } from "@prisma/client";
import type { PasswordResetRepository } from "../types";

export class PrismaPasswordResetRepository implements PasswordResetRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.db.$transaction(async (tx) => {
      await tx.passwordResetToken.deleteMany({
        where: { expiresAt: { lte: new Date() } },
      });
      await tx.passwordResetToken.deleteMany({ where: { userId } });
      await tx.passwordResetToken.create({
        data: { userId, tokenHash, expiresAt },
      });
    });
  }

  async delete(tokenHash: string): Promise<void> {
    await this.db.passwordResetToken.deleteMany({ where: { tokenHash } });
  }

  async consumeAndResetPassword(
    tokenHash: string,
    passwordHash: string,
    now: Date,
  ): Promise<boolean> {
    return this.db.$transaction(async (tx) => {
      const token = await tx.passwordResetToken.findUnique({
        where: { tokenHash },
        select: { userId: true },
      });
      if (!token) {
        return false;
      }

      const claimed = await tx.passwordResetToken.updateMany({
        where: { tokenHash, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      });
      if (claimed.count !== 1) {
        return false;
      }

      const updatedUser = await tx.user.updateMany({
        where: { id: token.userId },
        data: { passwordHash, authVersion: { increment: 1 } },
      });
      if (updatedUser.count !== 1) {
        return false;
      }

      await tx.refreshSession.deleteMany({ where: { userId: token.userId } });
      return true;
    });
  }
}
