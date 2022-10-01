import { faker } from '@faker-js/faker';
import { function as fp } from 'fp-ts';

import { Category } from '../src/domain/category';
import { Item } from '../src/domain/item';
import { Sale } from '../src/domain/sale';

type Seed<T> = Partial<Record<keyof T, any>>;

export const getCategory = (s?: Seed<Category>) =>
  fp.pipe({
    id: faker.helpers.unique(faker.datatype.number),
    name: faker.random.word(),
    summary: faker.random.words(10),
    ...(s ?? {}),
  });

export const getSale = (s?: Seed<Sale>) =>
  fp.pipe({
    id: faker.helpers.unique(faker.datatype.number),
    name: faker.random.word(),
    ...(s ?? {}),
  });

export const getItem = (s?: Seed<Item>) =>
  fp.pipe({
    id: faker.helpers.unique(faker.datatype.number),
    category_id: getCategory().id,
    sale_id: getSale().id,
    description: faker.random.words(20),
    auction_type: faker.helpers.arrayElement(['live', 'online']),
    pricing: {
      estimates: {
        min: faker.datatype.number(100),
        max: faker.datatype.number({ min: 1000, max: 10000 }),
        currency: 'euro',
      },
    },
    last_updated: undefined,
    ...(s ?? {}),
  });
