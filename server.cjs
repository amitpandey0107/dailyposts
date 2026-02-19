const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${timestamp}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dailyposts',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'Backend server is running' });
});

// POST image upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      imageUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// GET all posts
app.get('/api/posts', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [posts] = await connection.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    connection.release();
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET single post by slug
app.get('/api/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const connection = await pool.getConnection();
    const [posts] = await connection.query(
      'SELECT * FROM posts WHERE slug = ?',
      [slug]
    );
    connection.release();
    
    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(posts[0]);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST new post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, excerpt, content, author, category, thumbnail } = req.body;
    
    // Validate required fields
    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    const connection = await pool.getConnection();
    
    // Check if slug already exists
    const [existing] = await connection.query(
      'SELECT id FROM posts WHERE slug = ?',
      [slug]
    );
    
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'A post with this title already exists' });
    }
    
    // Insert new post
    const [result] = await connection.query(
      `INSERT INTO posts (title, slug, excerpt, content, author, category, thumbnail)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        excerpt,
        content,
        author || 'Daily Post',
        category,
        thumbnail || '/images/placeholder-default.jpg',
      ]
    );
    
    connection.release();
    
    res.status(201).json({
      id: result.insertId,
      title,
      slug,
      excerpt,
      content,
      author: author || 'Daily Post',
      category,
      thumbnail: thumbnail || '/images/placeholder-default.jpg',
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// PUT update post
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, author, category, thumbnail } = req.body;
    
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      `UPDATE posts 
       SET title = ?, excerpt = ?, content = ?, author = ?, category = ?, thumbnail = ? 
       WHERE id = ?`,
      [title, excerpt, content, author, category, thumbnail, id]
    );
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ success: true, message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    const [result] = await connection.query('DELETE FROM posts WHERE id = ?', [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// POST bulk upload posts from CSV
app.post('/api/bulk-upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    
    const Papa = require('papaparse');
    const fileContent = req.file.buffer.toString('utf-8');
    
    const results = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });
    
    if (results.errors.length > 0) {
      return res.status(400).json({ error: 'Invalid CSV format', details: results.errors });
    }
    
    const posts = results.data;
    const connection = await pool.getConnection();
    let successCount = 0;
    const errors = [];
    
    for (let i = 0; i < posts.length; i++) {
      try {
        const post = posts[i];
        const { title, excerpt, content, author, category, thumbnail } = post;
        
        if (!title || !excerpt || !content || !category) {
          errors.push(`Row ${i + 2}: Missing required fields`);
          continue;
        }
        
        const slug = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        
        const [existing] = await connection.query(
          'SELECT id FROM posts WHERE slug = ?',
          [slug]
        );
        
        if (existing.length > 0) {
          errors.push(`Row ${i + 2}: Post with this title already exists`);
          continue;
        }
        
        await connection.query(
          `INSERT INTO posts (title, slug, excerpt, content, author, category, thumbnail)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            title,
            slug,
            excerpt,
            content,
            author || 'Satish Mehta',
            category,
            thumbnail || '/images/placeholder-default.jpg',
          ]
        );
        
        successCount++;
      } catch (err) {
        errors.push(`Row ${i + 2}: ${err.message}`);
      }
    }
    
    connection.release();
    
    res.json({
      success: true,
      message: `Successfully imported ${successCount} posts`,
      successCount,
      errors,
    });
  } catch (error) {
    console.error('Error bulk uploading posts:', error);
    res.status(500).json({ error: 'Failed to bulk upload posts' });
  }
});

// Error handling middleware
app.use((err, req, res) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  pool.end(() => {
    console.log('Connection pool closed');
    process.exit(0);
  });
});
