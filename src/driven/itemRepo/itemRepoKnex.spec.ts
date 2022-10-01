import { either as E, option as O } from 'fp-ts';
import { Knex, knex } from 'knex';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from 'testcontainers';

import { getItem, getCategory, getSale } from '../../../test/fixtures';
import { errors, errTech } from '../../domain/error';
import { ItemRepo } from '../../usecase/_adapters/itemRepo';
import { itemRepoKnex } from './itemRepoKnex';

describe('ItemRepo', () => {
  let container: StartedPostgreSqlContainer;
  let db: Knex;
  let repo: ItemRepo;

  const category = getCategory();
  const sale = getSale();

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

    await db.table('category').insert(category);
    await db.table('sale').insert(sale);

    repo = itemRepoKnex(db, 'item');
  });

  beforeEach(() => db.table('item').delete());

  afterAll(async () => {
    await db.destroy();
    await container.stop();
  });

  it('inserts a new item', async () => {
    // G
    const item = getItem({ category_id: category.id, sale_id: sale.id });

    // W
    await repo.insert(item)();
    const result = await repo.getById(item.id)();

    // T
    const expected = { ...item, last_updated: expect.any(Date) };
    expect(result).toEqual(E.right(O.some(expected)));
  });

  it('fails to insert with TECH_ERR when category does not exist', async () => {
    // G
    const item = getItem({ sale_id: sale.id });

    // W
    const result = await repo.insert(item)();

    // T
    expect(result).toStrictEqual(E.left(errTech));
  });

  it('fails to insert with TECH_ERR when sale does not exist', async () => {
    // G
    const item = getItem({ category_id: category.id });

    // W
    const result = await repo.insert(item)();

    // T
    expect(result).toStrictEqual(E.left(errTech));
  });

  it('fails to insert with CONFLICT when item already exist', async () => {
    // G
    const item = getItem({ category_id: category.id, sale_id: sale.id });

    // W
    await repo.insert(item)();
    const result = await repo.insert(item)();

    // T
    expect(result).toStrictEqual(E.left(errors.CONFLICT('')));
  });

  it('returns O.none when item does not exist', async () => {
    // G
    const item = getItem();

    // W
    const result = await repo.getById(item.id)();

    // T
    expect(result).toStrictEqual(E.right(O.none));
  });

  it('returns empty array when no items exist', async () => {
    // W
    const result = await repo.getIdsFilterBy({})();

    // T
    expect(result).toStrictEqual(E.right([]));
  });

  it('returns array of ids when items exist', async () => {
    // G
    const item1 = getItem({ category_id: category.id, sale_id: sale.id });
    const item2 = getItem({ category_id: category.id, sale_id: sale.id });
    await repo.insert(item1)();
    await repo.insert(item2)();

    // W
    const result = await repo.getIdsFilterBy({})();

    // T
    expect(result).toStrictEqual(E.right([item1.id, item2.id]));
  });

  it('filters by auction_type', async () => {
    // G
    const item1 = getItem({
      category_id: category.id,
      sale_id: sale.id,
      auction_type: 'live',
    });
    const item2 = getItem({
      category_id: category.id,
      sale_id: sale.id,
      auction_type: 'online',
    });
    await repo.insert(item1)();
    await repo.insert(item2)();

    // W
    const result = await repo.getIdsFilterBy({ auction_type: 'live' })();

    // T
    expect(result).toStrictEqual(E.right([item1.id]));
  });
});
