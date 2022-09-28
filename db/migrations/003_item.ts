import { Knex } from "knex";
import { getConfig } from "../../src/infra/config";

const config = getConfig();

export const up = async (db: Knex) =>
  db.schema.createTable(config.table_item, (t) => {
    t.integer("id");
    t.integer("category_id").references("id").inTable(config.table_category);
    t.integer("sale_id").references("id").inTable(config.table_sale);
    t.string("description");
    t.string("auction_type"); // could be enum
    t.integer("picing_estimates_max");
    t.integer("pricing_estimates_min");
    t.string("pricing_estimates_currency");
  });

export const down = () => Promise.resolve(null);
