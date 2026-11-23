import type { PrismaClient } from "@prisma/client";
import { CATEGORY_VALUES, type CategoryBudgets, type UpdateBudgetsInput } from "@subtracker/shared";
import type { BudgetRepository } from "../types";
import { mergeBudgets } from "./mappers";

export class PrismaBudgetRepository implements BudgetRepository {
  constructor(private readonly db: PrismaClient) {}

  async getByUser(userId: string): Promise<CategoryBudgets> {
    const rows = await this.db.budget.findMany({ where: { userId } });
    return mergeBudgets(rows);
  }

  async updateMany(userId: string, patch: UpdateBudgetsInput): Promise<CategoryBudgets> {
    // Percorre as categorias conhecidas (e não as chaves do corpo), então
    // nada fora de CATEGORY_VALUES chega a ser gravado.
    const upserts = CATEGORY_VALUES.flatMap((category) => {
      const limitValue = patch[category];
      if (limitValue === undefined) {
        return [];
      }
      return [
        this.db.budget.upsert({
          where: { userId_category: { userId, category } },
          update: { limitValue },
          create: { userId, category, limitValue },
        }),
      ];
    });

    // Tudo ou nada: se uma categoria falhar, nenhuma é alterada.
    if (upserts.length > 0) {
      await this.db.$transaction(upserts);
    }

    return this.getByUser(userId);
  }
}
