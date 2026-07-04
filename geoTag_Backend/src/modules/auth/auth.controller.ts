import { LoginService, RefreshTokenService,RegisterService } from "./auth.service.js";
import type { Request, Response } from "express";

export const LoginController = async (req: Request, res: Response) => {
    try {
        const result = await LoginService(req.body);
        res.json(result);
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const RegisterController = async (req: Request, res: Response) => {
    try {
        const result = await RegisterService(req.body);
        res.json(result);
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const LogoutController = async (req: Request, res: Response) => {
    try {
        // Implement logout logic here
        res.json({ message: "User logged out successfully." });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const ForgotPasswordController = async (req: Request, res: Response) => {
    try {
        // Implement forgot password logic here
        res.json({ message: "Password reset link sent successfully." });
    } catch (error) {
        console.error("Error during forgot password:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const ResetPasswordController = async (req: Request, res: Response) => {
    try {
        // Implement reset password logic here
        res.json({ message: "Password reset successfully." });
    } catch (error) {
        console.error("Error during reset password:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const RefreshTokenController = async (req: Request, res: Response) => {
    try {
        const result = await RefreshTokenService(req.body.refreshToken);
        res.json(result);
    } catch (error) {
        console.error("Error during token refresh:", error);
        res.status(500).json({ message: "Internal server error." });
        
    }
}