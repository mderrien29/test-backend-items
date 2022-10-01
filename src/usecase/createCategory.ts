import { function as fp, taskEither as TE } from "fp-ts";
import { Category } from "../domain/category";
import { BusinessErr, TechErr } from "../domain/error";
import { CategoryRepo } from "./_adapters/categoryRepo";

export type CreateCategoryFactory = (
  insert: CategoryRepo["insert"]
) => CreateCategoryPure;
export type CreateCategoryPure = (
  category: Category
) => TE.TaskEither<TechErr | BusinessErr<"CONFLICT">, Category>;

export const createCategoryFactory: CreateCategoryFactory = (insert) =>
  fp.flow(TE.of, TE.chainFirst(insert));
