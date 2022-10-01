import { function as fp, taskEither as TE, readonlyArray as RA } from "fp-ts";
import { errTech, TechErr } from "../domain/error";
import { ItemRepo } from "./_adapters/itemRepo";
import { Filter, Item } from "../domain/item";
import { Category } from "../domain/category";
import { Sale } from "../domain/sale";
import { GetItemPure } from "./getItem";

export type ListItemFactory = (
  getItemIdsFiltered: ItemRepo["getIdsFilterBy"],
  getFullItem: GetItemPure
) => ListItemPure;
export type ListItemPure = (
  filter: Filter | null
) => TE.TaskEither<TechErr, FullItemList>;
type FullItemList = Array<Item & { category: Category } & { sale: Sale }>;

export const listItemFactory: ListItemFactory = (getIdsFiltered, getFullItem) =>
  fp.flow(
    getIdsFiltered,
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
