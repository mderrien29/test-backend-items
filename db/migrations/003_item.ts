import { Knex } from "knex";
import { getConfig } from "../../src/infra/config";

const config = getConfig();

const PG_F_UPDATED_AT = "on_update_timestamp";

const addUpdatedAtFunction = `
  CREATE OR REPLACE FUNCTION ${PG_F_UPDATED_AT}()
    RETURNS trigger AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
  $$ language 'plpgsql'
`;

const addUpdatedAtTrigger = (table: string) => `
  CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE ${PG_F_UPDATED_AT}(); 
`;

export const up = async (db: Knex) => {
  await db.raw(addUpdatedAtFunction);

  await db.schema.createTable(config.table_item, (t) => {
    t.integer("id").primary();
    t.integer("category_id").references("id").inTable(config.table_category);
    t.integer("sale_id").references("id").inTable(config.table_sale);
    t.string("description");
    t.string("auction_type"); // could be enum
    t.integer("pricing_estimates_max");
    t.integer("pricing_estimates_min");
    t.string("pricing_estimates_currency");
    t.datetime("updated_at").defaultTo("now()");
  });

  await db.raw(addUpdatedAtTrigger(config.table_item));
};

export const down = () => Promise.resolve(null);
