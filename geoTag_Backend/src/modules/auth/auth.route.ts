import { Router } from "express";
import { LoginController, RegisterController, LogoutController, ForgotPasswordController, ResetPasswordController, RefreshTokenController } from "./auth.controller.js";

const router = Router();


router.post("/register", RegisterController);

router.post("/login", LoginController);

router.post("/logout", LogoutController);

router.post("/forgot-password", ForgotPasswordController);

router.post("/reset-password", ResetPasswordController);
    
router.get("/refresh-token", RefreshTokenController);

export { router as authRouter };


export default router;