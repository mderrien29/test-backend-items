import { taskEither as TE, option as O } from "fp-ts";
import { Item } from "../../domain/item";
import { TechErr, BusinessErr } from "../../domain/error";

export type ItemRepo = {
  insert: (i: Item) => TE.TaskEither<TechErr | BusinessErr<"CONFLICT">, void>;
  getById: (i: Item["id"]) => TE.TaskEither<TechErr, O.Option<Item>>;
  filterBy: <K extends keyof Item>(
    k: K
  ) => (v: Item[K]) => TE.TaskEither<TechErr, Array<Item>>;
};
