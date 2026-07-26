import { verifyGoogleToken } from "../providers/google.provider.js";
import { jwtProvider } from "../providers/jwt.providers.js";

import UserService from "../../user/services/user.service.js";

import { sessionRepository } from "../repositories/session.repository.js";

export default class AuthService {
  async googleLogin(credential: string, deviceId: string) {
    /* -------------------------------------------------------------------------- */
    /*                           Verify Google Account                            */
    /* -------------------------------------------------------------------------- */

    const googleUser = await verifyGoogleToken(credential);

    /* -------------------------------------------------------------------------- */
    /*                           Find / Create Owner                              */
    /* -------------------------------------------------------------------------- */

    let user = await UserService.getUserByGoogleId(googleUser.googleId);

    if (!user) {
      user = await UserService.createUser({
        googleId: googleUser.googleId,
        email: googleUser.email,
        profilePicture: googleUser.picture,
        deviceId,
      });
    }

    /* -------------------------------------------------------------------------- */
    /*                            Single Active Session                           */
    /* -------------------------------------------------------------------------- */

    await sessionRepository.deleteByUserId(user._id.toString());

    /* -------------------------------------------------------------------------- */
    /*                              Generate Tokens                               */
    /* -------------------------------------------------------------------------- */

    const payload = {
      userId: user._id.toString(),
      deviceId,
      role: user.role,
    };

    const accessToken = jwtProvider.generateAccessToken(payload);

    const refreshToken = jwtProvider.generateRefreshToken(payload);

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 30);

    /* -------------------------------------------------------------------------- */
    /*                              Save Session                                  */
    /* -------------------------------------------------------------------------- */

    await sessionRepository.create({
      userId: user._id,
      deviceId,
      refreshToken,
      expiresAt,
    });

    /* -------------------------------------------------------------------------- */
    /*                           Update Last Login                                */
    /* -------------------------------------------------------------------------- */

    await UserService.updateLastLogin(user._id.toString());

    /* -------------------------------------------------------------------------- */
    /*                                Response                                    */
    /* -------------------------------------------------------------------------- */

    return {
      user: {
        id: user._id.toString(),

        email: user.email,

        role: user.role,

        business: user.business ?? null,

        profilePicture: user.profilePicture,

        onboardingCompleted: user.onboardingCompleted,

        appLockEnabled: user.appLockEnabled,

        isActive: user.isActive,
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
    return UserService.getUserById(userId);
  }

  /* -------------------------------------------------------------------------- */
  /*                     Complete Onboarding                                    */
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
