import { function as fp, taskEither as TE } from "fp-ts";

import { Handler } from "express";
import {
  saneErrorMapper,
  staticSuccessMapper,
  validate,
} from "./saneExpressDefaults";
import { CreateItemPure } from "../usecase/createItem";
import { Item } from "../domain/item";

export const postItems =
  (createItem: CreateItemPure): Handler =>
  (req, res) =>
    fp.pipe(
      req.body,
      validate(Item.decode),
      TE.chainW(createItem),
      TE.fold(saneErrorMapper(res), staticSuccessMapper(201)(res))
    )();
