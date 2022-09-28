import { knex, Knex } from "knex";

export const getPostgresqlAdapter = (connection: string): Knex =>
  knex({
    client: "pg",
    connection: connection,
    searchPath: ["public"],
  });
