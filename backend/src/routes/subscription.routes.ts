import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createSubscription,
  deleteSubscription,
  getSubscription,
  listSubscriptions,
  updateSubscription,
} from "../controllers/subscription.controller";

const router = Router();

// Todas as rotas de assinatura exigem login — não existe mais leitura
// "aberta" por userId na query string como no json-server.
router.use(requireAuth);

router.get("/", asyncHandler(listSubscriptions));
router.get("/:id", asyncHandler(getSubscription));
router.post("/", asyncHandler(createSubscription));
router.patch("/:id", asyncHandler(updateSubscription));
router.delete("/:id", asyncHandler(deleteSubscription));

export default router;
