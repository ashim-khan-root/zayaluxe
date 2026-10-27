import { describe, expect, it } from "vitest"
import {
  type CategorySchema,
  attributeDefinitionSchema,
  toSearchFacets,
  validateProductAttributes,
} from "./catalog"

const apparel: CategorySchema = {
  categoryId: "cat_apparel",
  attributes: [
    attributeDefinitionSchema.parse({
      key: "fabric",
      label: { en: "Fabric", ar: "القماش" },
      type: "text",
      filterable: true,
      required: true,
      displayOrder: 1,
    }),
    attributeDefinitionSchema.parse({
      key: "fit",
      label: { en: "Fit", ar: "القَصّة" },
      type: "enum",
      filterable: true,
      required: false,
      displayOrder: 2,
      options: [
        { value: "relaxed", label: { en: "Relaxed", ar: "واسع" } },
        { value: "tailored", label: { en: "Tailored", ar: "مُفصّل" } },
      ],
    }),
    attributeDefinitionSchema.parse({
      key: "care",
      label: { en: "Care", ar: "العناية" },
      type: "text",
      filterable: false,
      required: false,
      displayOrder: 3,
    }),
  ],
}

describe("attributeDefinitionSchema", () => {
  it("rejects an enum without options", () => {
    const result = attributeDefinitionSchema.safeParse({
      key: "finish",
      label: { en: "Finish", ar: "اللمسة" },
      type: "enum",
      filterable: false,
      required: false,
      displayOrder: 1,
    })
    expect(result.success).toBe(false)
  })

  it("rejects a measurement without a unit", () => {
    const result = attributeDefinitionSchema.safeParse({
      key: "volume",
      label: { en: "Volume", ar: "الحجم" },
      type: "measurement",
      filterable: true,
      required: true,
      displayOrder: 1,
    })
    expect(result.success).toBe(false)
  })

  it("rejects non snake_case keys", () => {
    const result = attributeDefinitionSchema.safeParse({
      key: "Skin Type",
      label: { en: "Skin type", ar: "نوع البشرة" },
      type: "text",
      filterable: false,
      required: false,
      displayOrder: 1,
    })
    expect(result.success).toBe(false)
  })
})

describe("validateProductAttributes", () => {
  it("accepts a complete valid product", () => {
    expect(
      validateProductAttributes(apparel, { fabric: "weighted linen", fit: "relaxed" })
    ).toEqual([])
  })

  it("flags a missing required attribute", () => {
    const issues = validateProductAttributes(apparel, { fit: "relaxed" })
    expect(issues).toContainEqual({ key: "fabric", message: "required attribute is missing" })
  })

  it("flags values not defined on the category", () => {
    const issues = validateProductAttributes(apparel, {
      fabric: "silk",
      skin_type: "oily",
    })
    expect(issues).toContainEqual({
      key: "skin_type",
      message: '"skin_type" is not defined on this category',
    })
  })

  it("flags an enum value outside the option set", () => {
    const issues = validateProductAttributes(apparel, { fabric: "silk", fit: "oversized" })
    expect(issues).toContainEqual({
      key: "fit",
      message: "expected one of: relaxed, tailored",
    })
  })

  it("flags a wrong primitive type", () => {
    const issues = validateProductAttributes(apparel, { fabric: 42 })
    expect(issues).toContainEqual({ key: "fabric", message: "expected non-empty text" })
  })
})

describe("toSearchFacets", () => {
  it("keeps only filterable attributes", () => {
    const facets = toSearchFacets(apparel, {
      fabric: "weighted linen",
      care: "dry clean only",
      fit: "tailored",
    })
    expect(facets).toEqual({ fabric: "weighted linen", fit: "tailored" })
  })

  it("omits unset filterable attributes", () => {
    expect(toSearchFacets(apparel, { fabric: "silk" })).toEqual({ fabric: "silk" })
  })
})
