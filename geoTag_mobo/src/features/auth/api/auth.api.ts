import api from "../../../services/api";
import type { AuthResponse, LoginInput, RegisterInput, User } from "../types/auth.type";

export const registerUser = async (data: RegisterInput) =>
  (await api.post<AuthResponse>("/auth/register", data)).data;

export const loginUser = async (data: LoginInput) =>
  (await api.post<AuthResponse>("/auth/login", data)).data;

export const logoutUser = async () => (await api.post<{ message: string }>("/auth/logout")).data;
export const getMe = async () => (await api.get<User & { _id?: string }>("/auth/me")).data;
export const forgotPassword = async (email: string) =>
  (await api.post("/auth/forgot-password", { email })).data;
export const resetPassword = async (token: string, password: string, confirmPassword: string) =>
  (await api.post("/auth/reset-password", { token, password, confirmPassword })).data;
