import { Response } from 'express';
import { taskEither as TE, function as fp } from 'fp-ts';
import { Validation } from 'io-ts';
import { match } from 'ts-pattern';

import { BusinessErr, errors, TechErr } from '../domain/error';
import { getMessage } from './reporter';

export const validate = <A>(
  decode: (v: unknown) => Validation<A>,
): ((v: unknown) => TE.TaskEither<BusinessErr<'BAD_REQUEST'>, A>) =>
  fp.flow(
    decode,
    TE.fromEither,
    TE.mapLeft((e) => errors.BAD_REQUEST(getMessage(e))),
  );

export const saneErrorMapper =
  (res: Response) => (error: TechErr | BusinessErr<any>) => async () =>
    match(error)
      .with({ _tag: 'BusinessErr', code: 'BAD_REQUEST' }, ({ message }) =>
        res.status(400).send({ error: message }),
      )
      .with({ _tag: 'BusinessErr', code: 'NOT_FOUND' }, () =>
        res.status(404).send(),
      )
      .with({ _tag: 'BusinessErr', code: 'CONFLICT' }, () =>
        res.status(409).send(),
      )
      .otherwise(() => res.status(500).send({ error: 'server error' }));

export const staticSuccessMapper =
  (code: number) =>
  (res: Response) =>
  <T>(result: T) =>
  async () =>
    res.status(code).send(result);

export const staticSuccessMapperWithContentRange =
  (code: number, unit: string) =>
  (res: Response) =>
  <T extends Array<any>>(result: T) =>
  async () =>
    res
      .set('Access-Control-Expose-Headers', 'Content-Range')
      .set('Content-Range', `${unit} */${result.length}`)
      .status(code)
      .send(result);
