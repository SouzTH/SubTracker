import type { PrismaClient } from "@prisma/client";
import type { UpdateProfileInput } from "@subtracker/shared";
import { AppError } from "../../utils/AppError";
import type { NewUser, User, UserRepository } from "../types";
import { toUser, WITH_BUDGETS } from "./mappers";
import { isRecordNotFound, isUniqueViolation } from "./prismaErrors";

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly db: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const row = await this.db.user.findUnique({ where: { id }, include: WITH_BUDGETS });
    return row ? toUser(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.db.user.findUnique({ where: { email }, include: WITH_BUDGETS });
    return row ? toUser(row) : null;
  }

  async create(data: NewUser): Promise<User> {
    try {
      const row = await this.db.user.create({ data, include: WITH_BUDGETS });
      return toUser(row);
    } catch (error) {
      // Cobre a corrida em que dois cadastros com o mesmo e-mail passam
      // juntos pela checagem prévia do controller.
      if (isUniqueViolation(error)) {
        throw new AppError("Este e-mail já está cadastrado.", 409);
      }
      throw error;
    }
  }

  async update(id: string, patch: UpdateProfileInput): Promise<User | null> {
    try {
      const row = await this.db.user.update({ where: { id }, data: patch, include: WITH_BUDGETS });
      return toUser(row);
    } catch (error) {
      if (isRecordNotFound(error)) {
        return null;
      }
      throw error;
    }
  }
}
