import { taskEither as TE } from "fp-ts";
import { Category } from "src/domain/category";
import { TechErr, BusinessErr } from "src/domain/error";

export type CategoryRepo = {
  insert: (
    c: Category
  ) => TE.TaskEither<TechErr | BusinessErr<"CONFLICT">, void>;
};
