import type {
  LoginRequest,
  LoginResponse,
} from "./auth.js";

const API_BASE_URL =
 "http://localhost:4000";
 //  import.meta.env.VITE_API_BASE_URL ||

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};