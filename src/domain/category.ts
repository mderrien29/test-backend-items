import * as t from "io-ts";

export const Category = t.type({
  id: t.Int,
  name: t.string,
  summary: t.string,
});
export type Category = t.TypeOf<typeof Category>;
