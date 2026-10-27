/**
 * Shared Tailwind brand preset — imported by apps/storefront and any future surface.
 *
 * Tailwind 4 configures through CSS (`@theme` in styles/globals.css). This file exists for
 * consumers that still need a JS preset (email templates, admin widgets) and as the single
 * place the palette is referenced outside CSS.
 *
 * Source of truth: design.md §2. Decorative gold is not a text colour (2.4:1).
 */
export const brandColors = {
  ink: "#14110F",
  inkSoft: "#3A342E",
  muted: "#5C554C",
  ivory: "#F7F3EC",
  sand: "#E6DCCB",
  line: "#D8CDBC",
  gold: "#B08D57", // decorative only
  goldText: "#7A5A2E",
  clay: "#9A5B45",
  success: "#2F6B4F",
  error: "#A33A2B",
  white: "#FFFFFF",
} as const

export const brandSpacing = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128] as const

export const brandFonts = {
  displayLatin: "Cormorant Garamond",
  displayArabic: "Noto Naskh Arabic",
  bodyLatin: "Inter",
  bodyArabic: "IBM Plex Sans Arabic",
} as const

export const brandPreset = {
  theme: {
    extend: {
      colors: brandColors,
      fontFamily: {
        display: [brandFonts.displayLatin, brandFonts.displayArabic, "Georgia", "serif"],
        body: [brandFonts.bodyLatin, brandFonts.bodyArabic, "system-ui", "sans-serif"],
      },
      borderRadius: { none: "0", input: "2px" },
      boxShadow: { modal: "0 24px 64px rgba(20,17,15,0.18)" },
      transitionDuration: { hover: "150ms", panel: "250ms" },
    },
  },
} as const

export default brandPreset
