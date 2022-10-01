import { taskEither as TE } from "fp-ts";
import { Sale } from "../../domain/sale";
import { TechErr, BusinessErr } from "../../domain/error";

export type SaleRepo = {
  insert: (c: Sale) => TE.TaskEither<TechErr | BusinessErr<"CONFLICT">, void>;
};
