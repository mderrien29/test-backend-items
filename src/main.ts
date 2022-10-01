import cors from 'cors';
import express from 'express';

import { categoryRepoKnex } from './driven/categoryRepo/categoryRepoKnex';
import { itemRepoKnex } from './driven/itemRepo/itemRepoKnex';
import { saleRepoKnex } from './driven/saleRepo/saleRepoKnex';
import { postCategories } from './driving/v1Categories';
import { postItems, listItems, headItems } from './driving/v1Items';
import { getItems } from './driving/v1ItemsId';
import { postSales } from './driving/v1Sales';
import { getStatus } from './driving/v1Status';
import { getConfig } from './infra/config';
import { getPostgresqlAdapter } from './infra/postgres';
import { countItemFactory } from './usecase/countItems';
import { createCategoryFactory } from './usecase/createCategory';
import { createItemFactory } from './usecase/createItem';
import { createSaleFactory } from './usecase/createSale';
import { getItemFactory } from './usecase/getItem';
import { listItemFactory } from './usecase/listItems';

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
const getItem = getItemFactory(
  itemRepo.getById,
  categoryRepo.getById,
  saleRepo.getById,
);
const createItem = createItemFactory(itemRepo.insert, getItem);
const listItem = listItemFactory(itemRepo.getIdsFilterBy, getItem);
const countItem = countItemFactory(itemRepo.getIdsFilterBy);

// HTTP
const app = express();
app.use(express.json());
app.use(cors());

app.get('/v1/status', getStatus);
app.post('/v1/categories', postCategories(createCategory));
app.post('/v1/sales', postSales(createSale));
app.head('/v1/items', headItems(countItem));
app.get('/v1/items', listItems(listItem));
app.post('/v1/items', postItems(createItem));
app.get('/v1/items/:itemId', getItems(getItem));

app.listen(config.port);
