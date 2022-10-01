import express from "express";
import { categoryRepoKnex } from "./driven/categoryRepo/categoryRepoKnex";
import { postCategories } from "./driving/v1-categories";
import { getConfig } from "./infra/config";
import { getPostgresqlAdapter } from "./infra/postgres";
import { createCategoryFactory } from "./usecase/createCategory";
import { createSaleFactory } from "./usecase/createSale";
import { saleRepoKnex } from "./driven/saleRepo/saleRepoKnex";
import { postSales } from "./driving/v1-sales";

// Infra
const config = getConfig();
const pg = getPostgresqlAdapter(config.postgresql_connection_string);

// Adapters
const categoryRepo = categoryRepoKnex(pg, config.table_category);
const saleRepo = saleRepoKnex(pg, config.table_sale);

// Usecase
const createCategory = createCategoryFactory(categoryRepo.insert);
const createSale = createSaleFactory(saleRepo.insert);

// HTTP
const app = express();
app.use(express.json());
app.get("/v1/status", (_, res) => res.status(200).send({ status: "OK" }));
app.post("/v1/categories", postCategories(createCategory));
app.post("/v1/sales", postSales(createSale));

app.listen(config.port);
