import express from "express";

import { getConfig } from "./infra/config";

const config = getConfig();

const app = express();

app.get("/v1/status", (_, res) => res.status(200).send({ status: "OK" }));

app.listen(config.port);
