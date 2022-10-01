import {
  function as fp,
  taskEither as TE,
  option as O,
  either as E,
} from 'fp-ts';
import { Knex } from 'knex';

import { Category } from '../../domain/category';
import { errTech } from '../../domain/error';
import { CategoryRepo } from '../../usecase/_adapters/categoryRepo';
import { catchInsertErrors } from '../knex-utils';

export const categoryRepoKnex = (db: Knex, table: string): CategoryRepo => ({
  insert: (category) =>
    fp.pipe(
      TE.tryCatch(() => db.table(table).insert(category), catchInsertErrors),
      TE.map(fp.constVoid),
    ),
  getById: (i) =>
    fp.pipe(
      TE.tryCatch(
        () => db.table(table).select().where('id', i).first(),
        () => errTech,
      ),
      TE.chainEitherK(
        fp.flow(
          O.fromNullable,
          O.map(Category.decode),
          O.match(
            () => E.right(O.none),
            E.match(
              () => E.left(errTech),
              (category) => E.right(O.some(category)),
            ),
          ),
        ),
      ),
    ),
});
