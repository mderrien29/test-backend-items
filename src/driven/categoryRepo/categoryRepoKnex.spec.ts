import { either as E, option as O } from 'fp-ts';
import { Knex, knex } from 'knex';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from 'testcontainers';

import { getCategory } from '../../../test/fixtures';
import { errors } from '../../domain/error';
import { CategoryRepo } from '../../usecase/_adapters/categoryRepo';
import { categoryRepoKnex } from './categoryRepoKnex';

// Of course we should do unit tests on every Repo, and on every usecase.
// But don't have enough time to do them properly sadly

describe('CategoryRepoKnex', () => {
  let container: StartedPostgreSqlContainer;
  let db: Knex;
  let repo: CategoryRepo;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:14-alpine').start();

    db = knex({
      client: 'pg',
      connection: `postgres://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getPort()}/${container.getDatabase()}`,
      searchPath: ['public'],
    });

    await db.migrate.latest({
      directory: 'db/migrations',
      extension: 'ts',
    });

    repo = categoryRepoKnex(db, 'category');
  });

  beforeEach(() => db.table('category').delete());

  afterAll(async () => {
    await db.destroy();
    await container.stop();
  });

  it('inserts a new category', async () => {
    // G
    const category = getCategory();

    // W
    await repo.insert(category)();
    const result = await repo.getById(category.id)();

    // T
    expect(result).toStrictEqual(E.right(O.some(category)));
  });

  it('fails with CONFLICT when category already exist', async () => {
    // G
    const category = getCategory();

    // W
    await repo.insert(category)();
    const result = await repo.insert(category)();

    // T
    expect(result).toStrictEqual(E.left(errors.CONFLICT('')));
  });
});
