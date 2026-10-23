import { prisma } from "../../lib/prisma";
import type { Repositories } from "../types";
import { PrismaBudgetRepository } from "./PrismaBudgetRepository";
import { PrismaSubscriptionRepository } from "./PrismaSubscriptionRepository";
import { PrismaUserRepository } from "./PrismaUserRepository";

export function createPrismaRepositories(): Repositories {
  return {
    users: new PrismaUserRepository(prisma),
    subscriptions: new PrismaSubscriptionRepository(prisma),
    budgets: new PrismaBudgetRepository(prisma),
  };
}
