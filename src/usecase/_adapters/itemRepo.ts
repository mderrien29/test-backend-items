import { taskEither as TE, option as O } from 'fp-ts';

import { TechErr, BusinessErr } from '../../domain/error';
import { Item, Filter } from '../../domain/item';

export type ItemRepo = {
  insert: (i: Item) => TE.TaskEither<TechErr | BusinessErr<'CONFLICT'>, void>;
  getById: (i: Item['id']) => TE.TaskEither<TechErr, O.Option<Item>>;
  getIdsFilterBy: (f: Filter) => TE.TaskEither<TechErr, Array<Item['id']>>;
};
