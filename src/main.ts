import express from "express";
import { categoryRepoKnex } from "./driven/categoryRepo/categoryRepoKnex";
import { postCategories } from "./driving/v1-categories";
import { getConfig } from "./infra/config";
import { getPostgresqlAdapter } from "./infra/postgres";
import { createCategoryFactory } from "./usecase/createCategory";
import { createSaleFactory } from "./usecase/createSale";
import { saleRepoKnex } from "./driven/saleRepo/saleRepoKnex";
import { postSales } from "./driving/v1-sales";
import { itemRepoKnex } from "./driven/itemRepo/itemRepoKnex";
import { createItemFactory } from "./usecase/createItem";
import { postItems } from "./driving/v1-items";

// Infra
const config = getConfig();
const pg = getPostgresqlAdapter(config.postgresql_connection_string);

// Adapters
const categoryRepo = categoryRepoKnex(pg, config.table_category);
const saleRepo = saleRepoKnex(pg, config.table_sale);
const itemRepo = itemRepoKnex(pg, config.table_item);

// Usecase
const createCategory = createCategoryFactory(categoryRepo.insert);
const createSale = createSaleFactory(saleRepo.insert);
const createItem = createItemFactory(itemRepo.insert, itemRepo.getById);

// HTTP
const app = express();
app.use(express.json());
app.get("/v1/status", (_, res) => res.status(200).send({ status: "OK" }));
app.post("/v1/categories", postCategories(createCategory));
app.post("/v1/sales", postSales(createSale));
app.post("/v1/items", postItems(createItem));

app.listen(config.port);
