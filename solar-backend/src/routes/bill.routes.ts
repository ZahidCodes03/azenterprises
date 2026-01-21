import { Router } from "express";
import * as billController from "../controllers/bill.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Protect all bill routes - Admin only
router.use(authMiddleware, adminMiddleware);

router.post("/", billController.createBill);
router.get("/", billController.getBills);
router.get("/:id", billController.getBillById);
router.delete("/:id", billController.deleteBill);

export default router;
