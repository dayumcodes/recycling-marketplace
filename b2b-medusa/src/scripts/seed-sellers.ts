import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import { SELLER_MODULE } from "../modules/seller";

export default async function seedSellers({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const sellerModuleService = container.resolve(SELLER_MODULE);

  const existingSellers = await sellerModuleService.listSellers({});
  if (existingSellers.length > 0) {
    logger.info(
      `${existingSellers.length} seller(s) already exist. Skipping seller seed.`
    );
    return;
  }

  logger.info("Creating sellers...");
  const sellersData = [
    { name: "ScrapCircle Direct", handle: "scrapcircle-direct" },
    { name: "Green Metals Co", handle: "green-metals-co" },
    { name: "Eco Plastics UAE", handle: "eco-plastics-uae" },
  ];
  const createdSellers = await sellerModuleService.createSellers(sellersData);
  logger.info(`Created ${createdSellers.length} sellers.`);

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title"],
  });

  if (products.length === 0) {
    logger.warn("No products found to link to sellers.");
    return;
  }

  logger.info(`Linking ${Math.min(products.length, createdSellers.length)} products to sellers...`);
  for (
    let i = 0;
    i < Math.min(createdSellers.length, products.length);
    i++
  ) {
    await link.create({
      [Modules.PRODUCT]: { product_id: products[i].id },
      [SELLER_MODULE]: { seller_id: createdSellers[i].id },
    });
    logger.info(
      `  Linked "${products[i].title}" → "${createdSellers[i].name}"`
    );
  }

  logger.info("Finished seeding sellers and product-seller links.");
}
