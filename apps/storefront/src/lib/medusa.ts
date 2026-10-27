import "server-only"

import Medusa from "@medusajs/js-sdk"

/**
 * Server-side Medusa Store API client.
 *
 * Server calls prefer the internal Docker network URL; the publishable key is the only
 * credential that ever reaches the browser (architecture.md §7.1, §9).
 */
export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  debug: process.env.NODE_ENV === "development",
})

/** Qatar is the only active region at launch (ADR-009). */
export const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION ?? "qa"

export const CART_COOKIE = "zayaluxe_cart_id"
