// of course could be fancier
export const getConfig = () => ({
  port: 3021,
  postgresql_connection_string: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
  table_category: "category",
  table_sale: "sale",
  table_item: "item",
});
