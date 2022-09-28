// of course could be fancier
export const getConfig = () => ({
  port: 3021,
  postgresql_connection_string:
    "postgres://username:password@localhost:5432/test",
  table_category: "category",
  table_sale: "sale",
  table_item: "item",
});
