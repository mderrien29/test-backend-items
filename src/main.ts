import express from "express";
import { categoryRepoKnex } from "./driven/categoryRepo/categoryRepoKnex";
import { postCategories } from "./driving/v1-categories";

import { getConfig } from "./infra/config";
import { getPostgresqlAdapter } from "./infra/postgres";
import { createCategoryFactory } from "./usecase/createCategory";

const config = getConfig();
const pg = getPostgresqlAdapter(config.postgresql_connection_string);

// Adapters
const categoryRepo = categoryRepoKnex(pg, config.table_category);

// Usecase
const createCategory = createCategoryFactory(categoryRepo.insert);

// HTTP
const app = express();
app.get("/v1/status", (_, res) => res.status(200).send({ status: "OK" }));
app.post("/v1/categories", postCategories(createCategory));

app.listen(config.port);
