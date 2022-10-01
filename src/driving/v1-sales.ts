import { function as fp, taskEither as TE } from "fp-ts";
import { failure } from "io-ts/lib/PathReporter";

import { Handler } from "express";
import { errors } from "../domain/error";
import { saneErrorMapper, staticSuccessMapper } from "./saneExpressDefaults";
import { CreateSalePure } from "../usecase/createSale";
import { Sale } from "../domain/sale";

export const postSales =
  (createSale: CreateSalePure): Handler =>
  (req, res) =>
    fp.pipe(
      req.body,
      Sale.decode,
      TE.fromEither,
      TE.mapLeft((e) => errors.BAD_REQUEST(failure(e).toString())),
      TE.chainW(createSale),
      TE.fold(saneErrorMapper(res), staticSuccessMapper(201)(res))
    )();
