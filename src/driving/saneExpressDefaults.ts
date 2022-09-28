import { Response } from "express";
import { BusinessErr, errors, TechErr } from "src/domain/error";
import { match } from "ts-pattern";

export const saneErrorMapper =
  (res: Response) => (error: TechErr | BusinessErr<any>) => async () =>
    match(error)
      .with(errors.BAD_REQUEST, () => res.status(400))
      .with(errors.UNAUTHORIZED, () => res.status(401))
      .with(errors.FORBIDDEN, () => res.status(403))
      .with(errors.NOT_FOUND, () => res.status(404))
      .with(errors.CONFLICT, () => res.status(409))
      .otherwise(() => res.status(500));

export const staticSuccessMapper =
  (code: number) =>
  (res: Response) =>
  <T>(result: T) =>
  async () =>
    res.status(code).send(result);
