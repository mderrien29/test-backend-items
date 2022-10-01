import {
  function as fp,
  taskEither as TE,
  option as O,
  either as E,
  readonlyArray as RA,
} from "fp-ts";
import { Knex } from "knex";
import { Item } from "../../domain/item";
import { errTech } from "../../domain/error";
import { ItemRepo } from "../../usecase/_adapters/itemRepo";
import { catchInsertErrors } from "../knex-utils";

const itemToRow = (i: Item) =>
  fp.pipe({
    id: i.id,
    category_id: i.category_id,
    sale_id: i.sale_id,
    description: i.description,
    auction_type: i.auction_type,
    pricing_estimates_min: i.pricing.estimates.min,
    pricing_estimates_max: i.pricing.estimates.max,
    pricing_estimates_currency: i.pricing.estimates.currency,
  });

const rowToItem = (r: any) =>
  fp.pipe(
    {
      id: r.id,
      category_id: r.category_id,
      sale_id: r.sale_id,
      description: r.description,
      auction_type: r.auction_type,
      pricing: {
        estimates: {
          min: r.pricing_estimates_min,
          max: r.pricing_estimates_max,
          currency: r.pricing_estimates_currency,
        },
      },
      last_updated: r.updated_at,
    },
    Item.decode
  );

export const itemRepoKnex = (db: Knex, table: string): ItemRepo => ({
  insert: (item) =>
    fp.pipe(
      itemToRow(item),
      TE.tryCatchK((row) => db.table(table).insert(row), catchInsertErrors),
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
          O.map(rowToItem),
          O.match(
            () => E.right(O.none),
            E.match(
              () => E.left(errTech),
              (item) => E.right(O.some(item))
            )
          )
        )
      )
    ),

  filterBy: (key) => (value) =>
    fp.pipe(
      fp.pipe(
        TE.tryCatch(
          () => db.table(table).select().where(key, value),
          () => errTech
        ),
        TE.chain(
          TE.traverseArray(
            fp.flow(
              rowToItem,
              E.mapLeft(() => errTech),
              TE.fromEither
            )
          )
        ),
        TE.map(RA.toArray)
      )
    ),
});
