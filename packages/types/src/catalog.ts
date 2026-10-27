import { z } from "zod"

/**
 * Category attribute sets — the contract behind "not limited to garments"
 * (architecture.md §5.2, prd.md CAT-01…CAT-06).
 *
 * A product is not "a garment with size/colour columns". It belongs to a category that
 * declares its attributes. Adding beauty, homeware, fragrance or kids is a content and
 * attribute exercise, not a schema migration.
 */

export const localeSchema = z.enum(["en", "ar"])
export type Locale = z.infer<typeof localeSchema>

/** Both locales are required. Arabic is written, not machine-translated (rules.md §7). */
export const localizedTextSchema = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
})
export type LocalizedText = z.infer<typeof localizedTextSchema>

export const attributeTypeSchema = z.enum(["text", "number", "enum", "boolean", "measurement"])
export type AttributeType = z.infer<typeof attributeTypeSchema>

export const attributeOptionSchema = z.object({
  /** Stable machine value — never translated, never shown. */
  value: z.string().min(1),
  label: localizedTextSchema,
})
export type AttributeOption = z.infer<typeof attributeOptionSchema>

export const attributeDefinitionSchema = z
  .object({
    /** snake_case: "fabric", "skin_type", "volume" */
    key: z
      .string()
      .min(1)
      .regex(/^[a-z][a-z0-9_]*$/, "attribute keys are snake_case"),
    label: localizedTextSchema,
    type: attributeTypeSchema,
    /** "ml" | "cm" | "g" — required when type is "measurement". */
    unit: z.string().min(1).optional(),
    /** Drives PLP facets and the Meilisearch filterable-attribute list. */
    filterable: z.boolean().default(false),
    required: z.boolean().default(false),
    displayOrder: z.number().int().nonnegative(),
    /** Required when type is "enum". */
    options: z.array(attributeOptionSchema).min(1).optional(),
  })
  .refine((a) => a.type !== "enum" || (a.options?.length ?? 0) > 0, {
    message: "enum attributes need at least one option",
    path: ["options"],
  })
  .refine((a) => a.type !== "measurement" || Boolean(a.unit), {
    message: "measurement attributes need a unit",
    path: ["unit"],
  })
export type AttributeDefinition = z.infer<typeof attributeDefinitionSchema>

export const categorySchemaSchema = z.object({
  categoryId: z.string().min(1),
  attributes: z.array(attributeDefinitionSchema),
  sizeGuideId: z.string().optional(),
  careTemplateId: z.string().optional(),
  shippingProfileId: z.string().optional(),
})
export type CategorySchema = z.infer<typeof categorySchemaSchema>

/**
 * Product attribute values, stored in `product.metadata.attributes` and validated against
 * the owning category's schema at write time (CAT-04).
 */
export const attributeValueSchema = z.union([z.string(), z.number(), z.boolean()])
export type AttributeValue = z.infer<typeof attributeValueSchema>

export const productAttributesSchema = z.record(z.string(), attributeValueSchema)
export type ProductAttributes = z.infer<typeof productAttributesSchema>

export type AttributeValidationIssue = {
  key: string
  message: string
}

/**
 * Validate a product's attribute values against its category schema.
 *
 * Returns issues rather than throwing so callers can surface them in the admin without a
 * 500, and so seed/import scripts can report every problem in one pass.
 */
export function validateProductAttributes(
  schema: CategorySchema,
  values: ProductAttributes
): AttributeValidationIssue[] {
  const issues: AttributeValidationIssue[] = []
  const defined = new Map(schema.attributes.map((a) => [a.key, a]))

  for (const [key] of Object.entries(values)) {
    if (!defined.has(key)) {
      issues.push({ key, message: `"${key}" is not defined on this category` })
    }
  }

  for (const attribute of schema.attributes) {
    const value = values[attribute.key]

    if (value === undefined) {
      if (attribute.required) {
        issues.push({ key: attribute.key, message: "required attribute is missing" })
      }
      continue
    }

    switch (attribute.type) {
      case "number":
      case "measurement":
        if (typeof value !== "number" || !Number.isFinite(value)) {
          issues.push({ key: attribute.key, message: "expected a finite number" })
        }
        break
      case "boolean":
        if (typeof value !== "boolean") {
          issues.push({ key: attribute.key, message: "expected true or false" })
        }
        break
      case "enum": {
        const allowed = new Set(attribute.options?.map((o) => o.value) ?? [])
        if (typeof value !== "string" || !allowed.has(value)) {
          issues.push({
            key: attribute.key,
            message: `expected one of: ${[...allowed].join(", ")}`,
          })
        }
        break
      }
      case "text":
        if (typeof value !== "string" || value.trim().length === 0) {
          issues.push({ key: attribute.key, message: "expected non-empty text" })
        }
        break
    }
  }

  return issues
}

/**
 * Flatten filterable attributes into the shape the Meilisearch document expects
 * (architecture.md §7.5). Facets come from search, never from a hardcoded list.
 */
export function toSearchFacets(
  schema: CategorySchema,
  values: ProductAttributes
): Record<string, AttributeValue> {
  const facets: Record<string, AttributeValue> = {}

  for (const attribute of schema.attributes) {
    if (!attribute.filterable) continue
    const value = values[attribute.key]
    if (value !== undefined) facets[attribute.key] = value
  }

  return facets
}
