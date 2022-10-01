import { function as fp, taskEither as TE } from "fp-ts";
import { BusinessErr, errors, errTech, TechErr } from "../domain/error";
import { ItemRepo } from "./_adapters/itemRepo";
import { Item } from "../domain/item";
import { Category } from "../domain/category";
import { Sale } from "../domain/sale";
import { CategoryRepo } from "./_adapters/categoryRepo";
import { SaleRepo } from "./_adapters/saleRepo";

export type GetItemFactory = (
  getById: ItemRepo["getById"],
  getCategoryById: CategoryRepo["getById"],
  getSaleById: SaleRepo["getById"]
) => GetItemPure;
export type GetItemPure = (
  id: Item["id"]
) => TE.TaskEither<TechErr | BusinessErr<"NOT_FOUND">, Out>;
type Out = Item & { category: Category } & { sale: Sale };

export const getItemFactory: GetItemFactory = (
  getById,
  getCategoryById,
  getSaleById
) =>
  fp.flow(
    TE.of,
    TE.chainW(getById),
    TE.chainW(TE.fromOption(() => errors.NOT_FOUND(""))),
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
