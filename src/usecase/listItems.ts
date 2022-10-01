import { function as fp, taskEither as TE, readonlyArray as RA } from "fp-ts";
import { errTech, TechErr } from "../domain/error";
import { ItemRepo } from "./_adapters/itemRepo";
import { Item } from "../domain/item";
import { Category } from "../domain/category";
import { Sale } from "../domain/sale";
import { GetItemPure } from "./getItem";

export type ListItemFactory = (
  getItemIds: ItemRepo["getIds"],
  getFullItem: GetItemPure
) => ListItemPure;
export type ListItemPure = () => TE.TaskEither<TechErr, FullItemList>;
type FullItemList = Array<Item & { category: Category } & { sale: Sale }>;

export const listItemFactory: ListItemFactory = (getIds, getFullItem) =>
  fp.flow(
    getIds,
    TE.chainW(
      TE.traverseArray((id) =>
        fp.pipe(
          getFullItem(id),
          TE.mapLeft(() => errTech)
        )
      )
    ),
    TE.map(RA.toArray)
  );
