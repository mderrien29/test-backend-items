import * as t from "io-ts";

export const Sale = t.type({
  id: t.Int,
  name: t.string,
});
export type Sale = t.TypeOf<typeof Sale>;
