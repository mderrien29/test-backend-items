import {
  function as fp,
  taskEither as TE,
  option as O,
  either as E,
} from "fp-ts";
import { Knex } from "knex";
import { Sale } from "../../domain/sale";
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
  getById: (i) =>
    fp.pipe(
      TE.tryCatch(
        () => db.table(table).select().where("id", i).first(),
        () => errTech
      ),
      TE.chainEitherK(
        fp.flow(
          O.fromNullable,
          O.map(Sale.decode),
          O.match(
            () => E.right(O.none),
            E.match(
              () => E.left(errTech),
              (sale) => E.right(O.some(sale))
            )
          )
        )
      )
    ),
});
