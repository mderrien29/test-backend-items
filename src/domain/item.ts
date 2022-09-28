import * as t from "io-ts";

import { Category } from "./category";
import { Sale } from "./sale";

export const Item = t.type({
  id: t.Int,
  category_id: Category.props.id,
  sale_id: Sale.props.id,
  description: t.string,
  auction_type: t.union([t.literal("live"), t.literal("online")]),
  pricing: t.type({
    estimates: t.type({
      max: t.Int,
      min: t.Int,
      currency: t.literal("euro"), // should use ISO-4217 instead
    }),
  }),
});
export type Item = t.TypeOf<typeof Item>;
