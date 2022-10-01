import { Response } from "express";
import { BusinessErr, errors, TechErr } from "../domain/error";
import { match } from "ts-pattern";

export const saneErrorMapper =
  (res: Response) => (error: TechErr | BusinessErr<any>) => async () =>
    match(error)
      .with({ _tag: "BusinessErr", code: "BAD_REQUEST" }, ({ message }) =>
        res.status(400).send({ error: message })
      )
      .with({ _tag: "BusinessErr", code: "NOT_FOUND" }, ({ message }) =>
        res.status(404).send({ error: message })
      )
      .with({ _tag: "BusinessErr", code: "CONFLICT" }, ({ message }) =>
        res.status(409).send({ error: message })
      )
      .otherwise(() => res.status(500).send({ error: "server error" }));

export const staticSuccessMapper =
  (code: number) =>
  (res: Response) =>
  <T>(result: T) =>
  async () =>
    res.status(code).send(result);
