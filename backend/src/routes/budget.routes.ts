import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { getBudgets, updateBudgets } from "../controllers/budget.controller";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(getBudgets));
router.put("/", asyncHandler(updateBudgets));

export default router;
