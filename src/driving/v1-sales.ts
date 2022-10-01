import { function as fp, taskEither as TE } from "fp-ts";

import { Handler } from "express";
import {
  saneErrorMapper,
  staticSuccessMapper,
  validate,
} from "./saneExpressDefaults";
import { CreateSalePure } from "../usecase/createSale";
import { Sale } from "../domain/sale";

export const postSales =
  (createSale: CreateSalePure): Handler =>
  (req, res) =>
    fp.pipe(
      req.body,
      validate(Sale.decode),
      TE.chainW(createSale),
      TE.fold(saneErrorMapper(res), staticSuccessMapper(201)(res))
    )();
