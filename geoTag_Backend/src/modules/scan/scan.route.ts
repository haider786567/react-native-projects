import { Router } from "express";
import { identifyUser } from "../../middlewares/auth.middleware.js";
import { createScan, getScans, getStats } from "./scan.controller.js";

const router = Router();

router.use(identifyUser);

router.get("/", getScans);
router.post("/", createScan);
router.get("/stats", getStats);

export default router;
