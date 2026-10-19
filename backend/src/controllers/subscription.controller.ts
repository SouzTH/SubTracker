import { createSubscriptionSchema, updateSubscriptionSchema } from "@subtracker/shared";
import type { Request, Response } from "express";
import { getUserId } from "../middleware/auth";
import { repositories } from "../repositories";
import { AppError } from "../utils/AppError";

const NOT_FOUND = "Assinatura não encontrada.";

// GET /api/subscriptions
export async function listSubscriptions(req: Request, res: Response) {
  res.json(await repositories.subscriptions.listByUser(getUserId(req)));
}

// GET /api/subscriptions/:id
export async function getSubscription(req: Request, res: Response) {
  const subscription = await repositories.subscriptions.findOwned(getUserId(req), req.params.id);
  if (!subscription) {
    throw new AppError(NOT_FOUND, 404);
  }

  res.json(subscription);
}

// POST /api/subscriptions
export async function createSubscription(req: Request, res: Response) {
  const data = createSubscriptionSchema.parse(req.body);

  const subscription = await repositories.subscriptions.create(getUserId(req), data);
  res.status(201).json(subscription);
}

// PATCH /api/subscriptions/:id
export async function updateSubscription(req: Request, res: Response) {
  const patch = updateSubscriptionSchema.parse(req.body);

  const subscription = await repositories.subscriptions.update(
    getUserId(req),
    req.params.id,
    patch,
  );
  if (!subscription) {
    throw new AppError(NOT_FOUND, 404);
  }

  res.json(subscription);
}

// DELETE /api/subscriptions/:id
export async function deleteSubscription(req: Request, res: Response) {
  const removed = await repositories.subscriptions.remove(getUserId(req), req.params.id);
  if (!removed) {
    throw new AppError(NOT_FOUND, 404);
  }

  res.status(204).send();
}
