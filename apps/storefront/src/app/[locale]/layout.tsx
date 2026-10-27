import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  IBM_Plex_Sans_Arabic,
  Inter,
  Noto_Naskh_Arabic,
  Cormorant_Garamond,
} from "next/font/google"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { localeDirection, routing } from "@/i18n/routing"
import "@/styles/globals.css"

/**
 * Latin + Arabic pairing from design.md §3. Subset and preload only the weights the
 * layout actually uses — fonts are a performance budget item (rules.md §8).
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display-latin",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body-latin",
  display: "swap",
})

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["500", "600"],
  variable: "--font-display-arabic",
  display: "swap",
})

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500"],
  variable: "--font-body-arabic",
  display: "swap",
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  const t = await getTranslations({ locale, namespace: "meta" })

  return {
    title: { default: t("title"), template: `%s · ${t("brand")}` },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { "en-QA": "/en", "ar-QA": "/ar" },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale)

  return (
    <html
      lang={locale}
      dir={localeDirection[locale as keyof typeof localeDirection]}
      className={`${cormorant.variable} ${inter.variable} ${notoNaskh.variable} ${plexArabic.variable}`}
    >
      <body className="bg-ivory text-ink antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
