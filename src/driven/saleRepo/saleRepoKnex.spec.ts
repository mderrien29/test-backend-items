import { either as E, option as O } from 'fp-ts';
import { Knex, knex } from 'knex';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from 'testcontainers';

import { getSale } from '../../../test/fixtures';
import { errors } from '../../domain/error';
import { SaleRepo } from '../../usecase/_adapters/saleRepo';
import { saleRepoKnex } from './saleRepoKnex';

describe('SaleRepoKnex', () => {
  let container: StartedPostgreSqlContainer;
  let db: Knex;
  let repo: SaleRepo;

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

    repo = saleRepoKnex(db, 'sale');
  });

  beforeEach(() => db.table('sale').delete());

  afterAll(async () => {
    await db.destroy();
    await container.stop();
  });

  it('inserts a new sale', async () => {
    // G
    const sale = getSale();

    // W
    await repo.insert(sale)();
    const result = await repo.getById(sale.id)();

    // T
    expect(result).toStrictEqual(E.right(O.some(sale)));
  });

  it('fails with CONFLICT when sale already exist', async () => {
    // G
    const sale = getSale();

    // W
    await repo.insert(sale)();
    const result = await repo.insert(sale)();

    // T
    expect(result).toStrictEqual(E.left(errors.CONFLICT('')));
  });

  it('returns O.none when sale does not exist', async () => {
    // G
    const sale = getSale();

    // W
    const result = await repo.getById(sale.id)();

    // T
    expect(result).toStrictEqual(E.right(O.none));
  });
});
