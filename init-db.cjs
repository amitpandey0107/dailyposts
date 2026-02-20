const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
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

    // Load sample posts from JSON file
    const postsJsonPath = path.join(__dirname, 'public', 'data', 'posts.json');
    let postsToInsert = [];
    
    try {
      const jsonContent = fs.readFileSync(postsJsonPath, 'utf8');
      const parsed = JSON.parse(jsonContent);
      postsToInsert = parsed.posts || [];
      console.log(`✓ Loaded ${postsToInsert.length} posts from JSON file`);
    } catch (error) {
      console.warn('Warning: Could not load posts.json file, skipping sample data insertion');
    }

    // Insert sample posts if they don't exist
    for (const post of postsToInsert) {
      try {
        const [existing] = await connection.execute(
          'SELECT id FROM posts WHERE slug = ?',
          [post.slug]
        );
        
        if (existing.length === 0) {
          await connection.execute(
            `INSERT INTO posts (title, slug, excerpt, content, author, category, thumbnail)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              post.title,
              post.slug,
              post.excerpt,
              post.content,
              post.author || 'Daily Post',
              post.category,
              post.thumbnail || '/images/placeholder-default.jpg',
            ]
          );
          console.log(`✓ Inserted post: ${post.title}`);
        }
      } catch (error) {
        console.warn(`Warning: Could not insert post "${post.title}":`, error.message);
      }
    }

    // Close the connection
    await connection.end();
    console.log('✓ Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  }
};

initializeDatabase();
