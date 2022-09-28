import { function as fp, taskEither as TE } from "fp-ts";

import { Category } from "src/domain/category";
import { Handler } from "express";
import { CreateCategoryPure } from "src/usecase/createCategory";
import { errors } from "src/domain/error";
import { saneErrorMapper, staticSuccessMapper } from "./saneExpressDefaults";

export const postCategories =
  (createCategory: CreateCategoryPure): Handler =>
  (req, res) =>
    fp.pipe(
      req.body,
      Category.decode,
      TE.fromEither,
      TE.mapLeft(() => errors.BAD_REQUEST),
      TE.chainW(createCategory),
      TE.fold(saneErrorMapper(res), staticSuccessMapper(200)(res))
    )();
