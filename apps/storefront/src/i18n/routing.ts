import { defineRouting } from "next-intl/routing"

/**
 * Locale is a URL segment and always present: /en/... and /ar/... (architecture.md §8).
 * Locale and market are independent — Qatar is the only active market at launch.
 */
export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
})

export type Locale = (typeof routing.locales)[number]
export type Direction = "ltr" | "rtl"

export const localeDirection: Record<Locale, Direction> = {
  en: "ltr",
  ar: "rtl",
}
