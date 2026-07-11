import { changePassword, login, logout, register, requestPasswordReset, updateProfileInfo } from "../services/auth.service";
import { authFailed, authStarted, authSucceeded, signedOut } from "../store/auth.slice";
import type { LoginInput, RegisterInput } from "../types/auth.type";
import { getApiErrorMessage } from "../../../services/api";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const runAuth = async (action: () => ReturnType<typeof login>) => {
    dispatch(authStarted());
    try {
      const user = await action();
      dispatch(authSucceeded(user));
      return user;
    } catch (error) {
      const message = getApiErrorMessage(error);
      dispatch(authFailed(message));
      throw new Error(message);
    }
  };

  const handleLogin = (data: LoginInput) => runAuth(() => login(data));
  const handleRegister = (data: RegisterInput) => runAuth(() => register(data));
  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      dispatch(signedOut());
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      return await requestPasswordReset(email);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  };

  const handleResetPassword = async (token: string, password: string, confirmPassword: string) => {
    try {
      return await changePassword(token, password, confirmPassword);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  };

  const handleUpdateProfile = async (data: { name: string; email: string; avatar?: string }) => {
    dispatch(authStarted());
    try {
      const user = await updateProfileInfo(data);
      dispatch(authSucceeded(user));
      return user;
    } catch (error) {
      const message = getApiErrorMessage(error);
      dispatch(authFailed(message));
      throw new Error(message);
    }
  };

  return {
    ...auth,
    handleLogin,
    handleRegister,
    handleLogout,
    handleForgotPassword,
    handleResetPassword,
    handleUpdateProfile,
  };
};
