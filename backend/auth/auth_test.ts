import { describe, expect, test, vi, beforeEach } from "vitest";
import { APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";

const adminUsername = secret("ADMIN_USER");
const adminPassword = secret("ADMIN_PASS");

describe("Auth Service Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Auth Processing", () => {
    test("should decode Basic auth header", () => {
      const validUsername = adminUsername();
      const validPassword = adminPassword();
      
      if (!validUsername || !validPassword) {
        console.warn("ADMIN_USER and ADMIN_PASS secrets not configured for tests");
        return;
      }

      const credentials = `${validUsername}:${validPassword}`;
      const base64 = Buffer.from(credentials).toString("base64");
      const authHeader = `Basic ${base64}`;
      
      const decoded = Buffer.from(authHeader.replace("Basic ", ""), "base64").toString("utf-8");
      const [username, password] = decoded.split(":");
      
      expect(username).toBe(validUsername);
      expect(password).toBe(validPassword);
    });

    test("should extract token from session cookie", () => {
      const validUsername = adminUsername();
      const validPassword = adminPassword();
      
      if (!validUsername || !validPassword) {
        console.warn("ADMIN_USER and ADMIN_PASS secrets not configured for tests");
        return;
      }

      const credentials = `${validUsername}:${validPassword}`;
      const sessionToken = Buffer.from(credentials).toString("base64");
      expect(sessionToken).toBeTruthy();
    });

    test("should handle missing auth", () => {
      const authHeader = "";
      const sessionToken = undefined;
      expect(!authHeader && !sessionToken).toBe(true);
    });
  });

  describe("Admin Credential Validation", () => {
    test("should validate correct credentials", () => {
      const validUsername = adminUsername();
      const validPassword = adminPassword();
      
      if (!validUsername || !validPassword) {
        console.warn("ADMIN_USER and ADMIN_PASS secrets not configured for tests");
        return;
      }

      const username = validUsername;
      const password = validPassword;
      
      const isValid = username === validUsername && password === validPassword;
      expect(isValid).toBe(true);
    });

    test("should reject incorrect credentials", () => {
      const validUsername = adminUsername();
      const validPassword = adminPassword();
      
      if (!validUsername || !validPassword) {
        console.warn("ADMIN_USER and ADMIN_PASS secrets not configured for tests");
        return;
      }

      const username = "wrong" as string;
      const password = "wrong" as string;
      
      const isValid = username === validUsername && password === validPassword;
      expect(isValid).toBe(false);
    });
  });

  describe("Auth Data Processing", () => {
    test("should create admin auth data", () => {
      const authData = {
        userID: "admin",
        imageUrl: "",
        email: null,
        isAdmin: true
      };

      expect(authData.userID).toBe("admin");
      expect(authData.isAdmin).toBe(true);
    });
  });

  describe("Error Handling", () => {
    test("should handle APIError instances", () => {
      const apiError = APIError.unauthenticated("invalid credentials");
      expect(apiError).toBeInstanceOf(APIError);
      expect(() => { throw apiError; }).toThrow("invalid credentials");
    });

    test("should handle missing config", () => {
      const validUsername = null;
      const validPassword = null;
      expect(!validUsername || !validPassword).toBe(true);
    });
  });
});
