import { function as fp, taskEither as TE } from "fp-ts";
import { BusinessErr, errTech, TechErr } from "../domain/error";
import { ItemRepo } from "./_adapters/itemRepo";
import { Item } from "../domain/item";

export type CreateItemFactory = (
  insert: ItemRepo["insert"],
  getById: ItemRepo["getById"]
) => CreateItemPure;
export type CreateItemPure = (
  item: Item
) => TE.TaskEither<TechErr | BusinessErr<"CONFLICT">, Item>;

export const createItemFactory: CreateItemFactory = (insert, getById) =>
  fp.flow(
    TE.of,
    TE.chainFirst(insert),
    TE.chainW((item) => getById(item.id)),
    TE.chainW(TE.fromOption(() => errTech))
  );
