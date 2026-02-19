const mysql = require('mysql2/promise');
require('dotenv').config();

const initializeDatabase = async () => {
  try {
    // Connect to MySQL
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'dailyposts',
      port: process.env.DB_PORT || 3306,
    });

    console.log('Connected to MySQL database');

    // SQL to create the posts table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT NOT NULL,
        content LONGTEXT NOT NULL,
        author VARCHAR(100) DEFAULT 'Daily Post',
        category VARCHAR(50) NOT NULL,
        thumbnail VARCHAR(500) DEFAULT '/images/placeholder-default.jpg',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_category (category),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    // Execute the create table query
    await connection.execute(createTableSQL);
    console.log('✓ Posts table created successfully');

    // Close the connection
    await connection.end();
    console.log('Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  }
};

initializeDatabase();
