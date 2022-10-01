import { Knex } from "knex";
import { getConfig } from "../../src/infra/config";

const config = getConfig();

export const up = async (db: Knex) =>
  db.schema.createTable(config.table_sale, (t) => {
    t.integer("id").primary();
    t.string("name");
  });

export const down = () => Promise.resolve(null);
