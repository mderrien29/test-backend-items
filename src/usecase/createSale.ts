import { function as fp, taskEither as TE } from "fp-ts";
import { Sale } from "../domain/sale";
import { BusinessErr, TechErr } from "../domain/error";
import { SaleRepo } from "./_adapters/saleRepo";

export type CreateSaleFactory = (insert: SaleRepo["insert"]) => CreateSalePure;
export type CreateSalePure = (
  category: Sale
) => TE.TaskEither<TechErr | BusinessErr<"CONFLICT">, Sale>;

export const createSaleFactory: CreateSaleFactory = (insert) =>
  fp.flow(TE.of, TE.chainFirst(insert));
