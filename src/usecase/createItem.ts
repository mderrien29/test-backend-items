import { function as fp, taskEither as TE } from "fp-ts";
import { BusinessErr, TechErr } from "../domain/error";
import { ItemRepo } from "./_adapters/itemRepo";
import { Item } from "../domain/item";

export type CreateItemFactory = (insert: ItemRepo["insert"]) => CreateItemPure;
export type CreateItemPure = (
  item: Item
) => TE.TaskEither<TechErr | BusinessErr<"CONFLICT">, void>;

export const createItemFactory: CreateItemFactory = (insert) => fp.flow(insert);
