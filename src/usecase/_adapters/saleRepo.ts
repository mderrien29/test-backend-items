import { taskEither as TE } from "fp-ts";
import { Sale } from "src/domain/sale";
import { TechErr, BusinessErr } from "src/domain/error";

export type SaleRepo = {
  insert: (c: Sale) => TE.TaskEither<TechErr | BusinessErr<"CONFLICT">, void>;
};
