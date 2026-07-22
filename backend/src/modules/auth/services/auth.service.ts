import { verifyGoogleToken } from "../providers/google.provider.js";
import { jwtProvider } from "../providers/jwt.providers.js";

import { userService } from "../users/user.service.js";

import { sessionRepository } from "../repositories/session.repository.js";

export default class AuthService {
  async googleLogin(credential: string, deviceId: string) {
    // Verify Google Account
    const googleUser = await verifyGoogleToken(credential);

    // Only one owner allowed
    const owner = await userService.getUserByGoogleId(googleUser.googleId);

    let user = owner;

    if (!user) {
      user = await userService.createUser({
        googleId: googleUser.googleId,
        email: googleUser.email,
        profilePicture: googleUser.picture,
        deviceId,
      });
    }

    // One active device
    await sessionRepository.deleteByUserId(user._id.toString());

    const payload = {
      userId: user._id.toString(),
      deviceId,
      role: user.role,
    };

    const accessToken = jwtProvider.generateAccessToken(payload);

    const refreshToken = jwtProvider.generateRefreshToken(payload);

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 30);

    await sessionRepository.create({
      userId: user._id,
      deviceId,
      refreshToken,
      expiresAt,
    });

    await userService.updateLastLogin(user._id.toString());
    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    // 1. Verify refresh token
    const payload = jwtProvider.verifyRefreshToken(refreshToken);

    // 2. Find active session
    const session = await sessionRepository.findByRefreshToken(refreshToken);

    if (!session) {
      throw new Error("Session expired.");
    }

    // 3. Generate new access token
    const accessToken = jwtProvider.generateAccessToken({
      userId: payload.userId,
      deviceId: payload.deviceId,
      role: payload.role,
    });

    return {
      accessToken,
    };
  }

  async logout(refreshToken: string) {
    await sessionRepository.revoke(refreshToken);

    return true;
  }

  async me(userId: string) {
    return userService.getUserById(userId);
  }
}

export const authService = new AuthService();
