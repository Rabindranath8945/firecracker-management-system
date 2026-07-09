import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../../../config/env.js";

export interface JwtPayload {
  userId: string;
  deviceId: string;
  role: string;
}

class JwtProvider {
  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(
      payload,
      env.ACCESS_TOKEN_SECRET as Secret,
      {
        expiresIn: env.ACCESS_TOKEN_EXPIRES,
      } as SignOptions,
    );
  }

  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(
      payload,
      env.REFRESH_TOKEN_SECRET as Secret,
      {
        expiresIn: env.REFRESH_TOKEN_EXPIRES,
      } as SignOptions,
    );
  }

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET as Secret) as JwtPayload;
  }

  verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET as Secret) as JwtPayload;
  }

  decode(token: string) {
    return jwt.decode(token);
  }
}

export const jwtProvider = new JwtProvider();
