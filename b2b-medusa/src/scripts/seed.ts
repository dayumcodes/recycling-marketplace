import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import { SELLER_MODULE } from "../modules/seller";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);
  const regionModuleService = container.resolve(Modules.REGION);
  const sellerModuleService = container.resolve(SELLER_MODULE);

  let shippingProfile: { id: string } | null = null;

  const countries = ["ae", "gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "aed",
          is_default: true,
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  const existingRegions = await regionModuleService.listRegions({});
  let region;
  if (existingRegions.length > 0) {
    logger.info("Regions already exist, skipping region/tax/stock/fulfillment/API-key creation.");
    region = existingRegions[0];
  } else {
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "UAE",
            currency_code: "aed",
            countries: ["ae"],
            payment_providers: ["pp_system_default"],
          },
          {
            name: "Europe",
            currency_code: "eur",
            countries: ["gb", "de", "dk", "se", "fr", "es", "it"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    region = regionResult[0];
    logger.info("Finished seeding regions.");

    logger.info("Seeding tax regions...");
    await createTaxRegionsWorkflow(container).run({
      input: countries.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    });
  }

  if (existingRegions.length === 0) {
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "UAE Warehouse",
          address: {
            city: "Dubai",
            country_code: "AE",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "UAE & Europe Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "UAE & Europe",
        geo_zones: [
          { country_code: "ae", type: "country" },
          { country_code: "gb", type: "country" },
          { country_code: "de", type: "country" },
          { country_code: "dk", type: "country" },
          { country_code: "se", type: "country" },
          { country_code: "fr", type: "country" },
          { country_code: "es", type: "country" },
          { country_code: "it", type: "country" },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "aed",
            amount: 40,
          },
          {
            region_id: region.id,
            amount: 40,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          {
            currency_code: "aed",
            amount: 80,
          },
          {
            region_id: region.id,
            amount: 80,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  let publishableApiKey: ApiKey | null = null;
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: {
      type: "publishable",
    },
  });

  publishableApiKey = data?.[0];

  if (!publishableApiKey) {
    const {
      result: [publishableApiKeyResult],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Webshop",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });

    publishableApiKey = publishableApiKeyResult as ApiKey;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");
  } // end if (existingRegions.length === 0) — infra block

  // Ensure we have a shipping profile for product seeding (required when regions already existed)
  if (!shippingProfile) {
    const existingProfiles = await fulfillmentModuleService.listShippingProfiles({
      type: "default",
    });
    if (existingProfiles.length > 0) {
      shippingProfile = existingProfiles[0];
    } else {
      const { result: shippingProfileResult } =
        await createShippingProfilesWorkflow(container).run({
          input: {
            data: [
              { name: "Default Shipping Profile", type: "default" },
            ],
          },
        });
      shippingProfile = shippingProfileResult[0];
    }
  }

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id"],
  });
  if (existingProducts.length > 0) {
    logger.info(
      `${existingProducts.length} products already exist. Skipping product/category/inventory seed. Run seed-sellers separately if needed.`
    );
    return;
  }

  logger.info("Seeding product data...");

  const categoryData = [
    { name: "Shirts", is_active: true },
    { name: "Sweatshirts", is_active: true },
    { name: "Pants", is_active: true },
    { name: "Merch", is_active: true },
    { name: "Paper", handle: "paper", is_active: true },
    { name: "Plastic", handle: "plastic", is_active: true },
    { name: "Aluminium", handle: "aluminium", is_active: true },
    { name: "Steel", handle: "steel", is_active: true },
    { name: "Copper", handle: "copper", is_active: true },
    { name: "Iron", handle: "iron", is_active: true },
    { name: "Tin", handle: "tin", is_active: true },
    { name: "Brass", handle: "brass", is_active: true },
    { name: "E-waste", handle: "e-waste", is_active: true },
    { name: "Glass Bottles", handle: "glass-bottles", is_active: true },
  ];

  let categoryResult: { id: string; name?: string; handle?: string }[];
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  });
  if (existingCategories.length > 0) {
    logger.info(
      `${existingCategories.length} product category(ies) already exist. Using existing categories.`
    );
    categoryResult = existingCategories as { id: string; name?: string; handle?: string }[];
  } else {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: { product_categories: categoryData },
    });
    categoryResult = result;
  }

  const { result: productResult } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Medusa T-Shirt",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Shirts")!.id,
          ],
          description:
            "Reimagine the feeling of a classic T-shirt. With our cotton T-shirts, everyday essentials no longer have to be ordinary.",
          handle: "t-shirt",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-back.png",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
            {
              title: "Color",
              values: ["Black", "White"],
            },
          ],
          variants: [
            {
              title: "S / Black",
              sku: "SHIRT-S-BLACK",
              options: {
                Size: "S",
                Color: "Black",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
            {
              title: "S / White",
              sku: "SHIRT-S-WHITE",
              options: {
                Size: "S",
                Color: "White",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
            {
              title: "M / Black",
              sku: "SHIRT-M-BLACK",
              options: {
                Size: "M",
                Color: "Black",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
            {
              title: "M / White",
              sku: "SHIRT-M-WHITE",
              options: {
                Size: "M",
                Color: "White",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
            {
              title: "L / Black",
              sku: "SHIRT-L-BLACK",
              options: {
                Size: "L",
                Color: "Black",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
            {
              title: "L / White",
              sku: "SHIRT-L-WHITE",
              options: {
                Size: "L",
                Color: "White",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
            {
              title: "XL / Black",
              sku: "SHIRT-XL-BLACK",
              options: {
                Size: "XL",
                Color: "Black",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
            {
              title: "XL / White",
              sku: "SHIRT-XL-WHITE",
              options: {
                Size: "XL",
                Color: "White",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Medusa Sweatshirt",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Sweatshirts")!.id,
          ],
          description:
            "Reimagine the feeling of a classic sweatshirt. With our cotton sweatshirt, everyday essentials no longer have to be ordinary.",
          handle: "sweatshirt",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
          ],
          variants: [
            {
              title: "S",
              sku: "SWEATSHIRT-S",
              options: {
                Size: "S",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
            {
              title: "M",
              sku: "SWEATSHIRT-M",
              options: {
                Size: "M",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
            {
              title: "L",
              sku: "SWEATSHIRT-L",
              options: {
                Size: "L",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
            {
              title: "XL",
              sku: "SWEATSHIRT-XL",
              options: {
                Size: "XL",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Medusa Sweatpants",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Pants")!.id,
          ],
          description:
            "Reimagine the feeling of classic sweatpants. With our cotton sweatpants, everyday essentials no longer have to be ordinary.",
          handle: "sweatpants",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
          ],
          variants: [
            {
              title: "S",
              sku: "SWEATPANTS-S",
              options: {
                Size: "S",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
            {
              title: "M",
              sku: "SWEATPANTS-M",
              options: {
                Size: "M",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
            {
              title: "L",
              sku: "SWEATPANTS-L",
              options: {
                Size: "L",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
            {
              title: "XL",
              sku: "SWEATPANTS-XL",
              options: {
                Size: "XL",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Medusa Shorts",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Merch")!.id,
          ],
          description:
            "Reimagine the feeling of classic shorts. With our cotton shorts, everyday essentials no longer have to be ordinary.",
          handle: "shorts",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-back.png",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
          ],
          variants: [
            {
              title: "S",
              sku: "SHORTS-S",
              options: {
                Size: "S",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
            {
              title: "M",
              sku: "SHORTS-M",
              options: {
                Size: "M",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
            {
              title: "L",
              sku: "SHORTS-L",
              options: {
                Size: "L",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
            {
              title: "XL",
              sku: "SHORTS-XL",
              options: {
                Size: "XL",
              },
              prices: [
                {
                  amount: 50,
                  currency_code: "aed",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Recycled Paper - OCC",
          category_ids: [
            categoryResult.find((cat) => cat.handle === "paper")!.id,
          ],
          description:
            "Old Corrugated Cardboard (OCC) - clean, dry cardboard suitable for recycling. Minimum order for B2B.",
          handle: "recycled-paper-occ",
          weight: 1000,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Type", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              sku: "SCRAP-PAPER-OCC",
              options: { Type: "Default" },
              prices: [{ amount: 120, currency_code: "aed" }],
            },
          ],
          sales_channels: [
            { id: defaultSalesChannel[0].id },
          ],
        },
        {
          title: "HDPE Plastic Scrap",
          category_ids: [
            categoryResult.find((cat) => cat.handle === "plastic")!.id,
          ],
          description:
            "High-Density Polyethylene scrap, sorted and baled. Ideal for recycling facilities.",
          handle: "hdpe-plastic-scrap",
          weight: 500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Type", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              sku: "SCRAP-PLASTIC-HDPE",
              options: { Type: "Default" },
              prices: [{ amount: 350, currency_code: "aed" }],
            },
          ],
          sales_channels: [
            { id: defaultSalesChannel[0].id },
          ],
        },
        {
          title: "Aluminium Scrap - Clean",
          category_ids: [
            categoryResult.find((cat) => cat.handle === "aluminium")!.id,
          ],
          description:
            "Clean aluminium scrap, sorted by grade. Suitable for smelting and recycling.",
          handle: "aluminium-scrap-clean",
          weight: 250,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Type", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              sku: "SCRAP-ALU-CLEAN",
              options: { Type: "Default" },
              prices: [{ amount: 800, currency_code: "aed" }],
            },
          ],
          sales_channels: [
            { id: defaultSalesChannel[0].id },
          ],
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding sellers and product–seller links.");
  try {
    const sellersData = [
      { name: "ScrapCircle Direct", handle: "scrapcircle-direct" },
      { name: "Green Metals Co", handle: "green-metals-co" },
      { name: "Eco Plastics UAE", handle: "eco-plastics-uae" },
    ];
    const createdSellers = await sellerModuleService.createSellers(sellersData);
    for (let i = 0; i < Math.min(createdSellers.length, productResult.length); i++) {
      await link.create({
        [Modules.PRODUCT]: { product_id: productResult[i].id },
        [SELLER_MODULE]: { seller_id: createdSellers[i].id },
      });
    }
    logger.info("Finished seeding sellers and links.");
  } catch (err) {
    logger.warn(
      "Sellers/links seed skipped (run 'npx medusa db:generate seller' and 'npx medusa db:migrate' first): " +
        (err instanceof Error ? err.message : String(err))
    );
  }

  logger.info("Seeding inventory levels.");

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  });
  const stockLocationId = stockLocations[0]?.id;

  if (stockLocationId) {
    const { data: inventoryItems } = await query.graph({
      entity: "inventory_item",
      fields: ["id"],
    });

    const inventoryLevels: CreateInventoryLevelInput[] = [];
    for (const inventoryItem of inventoryItems) {
      inventoryLevels.push({
        location_id: stockLocationId,
        stocked_quantity: 1000000,
        inventory_item_id: inventoryItem.id,
      });
    }

    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: inventoryLevels },
    });
    logger.info("Finished seeding inventory levels data.");
  } else {
    logger.warn("No stock location found, skipping inventory levels.");
  }
}
