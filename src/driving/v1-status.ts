import { Handler } from 'express';

export const getStatus: Handler = (_, res) =>
  res.status(200).send({ status: 'OK' });
