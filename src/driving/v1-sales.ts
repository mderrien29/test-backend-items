import { Handler } from 'express';
import { function as fp, taskEither as TE } from 'fp-ts';

import { Sale } from '../domain/sale';
import { CreateSalePure } from '../usecase/createSale';
import {
  saneErrorMapper,
  staticSuccessMapper,
  validate,
} from './saneExpressDefaults';

export const postSales =
  (createSale: CreateSalePure): Handler =>
  (req, res) =>
    fp.pipe(
      req.body,
      validate(Sale.decode),
      TE.chainW(createSale),
      TE.fold(saneErrorMapper(res), staticSuccessMapper(201)(res)),
    )();
