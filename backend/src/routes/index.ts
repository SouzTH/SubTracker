import { Router } from "express";
import authRoutes from "./auth.routes";
import budgetRoutes from "./budget.routes";
import subscriptionRoutes from "./subscription.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/budgets", budgetRoutes);

export default router;
