import { function as fp, taskEither as TE } from "fp-ts";
import { Knex } from "knex";
import { errTech } from "../../domain/error";
import { CategoryRepo } from "../../usecase/_adapters/categoryRepo";

export const categoryRepoKnex = (db: Knex, table: string): CategoryRepo => ({
  insert: (category) =>
    fp.pipe(
      TE.tryCatch(
        () => db.table(table).insert(category),
        () => errTech
      ),
      TE.map(fp.constVoid)
    ),
});
