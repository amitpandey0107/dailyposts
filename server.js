const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
    res.status(500).json({ error: 'Failed to fetch posts. Make sure to run "npm run init-db" first.' });
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
    
    if (useMySQL && pool) {
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
    } else {
      // Use JSON file - check if slug exists
      if (postsData.some(p => p.slug === slug)) {
        return res.status(400).json({ error: 'A post with this title already exists' });
      }
      
      const newPost = {
        id: Math.max(0, ...postsData.map(p => p.id || 0)) + 1,
        title,
        slug,
        excerpt,
        content,
        author: author || 'Daily Post',
        category,
        thumbnail: thumbnail || '/images/placeholder-default.jpg',
        date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString().split('T')[0],
      };
      
      postsData.push(newPost);
      // Save to JSON file
      try {
        fs.writeFileSync(postsJsonPath, JSON.stringify({ posts: postsData }, null, 2));
      } catch (e) {
        console.warn('Could not save to posts.json:', e.message);
      }
      
      res.status(201).json(newPost);
    }
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
    
    if (useMySQL && pool) {
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
    } else {
      // Update in JSON data
      const postIndex = postsData.findIndex(p => p.id === parseInt(id));
      if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      postsData[postIndex] = {
        ...postsData[postIndex],
        title: title || postsData[postIndex].title,
        excerpt: excerpt || postsData[postIndex].excerpt,
        content: content || postsData[postIndex].content,
        author: author || postsData[postIndex].author,
        category: category || postsData[postIndex].category,
        thumbnail: thumbnail || postsData[postIndex].thumbnail,
      };
      
      // Save to JSON file
      try {
        fs.writeFileSync(postsJsonPath, JSON.stringify({ posts: postsData }, null, 2));
      } catch (e) {
        console.warn('Could not save to posts.json:', e.message);
      }
      
      res.json({ success: true, message: 'Post updated successfully' });
    }
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (useMySQL && pool) {
      const connection = await pool.getConnection();
      
      const [result] = await connection.query('DELETE FROM posts WHERE id = ?', [id]);
      connection.release();
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      res.json({ success: true, message: 'Post deleted successfully' });
    } else {
      // Delete from JSON data
      const postIndex = postsData.findIndex(p => p.id === parseInt(id));
      if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      postsData.splice(postIndex, 1);
      
      // Save to JSON file
      try {
        fs.writeFileSync(postsJsonPath, JSON.stringify({ posts: postsData }, null, 2));
      } catch (e) {
        console.warn('Could not save to posts.json:', e.message);
      }
      
      res.json({ success: true, message: 'Post deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
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
