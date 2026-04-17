import { Pool, type QueryResultRow } from 'pg';

declare global {
  var __chPgPool__: Pool | undefined;
}

function buildPool() {
  const { DATABASE_URL, PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT, NODE_ENV } = process.env;

  if (DATABASE_URL) {
    try {
      const parsed = new URL(DATABASE_URL);
      if (!parsed.protocol.startsWith('postgres')) {
        throw new Error('DATABASE_URL must use postgres:// or postgresql://');
      }

      return new Pool({ connectionString: DATABASE_URL });
    } catch {
      throw new Error(
        'Invalid DATABASE_URL. Expected format: postgresql://username:password@host:port/database?sslmode=require. ' +
          'Your current value is malformed, likely missing password@host.'
      );
    }
  }

  if (PGHOST && PGUSER && PGDATABASE) {
    return new Pool({
      host: PGHOST,
      user: PGUSER,
      password: PGPASSWORD,
      database: PGDATABASE,
      port: PGPORT ? Number(PGPORT) : 5432,
      ssl: NODE_ENV === 'production' || process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
    });
  }

  throw new Error(
    'Database configuration is missing. Set a valid DATABASE_URL, or provide PGHOST, PGUSER, PGPASSWORD, PGDATABASE, and optionally PGPORT.'
  );
}

const pool = globalThis.__chPgPool__ ?? buildPool();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__chPgPool__ = pool;
}

export async function sql<T extends QueryResultRow = QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T[]> {
  const params: unknown[] = [];
  let text = '';

  for (let index = 0; index < strings.length; index += 1) {
    text += strings[index];

    if (index < values.length) {
      params.push(values[index] ?? null);
      text += `$${params.length}`;
    }
  }

  const result = await pool.query<T>(text, params);
  return result.rows;
}
