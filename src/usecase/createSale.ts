import { function as fp, taskEither as TE } from "fp-ts";
import { Sale } from "src/domain/sale";
import { BusinessErr, TechErr } from "src/domain/error";
import { SaleRepo } from "./_adapters/saleRepo";

export type CreateSaleFactory = (insert: SaleRepo["insert"]) => CreateSalePure;
export type CreateSalePure = (
  category: Sale
) => TE.TaskEither<TechErr | BusinessErr<"CONFLICT">, void>;

export const createSaleFactory: CreateSaleFactory = (insert) => fp.flow(insert);
