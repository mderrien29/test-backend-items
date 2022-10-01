import { taskEither as TE, function as fp } from "fp-ts";
import { Response } from "express";
import { BusinessErr, errors, TechErr } from "../domain/error";
import { match } from "ts-pattern";
import { Validation } from "io-ts";
import { getMessage } from "./reporter";

export const validate = <A>(
  decode: (v: unknown) => Validation<A>
): ((v: unknown) => TE.TaskEither<BusinessErr<"BAD_REQUEST">, A>) =>
  fp.flow(
    decode,
    TE.fromEither,
    TE.mapLeft((e) => errors.BAD_REQUEST(getMessage(e)))
  );

export const saneErrorMapper =
  (res: Response) => (error: TechErr | BusinessErr<any>) => async () =>
    match(error)
      .with({ _tag: "BusinessErr", code: "BAD_REQUEST" }, ({ message }) =>
        res.status(400).send({ error: message })
      )
      .with({ _tag: "BusinessErr", code: "NOT_FOUND" }, () =>
        res.status(404).send()
      )
      .with({ _tag: "BusinessErr", code: "CONFLICT" }, () =>
        res.status(409).send()
      )
      .otherwise(() => res.status(500).send({ error: "server error" }));

export const staticSuccessMapper =
  (code: number) =>
  (res: Response) =>
  <T>(result: T) =>
  async () =>
    res.status(code).send(result);

export const contentRangeMapper =
  (resource: string) => (res: Response) => (result: number) => async () =>
    res
      .set("Access-Control-Expose-Headers", "Content-Range")
      .set("Content-Range", `${resource} */${result}`)
      .status(200)
      .send();
