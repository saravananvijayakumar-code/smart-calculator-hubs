import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import type { User } from "./types";

export const getOrCreate = api(
  { method: "GET", path: "/user/me", expose: true, auth: true },
  async (): Promise<User> => {
    const authData = getAuthData()!;

    let user = await db.queryRow<User>`
      SELECT * FROM users WHERE clerk_user_id = ${authData.userID}
    `;

    if (!user) {
      user = await db.queryRow<User>`
        INSERT INTO users (clerk_user_id, email, image_url, is_admin)
        VALUES (${authData.userID}, ${authData.email}, ${authData.imageUrl}, ${authData.isAdmin})
        RETURNING *
      `;
    }

    if (!user) {
      throw new Error("Failed to get or create user");
    }

    return {
      ...user,
      preferences: user.preferences ? JSON.parse(user.preferences as any) : undefined,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  }
);
