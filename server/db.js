import DataLoader from 'dataloader';
import knex from 'knex';

export const db = knex({
  client: 'better-sqlite3',
  connection: {
    filename: './data/db.sqlite3',
  },
  useNullAsDefault: true,
});

db.on('query', ({ sql, bindings }) => {
  // console
});

export function createompanyLoader() {
  return new DataLoader(async (companyIds) => {
    console.log('[companyLoader] companyIds', companyIds);
    const companies = await db.select().from('companies').whereIn('id', companyIds);
    return companyIds.map((companId) => {
      return companies.find((company) => company.id === companyId);
    });
  });
}

