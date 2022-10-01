import { taskEither as TE, option as O } from "fp-ts";
import { Category } from "../../domain/category";
import { TechErr, BusinessErr } from "../../domain/error";

export type CategoryRepo = {
  insert: (
    c: Category
  ) => TE.TaskEither<TechErr | BusinessErr<"CONFLICT">, void>;
  getById: (i: Category["id"]) => TE.TaskEither<TechErr, O.Option<Category>>;
};
