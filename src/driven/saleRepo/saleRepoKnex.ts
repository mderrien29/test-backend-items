import { function as fp, taskEither as TE } from "fp-ts";
import { Knex } from "knex";
import { errTech } from "../../domain/error";
import { SaleRepo } from "../../usecase/_adapters/saleRepo";

export const saleRepoKnex = (db: Knex, table: string): SaleRepo => ({
  insert: (sale) =>
    fp.pipe(
      TE.tryCatch(
        () => db.table(table).insert(sale),
        () => errTech
      ),
      TE.map(fp.constVoid)
    ),
});
