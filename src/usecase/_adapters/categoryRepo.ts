import { taskEither as TE } from "fp-ts";
import { Category } from "../../domain/category";
import { TechErr, BusinessErr } from "../../domain/error";

export type CategoryRepo = {
  insert: (
    c: Category
  ) => TE.TaskEither<TechErr | BusinessErr<"CONFLICT">, void>;
};
