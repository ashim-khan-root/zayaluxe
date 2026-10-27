/**
 * Money — integer minor units only. Never floats (rules.md §6).
 *
 * Qatar: QAR, 2 decimals, tax-inclusive display. The money layer stays currency-agnostic
 * so a future market adds a price set rather than a code path (architecture.md §6.2).
 */

export type CurrencyCode = "QAR" | (string & {})

export type Money = {
  /** Integer minor units — 12345 === QAR 123.45 */
  amount: number
  currency: CurrencyCode
}

const MINOR_UNIT_DIGITS: Record<string, number> = { QAR: 2 }

export function minorUnitDigits(currency: CurrencyCode): number {
  const digits = MINOR_UNIT_DIGITS[currency.toUpperCase()]
  if (digits === undefined) {
    throw new Error(
      `Unknown currency "${currency}". Add its minor-unit digits before accepting it — ` +
        "guessing rounding for money is how you lose a fils per order."
    )
  }
  return digits
}

/** Guard against non-integer amounts reaching display or storage. */
export function assertIntegerMinorUnits(amount: number): void {
  if (!Number.isInteger(amount)) {
    throw new Error(`Money must be integer minor units, received ${amount}`)
  }
}

/**
 * Format for display: `QAR 1,234.00` in English, `١٬٢٣٤٫٠٠ ر.ق` in Arabic when the brand
 * chooses Arabic-Indic numerals. Locale-aware via Intl — never hand-concatenated.
 */
export function formatMoney(
  money: Money,
  locale: string,
  options: { numberingSystem?: "latn" | "arab" } = {}
): string {
  assertIntegerMinorUnits(money.amount)

  const digits = minorUnitDigits(money.currency)
  const formatter = new Intl.NumberFormat(
    options.numberingSystem === "arab" ? `${locale}-u-nu-arab` : locale,
    {
      style: "currency",
      currency: money.currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }
  )

  return formatter.format(money.amount / 10 ** digits)
}

/** Convert a human-entered price to minor units, rejecting rounding surprises. */
export function toMinorUnits(major: number, currency: CurrencyCode): number {
  const digits = minorUnitDigits(currency)
  const scaled = major * 10 ** digits
  if (!Number.isInteger(scaled)) {
    throw new Error(`${major} ${currency} has more precision than ${digits} decimals`)
  }
  return scaled
}

export const ZERO_QAR: Money = { amount: 0, currency: "QAR" }
