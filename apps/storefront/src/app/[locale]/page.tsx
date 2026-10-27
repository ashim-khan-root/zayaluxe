import { getTranslations, setRequestLocale } from "next-intl/server"

/**
 * Scaffold home. This is the project shell, not a launch page: it states the build
 * state honestly so nobody mistakes a skeleton for a storefront.
 *
 * Real home content (hero, category entry, The Edit, lookbook, trust bar) is Phase 4,
 * task 4.1 and requires client photography + approved brand assets (design.md §11).
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("home")

  return (
    <main className="mx-auto flex min-h-dvh max-w-[1440px] flex-col justify-center px-5 py-24 sm:px-10 lg:px-16">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{t("eyebrow")}</p>

      <h1 className="mt-6 font-display text-[2.5rem] leading-[1.05] text-balance sm:text-6xl lg:text-7xl">
        {t("title")}
      </h1>

      <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink-soft">
        {t("body")}
      </p>

      <dl className="mt-12 grid max-w-2xl grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        <div className="bg-ivory p-5">
          <dt className="text-xs uppercase tracking-[0.15em] text-muted">{t("marketLabel")}</dt>
          <dd className="mt-2 text-sm font-medium">{t("marketValue")}</dd>
        </div>
        <div className="bg-ivory p-5">
          <dt className="text-xs uppercase tracking-[0.15em] text-muted">{t("stackLabel")}</dt>
          <dd className="mt-2 text-sm font-medium">{t("stackValue")}</dd>
        </div>
        <div className="bg-ivory p-5">
          <dt className="text-xs uppercase tracking-[0.15em] text-muted">{t("phaseLabel")}</dt>
          <dd className="mt-2 text-sm font-medium">{t("phaseValue")}</dd>
        </div>
      </dl>

      <p className="mt-10 border-s-2 border-gold ps-4 text-sm text-muted">{t("note")}</p>
    </main>
  )
}
