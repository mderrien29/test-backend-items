import { function as fp, taskEither as TE } from "fp-ts";
import { BusinessErr, errTech, TechErr } from "../domain/error";
import { ItemRepo } from "./_adapters/itemRepo";
import { Item } from "../domain/item";
import { Category } from "../domain/category";
import { Sale } from "../domain/sale";
import { CategoryRepo } from "./_adapters/categoryRepo";
import { SaleRepo } from "./_adapters/saleRepo";

export type CreateItemFactory = (
  insert: ItemRepo["insert"],
  getById: ItemRepo["getById"],
  getCategoryById: CategoryRepo["getById"],
  getSaleById: SaleRepo["getById"]
) => CreateItemPure;
export type CreateItemPure = (
  item: Item
) => TE.TaskEither<TechErr | BusinessErr<"CONFLICT">, Out>;
type Out = Item & { category: Category } & { sale: Sale };

export const createItemFactory: CreateItemFactory = (
  insert,
  getById,
  getCategoryById,
  getSaleById
) =>
  fp.flow(
    TE.of,
    TE.chainFirst(insert),
    TE.chainW((item) => getById(item.id)),
    TE.chainW(TE.fromOption(() => errTech)),
    TE.bindW("category", (i) =>
      fp.pipe(
        getCategoryById(i.category_id),
        TE.chain(TE.fromOption(() => errTech))
      )
    ),
    TE.bindW("sale", (i) =>
      fp.pipe(getSaleById(i.sale_id), TE.chain(TE.fromOption(() => errTech)))
    )
  );
