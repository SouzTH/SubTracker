
import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  login,
  logout,
  me,
  refresh,
  register,
  requestPasswordReset,
  resetPassword,
  updateMe,
} from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

const passwordResetRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas solicitações. Tente novamente mais tarde." },
});
const passwordResetCompleteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas tentativas. Tente novamente mais tarde." },
});

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/refresh", asyncHandler(refresh));
router.post("/logout", asyncHandler(logout));
router.post("/password-reset/request", passwordResetRequestLimiter, asyncHandler(requestPasswordReset));
router.post("/password-reset/complete", passwordResetCompleteLimiter, asyncHandler(resetPassword));
router.get("/me", requireAuth, asyncHandler(me));
router.patch("/me", requireAuth, asyncHandler(updateMe));

export default router;
