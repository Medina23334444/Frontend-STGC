// types/auth.ts

// types/auth.ts
import { User } from './user';

export interface UserLogin {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;  // ← La respuesta del servidor incluye el usuario
}