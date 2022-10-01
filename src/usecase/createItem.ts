import { function as fp, taskEither as TE } from "fp-ts";
import { BusinessErr, errTech, TechErr } from "../domain/error";
import { ItemRepo } from "./_adapters/itemRepo";
import { Item } from "../domain/item";
import { Category } from "../domain/category";
import { Sale } from "../domain/sale";
import { GetItemPure } from "./getItem";

export type CreateItemFactory = (
  insert: ItemRepo["insert"],
  getFullItem: GetItemPure
) => CreateItemPure;
export type CreateItemPure = (
  item: Item
) => TE.TaskEither<TechErr | BusinessErr<"CONFLICT">, Out>;
type Out = Item & { category: Category } & { sale: Sale };

export const createItemFactory: CreateItemFactory = (insert, getFullItem) =>
  fp.flow(
    TE.of,
    TE.chainFirst(insert),
    TE.chainW((item) =>
      fp.pipe(
        getFullItem(item.id),
        TE.mapLeft(() => errTech)
      )
    )
  );
