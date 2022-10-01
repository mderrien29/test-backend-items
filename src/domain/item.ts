import * as t from "io-ts";
import { date } from "io-ts-types";

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
  last_updated: t.union([date, t.undefined]),
});
export type Item = t.TypeOf<typeof Item>;

export const Filter = t.union([
  t.type({
    category_id: Item.props.category_id,
  }),
  t.type({
    sale_id: Item.props.sale_id,
  }),
  t.type({
    auction_type: Item.props.auction_type,
  }),
]);
export type Filter = t.TypeOf<typeof Filter>;
