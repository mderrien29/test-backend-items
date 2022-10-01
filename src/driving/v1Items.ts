import { Handler } from 'express';
import { function as fp, taskEither as TE } from 'fp-ts';

import { Filter, Item } from '../domain/item';
import { CountItemPure } from '../usecase/countItems';
import { CreateItemPure } from '../usecase/createItem';
import { ListItemPure } from '../usecase/listItems';
import {
  contentRangeMapper,
  saneErrorMapper,
  staticSuccessMapper,
  validate,
} from './saneExpressDefaults';

export const headItems =
  (countItem: CountItemPure): Handler =>
  (_, res) =>
    fp.pipe(
      countItem(),
      TE.fold(saneErrorMapper(res), contentRangeMapper('items')(res)),
    )();

export const listItems =
  (listItems: ListItemPure): Handler =>
  (req, res) =>
    fp.pipe(
      req.query,
      validate(Filter.decode),
      TE.chainW(listItems),
      TE.fold(saneErrorMapper(res), staticSuccessMapper(200)(res)),
    )();

export const postItems =
  (createItem: CreateItemPure): Handler =>
  (req, res) =>
    fp.pipe(
      req.body,
      validate(Item.decode),
      TE.chainW(createItem),
      TE.fold(saneErrorMapper(res), staticSuccessMapper(201)(res)),
    )();
