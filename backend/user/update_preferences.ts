import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import type { UpdatePreferencesRequest, User } from "./types";

export const updatePreferences = api(
  { method: "PUT", path: "/user/preferences", expose: true, auth: true },
  async (req: UpdatePreferencesRequest): Promise<User> => {
    const authData = getAuthData()!;

    const preferences = JSON.stringify(req.preferences);

    const user = await db.queryRow<User>`
      UPDATE users
      SET preferences = ${preferences}, updated_at = NOW()
      WHERE clerk_user_id = ${authData.userID}
      RETURNING *
    `;

    if (!user) {
      throw APIError.notFound("user not found");
    }

    return {
      ...user,
      preferences: user.preferences ? JSON.parse(user.preferences as any) : undefined,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  }
);
