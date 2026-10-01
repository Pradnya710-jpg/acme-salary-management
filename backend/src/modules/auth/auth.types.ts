export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  role: string;
}