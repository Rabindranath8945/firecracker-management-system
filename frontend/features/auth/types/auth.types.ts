export interface User {
  id: string;
  email: string;
  profilePicture?: string;
  role: string;
  appLockEnabled: boolean;
}

export interface GoogleLoginRequest {
  credential: string;
  deviceId: string;
}

export interface AuthState {
  user: User | null;

  accessToken: string | null;

  refreshToken: string | null;

  isAuthenticated: boolean;

  isLoading: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
