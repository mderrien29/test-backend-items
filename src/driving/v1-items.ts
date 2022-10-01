import { function as fp, taskEither as TE, task as T } from "fp-ts";
import * as t from "io-ts";

import { Handler } from "express";
import {
  saneErrorMapper,
  staticSuccessMapper,
  validate,
} from "./saneExpressDefaults";
import { CreateItemPure } from "../usecase/createItem";
import { Filter, Item } from "../domain/item";
import { ListItemPure } from "../usecase/listItems";

export const listItems =
  (listItems: ListItemPure): Handler =>
  (req, res) =>
    fp.pipe(
      req.query,
      validate(Filter.decode),
      TE.getOrElse<any, Filter | null>(fp.flow(fp.constNull, T.of)),
      T.chain(listItems),
      TE.fold(saneErrorMapper(res), staticSuccessMapper(200)(res))
    )();

export const postItems =
  (createItem: CreateItemPure): Handler =>
  (req, res) =>
    fp.pipe(
      req.body,
      validate(Item.decode),
      TE.chainW(createItem),
      TE.fold(saneErrorMapper(res), staticSuccessMapper(201)(res))
    )();
