import type { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
  defaultCurrencies,
} from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Qatar launch seed — region, tax, stock location, sales channel.
 *
 * Scope is deliberately narrow: this proves the Qatar market model (architecture.md §6)
 * without depending on a payment gateway that has not been chosen yet. Products arrive
 * in Phase 2.3 from real client content, not seed fixtures.
 *
 * Run: npm run db:seed
 *
 * NOTE: unverified until it has been executed against the installed backend at the
 * Phase 1 gate. If a core-flow signature differs in the pinned v2.22, fix here — do not
 * work around it in an API route (rules.md §1, Medusa section).
 */
export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("Seeding Qatar launch market (QA / QAR)…")

  // 1. Sales channel — only Qatar is active at launch (ADR-009).
  const { result: salesChannels } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [{ name: "Zaya Luxe Qatar", description: "Qatar storefront" }],
    },
  })
  const salesChannel = salesChannels[0]
  if (!salesChannel) throw new Error("Sales channel was not created")
  logger.info(`Sales channel: ${salesChannel.id}`)

  // 2. Doha warehouse — single stock location at launch (FUL-01).
  const { result: stockLocations } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        {
          name: "Doha Warehouse",
          // address_1 is required by StockLocationAddressInput. Qatar has no postal-code
          // system, so street + zone carry the location; replace with the real warehouse
          // address before launch (FUL-01).
          address: {
            address_1: "Street 24, Industrial Area",
            city: "Doha",
            country_code: "qa",
          },
        },
      ],
    },
  })
  const stockLocation = stockLocations[0]
  if (!stockLocation) throw new Error("Stock location was not created")
  logger.info(`Stock location: ${stockLocation.id}`)

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: stockLocation.id, add: [salesChannel.id] },
  })

  // 3. Tax region. Qatar has no general VAT at planning time — verify with the
  //    client's accountant before launch (memory.md Q9). Rates are config, never code
  //    (rules.md §6).
  const { result: taxRegions } = await createTaxRegionsWorkflow(container).run({
    input: [{ country_code: "qa", provider_id: "tp_system" }],
  })
  logger.info(`Tax region: ${taxRegions[0]?.id ?? "none"}`)

  // 4. Region: Qatar, QAR, tax-inclusive display. Providers are added in Phase 3 once
  //    the gateway module and COD provider exist.
  const { result: regions } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Qatar",
          currency_code: "qar",
          countries: ["qa"],
          payment_providers: ["pp_system_default"],
          is_tax_inclusive: true,
        },
      ],
    },
  })
  logger.info(`Region: ${regions[0]?.id ?? "none"} — Qatar / QAR`)

  // 5. Sanity checks on QAR. `CurrencyDTO` is only { code, symbol, symbol_native, name },
  //    so decimals come from the built-in currency table Medusa seeds the DB from, while
  //    retrieveCurrency proves the record actually landed in this store.
  const currencyModule = container.resolve(Modules.CURRENCY)
  const qar = await currencyModule.retrieveCurrency("qar")
  const qarDecimals = defaultCurrencies["qar"]?.decimal_digits
  if (qarDecimals !== 2) {
    throw new Error(`QAR must be a 2-decimal currency, got ${qarDecimals}`)
  }
  logger.info(`QAR: ${qar.code} ${qar.symbol} — ${qarDecimals} decimals (integer minor units)`)

  logger.info(`Seed complete. Product status enum sanity: ${ProductStatus.PUBLISHED}`)
}
