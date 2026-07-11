import bcrypt from "bcrypt";
import { createHash, randomBytes } from "node:crypto";
import { UserModel } from "../../models/user.model.js";
import type { ForgotPasswordInput, LoginUser, RegisterUser, ResetPasswordInput } from "./auth.types.js";
import { genrateAccessToken, genrateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import type { JwtPayload } from "../../types/user.types.js";

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

const publicUser = (user: any) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar ?? "",
});

const issueTokens = (payload: JwtPayload) => {
  const accessToken = genrateAccessToken(payload);
  const refreshToken = genrateRefreshToken(payload);
  return { accessToken, refreshToken, refreshTokenHash: hashToken(refreshToken) };
};

export const LoginService = async (data: LoginUser) => {
  const existingUser = await UserModel.findOne({ email: data.email }).select("+password");
  if (!existingUser || !(await bcrypt.compare(data.password, existingUser.password))) {
    throw new Error("Invalid credentials");
  }

  const payload = { id: existingUser._id.toString(), email: existingUser.email };
  const { accessToken, refreshToken, refreshTokenHash } = issueTokens(payload);
  await UserModel.findByIdAndUpdate(existingUser._id, { refreshTokenHash });

  return { accessToken, refreshToken, user: publicUser(existingUser) };
};

export const RegisterService = async (data: RegisterUser) => {
  if (await UserModel.exists({ email: data.email })) {
    throw new Error("User already exists");
  }

  const newUser = await UserModel.create({
    name: data.name,
    email: data.email,
    password: await bcrypt.hash(data.password, 12),
  });

  const payload = { id: newUser._id.toString(), email: newUser.email };
  const { accessToken, refreshToken, refreshTokenHash } = issueTokens(payload);
  await UserModel.findByIdAndUpdate(newUser._id, { refreshTokenHash });

  return { accessToken, refreshToken, user: publicUser(newUser) };
};

export const GetmeService = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");
  return user;
};

export const RefreshTokenService = async (refreshToken: string) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const currentHash = hashToken(refreshToken);
    const existingUser = await UserModel.findOne({
      _id: decoded.id,
      refreshTokenHash: currentHash,
    }).select("+refreshTokenHash");

    if (!existingUser) throw new Error("Invalid refresh token");

    const payload = { id: existingUser._id.toString(), email: existingUser.email };
    const tokens = issueTokens(payload);
    const rotated = await UserModel.findOneAndUpdate(
      { _id: existingUser._id, refreshTokenHash: currentHash },
      { refreshTokenHash: tokens.refreshTokenHash },
    );
    if (!rotated) throw new Error("Invalid refresh token");

    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  } catch {
    throw new Error("Invalid refresh token");
  }
};

export const LogoutService = async (userId: string) => {
  await UserModel.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
  return { message: "User logged out successfully." };
};

export const ForgotPasswordService = async ({ email }: ForgotPasswordInput) => {
  const user = await UserModel.findOne({ email });
  if (!user) return null;

  const token = randomBytes(32).toString("hex");
  await UserModel.findByIdAndUpdate(user._id, {
    passwordResetTokenHash: hashToken(token),
    passwordResetExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });
  return token;
};

export const ResetPasswordService = async ({ token, password }: ResetPasswordInput) => {
  const user = await UserModel.findOne({
    passwordResetTokenHash: hashToken(token),
    passwordResetExpiresAt: { $gt: new Date() },
  }).select("+passwordResetTokenHash +passwordResetExpiresAt");
  if (!user) throw new Error("Invalid or expired reset token");

  user.password = await bcrypt.hash(password, 12);
  user.set("passwordResetTokenHash", undefined);
  user.set("passwordResetExpiresAt", undefined);
  user.set("refreshTokenHash", undefined);
  await user.save();
  return { message: "Password reset successfully." };
};

export const UpdateProfileService = async (userId: string, data: { name?: string; email?: string; avatar?: string }) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  if (data.name !== undefined) user.name = data.name;
  
  if (data.email !== undefined && data.email !== user.email) {
    if (await UserModel.exists({ email: data.email })) {
      throw new Error("Email already exists");
    }
    user.email = data.email;
  }

  if (data.avatar !== undefined) {
    user.set("avatar", data.avatar);
  }

  await user.save();
  return publicUser(user);
};
