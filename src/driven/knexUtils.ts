import { function as fp, boolean as B } from 'fp-ts';

import { BusinessErr, errors, errTech, TechErr } from '../domain/error';

const isUniqueConstraintError = (message: string) =>
  /already exists/.test(message);

export const catchInsertErrors = (e: any): TechErr | BusinessErr<'CONFLICT'> =>
  fp.pipe(
    isUniqueConstraintError(e.detail),
    B.matchW(
      () => errTech,
      () => errors.CONFLICT(''),
    ),
  );
