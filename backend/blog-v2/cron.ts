import { CronJob } from "encore.dev/cron";
import { api } from "encore.dev/api";
import db from "../db";
import log from "encore.dev/log";
import { generateBlogInternal } from "./generate_internal";

export const processBlogGeneration = api(
  { expose: false },
  async (): Promise<void> => {
    await generateBlogInternal();
  }
);

export const dailyBlogGeneration = new CronJob("daily-blog-generation", {
  title: "Blog Generation Every 24 Hours",
  schedule: "0 0 * * *",
  endpoint: processBlogGeneration,
});
