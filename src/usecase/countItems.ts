import { function as fp, taskEither as TE } from "fp-ts";
import { TechErr } from "../domain/error";
import { ItemRepo } from "./_adapters/itemRepo";

export type CountItemFactory = (
  getItemIdsFiltered: ItemRepo["getIdsFilterBy"]
) => CountItemPure;
export type CountItemPure = () => TE.TaskEither<TechErr, number>;

export const countItemFactory: CountItemFactory = (getIdsFiltered) =>
  fp.flow(
    () => getIdsFiltered({}),
    TE.map((a) => a.length)
  );
