import { describe, expect, it } from "vitest"
import { assertIntegerMinorUnits, formatMoney, minorUnitDigits, toMinorUnits } from "./money"

describe("minorUnitDigits", () => {
  it("knows QAR has 2 decimals", () => {
    expect(minorUnitDigits("QAR")).toBe(2)
  })

  it("throws for an unknown currency instead of guessing", () => {
    expect(() => minorUnitDigits("XYZ")).toThrow(/Unknown currency/)
  })
})

describe("assertIntegerMinorUnits", () => {
  it("rejects floats", () => {
    expect(() => assertIntegerMinorUnits(12.5)).toThrow(/integer minor units/)
  })

  it("accepts integers", () => {
    expect(() => assertIntegerMinorUnits(1250)).not.toThrow()
  })
})

describe("formatMoney", () => {
  it("formats QAR for English without a fixed symbol guess", () => {
    const out = formatMoney({ amount: 123450, currency: "QAR" }, "en-QA")
    expect(out).toContain("1,234.50")
    expect(out).toMatch(/QAR|ر\.ق/)
  })

  it("uses Arabic-Indic numerals when asked", () => {
    const out = formatMoney({ amount: 123450, currency: "QAR" }, "ar-QA", {
      numberingSystem: "arab",
    })
    expect(out).toMatch(/[٠-٩]/)
  })

  it("rejects a float amount", () => {
    expect(() => formatMoney({ amount: 10.5, currency: "QAR" }, "en-QA")).toThrow()
  })
})

describe("toMinorUnits", () => {
  it("converts 123.45 QAR to 12345 fils", () => {
    expect(toMinorUnits(123.45, "QAR")).toBe(12345)
  })

  it("rejects more precision than the currency holds", () => {
    expect(() => toMinorUnits(1.005, "QAR")).toThrow(/precision/)
  })
})
