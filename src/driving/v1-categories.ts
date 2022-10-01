import { function as fp, taskEither as TE } from "fp-ts";
import { failure } from "io-ts/lib/PathReporter";

import { Category } from "../domain/category";
import { Handler } from "express";
import { CreateCategoryPure } from "../usecase/createCategory";
import { errors } from "../domain/error";
import { saneErrorMapper, staticSuccessMapper } from "./saneExpressDefaults";

export const postCategories =
  (createCategory: CreateCategoryPure): Handler =>
  (req, res) =>
    fp.pipe(
      req.body,
      Category.decode,
      TE.fromEither,
      TE.mapLeft((e) => errors.BAD_REQUEST(failure(e).toString())),
      TE.chainW(createCategory),
      TE.fold(saneErrorMapper(res), staticSuccessMapper(201)(res))
    )();
