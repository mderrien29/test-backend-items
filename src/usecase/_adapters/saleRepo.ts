import { taskEither as TE, option as O } from 'fp-ts';

import { TechErr, BusinessErr } from '../../domain/error';
import { Sale } from '../../domain/sale';

export type SaleRepo = {
  insert: (c: Sale) => TE.TaskEither<TechErr | BusinessErr<'CONFLICT'>, void>;
  getById: (i: Sale['id']) => TE.TaskEither<TechErr, O.Option<Sale>>;
};
