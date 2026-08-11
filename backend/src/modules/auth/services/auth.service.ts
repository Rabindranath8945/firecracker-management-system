import { verifyGoogleToken } from "../providers/google.provider.js";
import { jwtProvider } from "../providers/jwt.providers.js";

import UserService from "../../user/services/user.service.js";
import { sessionRepository } from "../repositories/session.repository.js";

export default class AuthService {
  /* -------------------------------------------------------------------------- */
  /*                              Google Login                                  */
  /* -------------------------------------------------------------------------- */

  async googleLogin(credential: string, deviceId: string) {
    const googleUser = await verifyGoogleToken(credential);

    let user = await UserService.getUserByGoogleId(googleUser.googleId);

    if (!user) {
      user = await UserService.createUser({
        googleId: googleUser.googleId,
        email: googleUser.email,
        profilePicture: googleUser.picture,
        deviceId,
      });
    }

    /* ---------------------------------------------------------------------- */
    /*                      Remove Previous Sessions                          */
    /* ---------------------------------------------------------------------- */

    await sessionRepository.deleteByUserId(user._id.toString());

    /* ---------------------------------------------------------------------- */
    /*                          Generate Tokens                              */
    /* ---------------------------------------------------------------------- */

    const payload = {
      userId: user._id.toString(),
      deviceId,
      role: user.role,
    };

    const accessToken = jwtProvider.generateAccessToken(payload);

    const refreshToken = jwtProvider.generateRefreshToken(payload);

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 30);

    /* ---------------------------------------------------------------------- */
    /*                           Save Session                                */
    /* ---------------------------------------------------------------------- */

    await sessionRepository.create({
      userId: user._id,
      deviceId,
      refreshToken,
      expiresAt,
      isActive: true,
    });

    await UserService.updateLastLogin(user._id.toString());

    return {
      user: {
        id: user._id.toString(),

        email: user.email,

        role: user.role,

        currentBusiness: user.currentBusiness ?? null,

        profilePicture: user.profilePicture,

        onboardingCompleted: user.onboardingCompleted,

        appLockEnabled: user.appLockEnabled,

        isActive: user.isActive,
      },

      accessToken,

      refreshToken,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                              Refresh Token                                 */
  /* -------------------------------------------------------------------------- */

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new Error("Refresh token missing.");
    }

    const payload = jwtProvider.verifyRefreshToken(refreshToken);

    const session = await sessionRepository.findByRefreshToken(refreshToken);

    if (!session) {
      throw new Error("Session expired.");
    }

    if (!session.isActive) {
      throw new Error("Session revoked.");
    }

    if (session.expiresAt < new Date()) {
      throw new Error("Session expired.");
    }

    const newPayload = {
      userId: payload.userId,
      deviceId: payload.deviceId,
      role: payload.role,
    };

    const accessToken = jwtProvider.generateAccessToken(newPayload);

    const newRefreshToken = jwtProvider.generateRefreshToken(newPayload);

    session.refreshToken = newRefreshToken;

    session.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await session.save();

    return {
      accessToken,

      refreshToken: newRefreshToken,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Logout                                     */
  /* -------------------------------------------------------------------------- */

  async logout(refreshToken: string) {
    if (!refreshToken) {
      return true;
    }

    await sessionRepository.revoke(refreshToken);

    return true;
  }

  /* -------------------------------------------------------------------------- */
  /*                                Current User                                */
  /* -------------------------------------------------------------------------- */

  async me(userId: string) {
    const user = await UserService.getUserById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    return {
      id: user._id.toString(),

      email: user.email,

      role: user.role,

      currentBusiness: user.currentBusiness ?? null,

      profilePicture: user.profilePicture,

      onboardingCompleted: user.onboardingCompleted,

      appLockEnabled: user.appLockEnabled,

      isActive: user.isActive,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                         Complete Onboarding                                */
  /* -------------------------------------------------------------------------- */

  async completeOnboarding(userId: string) {
    const user = await UserService.completeOnboarding(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  }
}

export const authService = new AuthService();
