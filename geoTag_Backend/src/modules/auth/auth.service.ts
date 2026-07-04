import bcrypt from "bcrypt";
import { UserModel } from "../../models/user.model.js";
import type { LoginUser, RegisterUser } from "./auth.types.js";
import { genrateAccessToken, genrateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import type { JwtPayload } from "../../types/user.types.js";

export const LoginService = async (data:LoginUser) => {
    const existingUser = await UserModel.findOne({ email: data.email });
    if (!existingUser) {
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(data.password, existingUser.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    const payload:JwtPayload = {
        id: existingUser._id.toString(),
        email: existingUser.email,
    };

    const accessToken = genrateAccessToken(payload);
    const refreshToken = genrateRefreshToken(payload);

    return { accessToken, refreshToken, existingUser};
}

export const RegisterService = async (data: RegisterUser) => {
    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = new UserModel({
        name: data.name,
        email: data.email,
        password: hashedPassword,
    });

    await newUser.save();

    const payload: JwtPayload = {
        id: newUser._id.toString(),
        email: newUser.email,
    };

    const accessToken = genrateAccessToken(payload);
    const refreshToken = genrateRefreshToken(payload);

    return { accessToken, refreshToken, newUser };
}



export const RefreshTokenService = async (refreshToken: string) => {
    try {
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded || !decoded.id) {
            throw new Error("Invalid refresh token");
        }
        const existingUser = await UserModel.findById(decoded.id);
        if (!existingUser) {
            throw new Error("User not found");
        }

        const payload: JwtPayload = {
            id: existingUser._id.toString(),
            email: existingUser.email,
        };

        const newAccessToken = genrateAccessToken(payload);
        const newRefreshToken = genrateRefreshToken(payload);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
        throw new Error("Invalid refresh token");
    }
}
