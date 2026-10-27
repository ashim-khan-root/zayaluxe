import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

/**
 * Medusa v2 configuration.
 *
 * Kept at the shape proven by the official starter until the stack is installed and
 * verified (Phase 1, task 1.7). Production wiring for Redis cache/event-bus/workflow/
 * locking, R2 file storage, and the COD payment provider is documented below and must
 * be enabled with the real package names + options confirmed against the pinned
 * v2.22 docs — not guessed.
 *
 * architecture.md §2, §5; rules.md §1 (Medusa section).
 */
module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },

  // ── Production modules (enable in Phase 1, task 1.7) ──────────────────────────
  // modules: [
  //   { resolve: "@medusajs/medusa/cache-redis", options: { redisUrl: process.env.REDIS_URL } },
  //   { resolve: "@medusajs/medusa/event-bus-redis", options: { redisUrl: process.env.REDIS_URL } },
  //   {
  //     resolve: "@medusajs/medusa/workflow-engine-redis",
  //     options: { redis: { url: process.env.REDIS_URL } },
  //   },
  //   {
  //     resolve: "@medusajs/medusa/locking",
  //     options: {
  //       providers: [
  //         {
  //           resolve: "@medusajs/medusa/locking-redis",
  //           id: "locking-redis",
  //           is_default: true,
  //           options: { redisUrl: process.env.REDIS_URL },
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     resolve: "@medusajs/medusa/file",
  //     options: {
  //       providers: [
  //         {
  //           resolve: "@medusajs/medusa/file-s3",
  //           id: "file-s3",
  //           options: {
  //             file_url: process.env.S3_FILE_URL,
  //             bucket: process.env.S3_BUCKET,
  //             region: process.env.S3_REGION,
  //             endpoint: process.env.S3_ENDPOINT,
  //             access_key_id: process.env.S3_ACCESS_KEY_ID,
  //             secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
  //           },
  //         },
  //       ],
  //     },
  //   },
  //
  //   // Qatar COD — custom provider, one order lifecycle (ADR-014, payments.md)
  //   { resolve: "./src/modules/cod-payment" },
  // ],
})
