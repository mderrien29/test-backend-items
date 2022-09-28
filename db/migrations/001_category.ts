import { Knex } from "knex";
import { getConfig } from "../../src/infra/config";

const config = getConfig();

export const up = async (db: Knex) =>
  db.schema.createTable(config.table_category, (t) => {
    t.integer("id");
    t.string("name");
    t.string("summary");
  });

export const down = () => Promise.resolve(null);
