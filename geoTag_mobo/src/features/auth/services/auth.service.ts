import { forgotPassword, getMe, loginUser, logoutUser, registerUser, resetPassword } from "../api/auth.api";
import type { LoginInput, RegisterInput, User } from "../types/auth.type";
import { clearTokens, getAccessToken, saveTokens } from "../../../services/secureStore";

const normalizeUser = (user: User & { _id?: string }): User => ({
  id: user.id ?? user._id ?? "",
  name: user.name,
  email: user.email,
});

export const login = async (data: LoginInput) => {
  const response = await loginUser(data);
  await saveTokens(response.accessToken, response.refreshToken);
  return normalizeUser(response.user);
};

export const register = async (data: RegisterInput) => {
  const response = await registerUser(data);
  await saveTokens(response.accessToken, response.refreshToken);
  return normalizeUser(response.user);
};

export const restoreSession = async () => {
  if (!await getAccessToken()) return null;
  try {
    return normalizeUser(await getMe());
  } catch {
    await clearTokens();
    return null;
  }
};

export const logout = async () => {
  try {
    await logoutUser();
  } finally {
    await clearTokens();
  }
};

export const requestPasswordReset = (email: string) => forgotPassword(email);

export const changePassword = (
  token: string,
  password: string,
  confirmPassword: string,
) => resetPassword(token, password, confirmPassword);
