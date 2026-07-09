export interface GoogleUser {
  googleId: string;
  email: string;
  picture?: string;
}

export interface GoogleLoginRequest {
  idToken: string;
  deviceId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
}
