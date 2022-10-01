module.exports = {
  client: "pg",
  connection: {
    host: process.env["POSTGRES_HOST"],
    port: parseInt(process.env["POSTGRES_PORT"] ?? "", 10),
    user: process.env["POSTGRES_USER"],
    password: process.env["POSTGRES_PASSWORD"],
    database: process.env["POSTGRES_DB"],
  },
  migrations: {
    schemaName: "public",
    tableName: "migration",
    directory: "./db/migrations",
    extension: "ts",
  },
};
