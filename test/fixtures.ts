import { function as fp } from "fp-ts";
import { faker } from "@faker-js/faker";
import { Category } from "src/domain/category";

type Seed<T> = Partial<Record<keyof T, any>>;

export const getCategory = (s?: Seed<Category>) =>
  fp.pipe({
    id: faker.helpers.unique(faker.datatype.number),
    name: faker.random.word(),
    summary: faker.random.words(10),
    ...(s ?? {}),
  });
