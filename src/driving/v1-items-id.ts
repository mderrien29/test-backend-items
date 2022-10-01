import { Handler } from 'express';
import { function as fp, taskEither as TE } from 'fp-ts';

import { Item } from '../domain/item';
import { GetItemPure } from '../usecase/getItem';
import {
  saneErrorMapper,
  staticSuccessMapper,
  validate,
} from './saneExpressDefaults';

export const getItems =
  (getItem: GetItemPure): Handler =>
  (req, res) =>
    fp.pipe(
      req.params.itemId,
      Number,
      validate(Item.props.id.decode),
      TE.chainW(getItem),
      TE.fold(saneErrorMapper(res), staticSuccessMapper(200)(res)),
    )();
