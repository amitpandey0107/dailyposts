# Daily Posts - Full Stack Application

A complete full-stack blog application built with Next.js frontend and Express.js backend with MySQL database.

## Features

✅ **Create Posts**: Add new blog posts with title, excerpt, content, author, category, and thumbnail
✅ **Homepage**: Display all posts as card thumbnails sorted by newest first
✅ **Post Detail Page**: View full post content when clicking on thumbnail
✅ **MySQL Database**: All data persisted in MySQL database
✅ **Categories**: Posts organized by multiple categories
✅ **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- **Node.js** (v20 or higher)
- **MySQL Server** (running on localhost:3306)
- **phpMyAdmin** (or any MySQL management tool)
- A database named `dailyposts` created in MySQL

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

This will install:
- **Next.js**: React framework for frontend
- **Express.js**: Backend server for API
- **mysql2**: MySQL database driver
- **cors**: For cross-origin requests
- **dotenv**: Environment variable management
- **concurrently**: Run multiple commands simultaneously

### 2. Configure Database Connection

Edit the `.env.local` file in the project root:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=        # Leave empty if no password
DB_NAME=dailyposts
DB_PORT=3306

# Server Configuration
BACKEND_PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Update these values based on your MySQL setup:**
- `DB_USER`: Your MySQL username (default: root)
- `DB_PASSWORD`: Your MySQL password (leave empty if none)
- `DB_HOST`: MySQL server address (default: localhost)
- `DB_PORT`: MySQL server port (default: 3306)

### 3. Initialize Database Table

Run this command to create the `posts` table in your MySQL database:

```bash
npm run init-db
```

**Expected Output:**
```
Connected to MySQL database
✓ Posts table created successfully
Database initialization completed
```

This creates a `posts` table with the following structure:
- **id**: Primary key (auto-increment)
- **title**: Post title
- **slug**: URL-friendly slug generated from title
- **excerpt**: Short post preview
- **content**: Full post content
- **author**: Post author name
- **category**: Post category
- **thumbnail**: Post thumbnail image URL
- **created_at**: Timestamp when post was created
- **updated_at**: Timestamp when post was last updated

## Running the Application

### Development Mode (Both Frontend & Backend)

```bash
npm run dev
```

This will start:
- **Backend Server**: http://localhost:5000
- **Frontend Application**: http://localhost:3001 (or 3000 if available)

### Individual Servers

**Start Backend Only:**
```bash
npm run backend
```

**Start Frontend Only:**
```bash
npm run frontend
```

## Project Structure

```
dailypost/
├── server.js                          # Express backend server
├── init-db.js                         # Database initialization script
├── .env.local                         # Environment configuration
├── package.json                       # Project dependencies
├── src/
│   └── app/
│       ├── page.tsx                   # Homepage - Lists all posts
│       ├── layout.tsx                 # Root layout
│       ├── api/
│       │   └── posts/
│       │       ├── route.ts           # GET/POST posts endpoints
│       │       └── [slug]/
│       │           └── route.ts       # GET single post by slug
│       └── posts/
│           ├── new/
│           │   └── page.tsx           # Create new post page
│           └── [slug]/
│               └── page.tsx           # Post detail page
├── public/
│   └── data/
│       └── posts.json                 # (Legacy - now using MySQL)
└── README.md                          # This file
```

## API Endpoints

### Backend API (Express)

All endpoints are at `http://localhost:5000/api/`

#### GET /api/posts
Get all posts (sorted by newest first)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Post Title",
    "slug": "post-title",
    "excerpt": "Post excerpt...",
    "content": "Full post content...",
    "author": "Author Name",
    "category": "Technology",
    "thumbnail": "/images/post.jpg",
    "created_at": "2026-02-19T10:30:00.000Z",
    "updated_at": "2026-02-19T10:30:00.000Z"
  }
]
```

#### GET /api/posts/:slug
Get a single post by slug

#### POST /api/posts
Create a new post

**Request Body:**
```json
{
  "title": "New Post",
  "excerpt": "Short description",
  "content": "Full content here",
  "author": "Your Name",
  "category": "Technology",
  "thumbnail": "/images/optional-image.jpg"
}
```

#### PUT /api/posts/:id
Update a post (by ID)

#### DELETE /api/posts/:id
Delete a post

## Using the Application

### 1. View Homepage
Navigate to `http://localhost:3001` to see all posts

### 2. Create a New Post
1. Click "Create Post" in the navigation menu
2. Fill in the form:
   - **Title**: Post title (will auto-generate URL slug)
   - **Excerpt**: Short preview text
   - **Content**: Full post content
   - **Author**: Author name (defaults to "Daily Post")
   - **Category**: Select from available categories
   - **Thumbnail**: Optional image URL
3. Click "Publish Post"
4. You'll be redirected to the new post page

### 3. Read a Post
1. From homepage, click on any post thumbnail or "Read More"
2. View full post content with author, date, and category
3. Click "Back to Home" to return to homepage

## Database Details

### MySQL Posts Table Schema

```sql
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
```

## Available Categories

- Technology
- Governance
- Security
- AI & Future
- Business
- Media & Society

## Troubleshooting

### Port Already in Use

If port 3000 or 3001 is in use, Next.js will automatically use the next available port.

To check running processes:
```bash
# Windows only:
netstat -ano | findstr :3000
```

### Database Connection Error

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution:**
1. Verify MySQL is running
2. Check credentials in `.env.local`
3. Ensure database `dailyposts` exists:
   ```sql
   CREATE DATABASE IF NOT EXISTS dailyposts;
   ```
4. Run init-db again:
   ```bash
   npm run init-db
   ```

### No Posts Appearing

1. Verify backend is running on port 5000
2. Check database connection with health endpoint:
   ```bash
   curl http://localhost:5000/health
   ```
3. Verify posts table exists:
   ```bash
   mysql -u root dailyposts -e "SHOW TABLES;"
   ```

## Technology Stack

- **Frontend**: Next.js 16.1.6, React 19.2.3, TypeScript, Tailwind CSS
- **Backend**: Express.js 4.18.2, Node.js
- **Database**: MySQL 8.0
- **Build Tools**: Next.js Build, TypeScript Compiler

## Environment Variables

```env
# Database Configuration
DB_HOST=localhost           # MySQL host
DB_USER=root               # MySQL username
DB_PASSWORD=               # MySQL password
DB_NAME=dailyposts         # Database name
DB_PORT=3306               # MySQL port

# Application Configuration
BACKEND_PORT=5000          # Express server port
NEXT_PUBLIC_API_URL=http://localhost:5000  # Backend API URL
```

## Scripts

```bash
npm run dev          # Start both backend and frontend concurrently
npm run backend      # Start Express backend only
npm run frontend     # Start Next.js frontend only
npm run build        # Build Next.js application for production
npm run lint         # Run ESLint
npm run init-db      # Initialize MySQL database and create tables
npm start            # Start production backend
```

## Notes

- The application uses MySQL Timestamps for `created_at` and `updated_at` fields
- Posts are automatically sorted by newest first on homepage
- URL slugs are automatically generated from post titles (lowercase, hyphens)
- Slugs must be unique (prevents duplicate post titles)
- All database responses are automatically cached to improve performance

## Support

For issues or questions, check:
1. MySQL is running and accessible
2. Environment variables are correctly set in `.env.local`
3. All dependencies are installed: `npm install`
4. Database initialized: `npm run init-db`
5. Both servers are running in separate terminals

## License

MIT License - Feel free to use this project for learning and development.
