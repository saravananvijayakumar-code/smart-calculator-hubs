import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
}

const adminUsername = secret("ADMIN_USER");
const adminPassword = secret("ADMIN_PASS");

export const login = api(
  { method: "POST", path: "/auth/admin/login", expose: true, auth: false },
  async (req: LoginRequest): Promise<LoginResponse> => {
    const validUsername = adminUsername();
    const validPassword = adminPassword();

    if (!validUsername || !validPassword) {
      return { success: false };
    }

    if (req.username === validUsername && req.password === validPassword) {
      const token = Buffer.from(`${validUsername}:${validPassword}`).toString("base64");
      return { success: true, token };
    }

    return { success: false };
  }
);
