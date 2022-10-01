import { function as fp, taskEither as TE } from "fp-ts";

import { Category } from "../domain/category";
import { Handler } from "express";
import { CreateCategoryPure } from "../usecase/createCategory";
import {
  saneErrorMapper,
  staticSuccessMapper,
  validate,
} from "./saneExpressDefaults";

export const postCategories =
  (createCategory: CreateCategoryPure): Handler =>
  (req, res) =>
    fp.pipe(
      req.body,
      validate(Category.decode),
      TE.chainW(createCategory),
      TE.fold(saneErrorMapper(res), staticSuccessMapper(201)(res))
    )();
