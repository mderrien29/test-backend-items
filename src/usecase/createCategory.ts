import { function as fp, taskEither as TE } from "fp-ts";
import { Category } from "src/domain/category";
import { BusinessErr, TechErr } from "src/domain/error";
import { CategoryRepo } from "./_adapters/categoryRepo";

export type CreateCategoryFactory = (
  insert: CategoryRepo["insert"]
) => CreateCategoryPure;
export type CreateCategoryPure = (
  category: Category
) => TE.TaskEither<TechErr | BusinessErr<"CONFLICT">, void>;

export const createCategoryFactory: CreateCategoryFactory = (insert) =>
  fp.flow(insert);
