import { Header, Cookie, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";
import { logger } from "../shared/logger";

interface AuthParams {
  authorization?: Header<"Authorization">;
  session?: Cookie<"session">;
}

export interface AuthData {
  userID: string;
  imageUrl: string;
  email: string | null;
  isAdmin: boolean;
}

const adminUsername = secret("ADMIN_USER");
const adminPassword = secret("ADMIN_PASS");

export const auth = authHandler<AuthParams, AuthData>(
  async (data) => {
    const authHeader = data.authorization || "";
    const sessionToken = data.session?.value;
    
    // If Basic auth is provided, validate it
    if (authHeader.startsWith("Basic ")) {
      const base64Credentials = authHeader.replace("Basic ", "");
      const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
      const [username, password] = credentials.split(":");

      const validUsername = adminUsername();
      const validPassword = adminPassword();

      if (!validUsername || !validPassword) {
        logger.error("Admin credentials not configured", {
          service: "auth"
        });
        throw APIError.internal("authentication service not configured");
      }

      if (username === validUsername && password === validPassword) {
        return {
          userID: "admin",
          imageUrl: "",
          email: null,
          isAdmin: true
        };
      }

      throw APIError.unauthenticated("invalid credentials");
    }

    // If session cookie is provided, validate it
    if (sessionToken) {
      const validUsername = adminUsername();
      const validPassword = adminPassword();

      if (!validUsername || !validPassword) {
        throw APIError.internal("authentication service not configured");
      }

      const expectedToken = Buffer.from(`${validUsername}:${validPassword}`).toString("base64");
      
      if (sessionToken === expectedToken) {
        return {
          userID: "admin",
          imageUrl: "",
          email: null,
          isAdmin: true
        };
      }

      throw APIError.unauthenticated("invalid session");
    }

    // No auth provided - this will cause endpoints with auth: true to fail
    throw APIError.unauthenticated("authentication required");
  }
);

export const gw = new Gateway({ authHandler: auth });
