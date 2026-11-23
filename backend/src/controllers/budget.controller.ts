import { updateBudgetsSchema } from "@subtracker/shared";
import type { Request, Response } from "express";
import { getUserId } from "../middleware/auth";
import { repositories } from "../repositories";

// GET /api/budgets — equivalente ao `CategoryBudgets` do frontend
export async function getBudgets(req: Request, res: Response) {
  res.json(await repositories.budgets.getByUser(getUserId(req)));
}

// PUT /api/budgets — aceita um objeto parcial, ex.: { "Streaming": 150 }
export async function updateBudgets(req: Request, res: Response) {
  const patch = updateBudgetsSchema.parse(req.body);

  res.json(await repositories.budgets.updateMany(getUserId(req), patch));
}
