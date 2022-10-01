import { function as fp, taskEither as TE } from "fp-ts";
import { failure } from "io-ts/lib/PathReporter";

import { Handler } from "express";
import { errors } from "../domain/error";
import { saneErrorMapper, staticSuccessMapper } from "./saneExpressDefaults";
import { CreateItemPure } from "../usecase/createItem";
import { Item } from "../domain/item";

export const postItems =
  (createItem: CreateItemPure): Handler =>
  (req, res) =>
    fp.pipe(
      req.body,
      Item.decode,
      TE.fromEither,
      TE.mapLeft((e) => errors.BAD_REQUEST(failure(e).toString())),
      TE.chainW(createItem),
      TE.fold(saneErrorMapper(res), staticSuccessMapper(201)(res))
    )();
