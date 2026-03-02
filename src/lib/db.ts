import mysql from 'mysql2/promise';

let pool: mysql.Pool;

export async function getPool(): Promise<mysql.Pool> {
  if (!pool) {
    // Use environment variables with fallback to local defaults
    const isProduction = process.env.NODE_ENV === 'production';
    
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'dailyposts',
      port: parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    if (isProduction) {
      console.log(`[DB] Connecting to ${dbConfig.host}:${dbConfig.port}/${dbConfig.database} as ${dbConfig.user}`);
    }

    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

export async function query(sql: string, values?: any[]) {
  const pool = await getPool();
  const connection = await pool.getConnection();
  try {
    const [result] = values 
      ? await connection.execute(sql, values)
      : await connection.execute(sql);
    return result;
  } finally {
    connection.release();
  }
}
