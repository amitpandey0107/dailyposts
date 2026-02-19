# Quick Start Guide - Daily Posts Application

## ✅ Completed Setup

Your full-stack blog application is now ready! Here's what has been set up:

### Backend
- ✓ Express.js server (Port 5000)
- ✓ MySQL database connection with connection pooling
- ✓ Complete REST API for CRUD operations
- ✓ Error handling and validation

### Frontend
- ✓ Next.js React application (Port 3001)
- ✓ Homepage displaying all posts
- ✓ Create post page with form
- ✓ Individual post detail pages
- ✓ Responsive design with Tailwind CSS

### Database
- ✓ MySQL `dailyposts` database
- ✓ `posts` table with optimized schema
- ✓ Proper indexes for performance
- ✓ Automatic timestamps (created_at, updated_at)

---

## 🚀 Running the Application

### Step 1: Make sure MySQL is running
On Windows:
```bash
mysql -u root -p
```
Then type your password (or press Enter if no password)

### Step 2: Start the application
From the project root directory:
```bash
npm run dev
```

This will start BOTH servers:
- Backend: http://localhost:5000
- Frontend: http://localhost:3001

### Step 3: Open your browser
Navigate to: `http://localhost:3001`

---

## 📝 Using the Application

### Create a Post
1. Click "Create Post" in the navigation
2. Fill in the form:
   - **Title**: Post title
   - **Excerpt**: Short summary
   - **Content**: Full post content
   - **Author**: Your name (optional)
   - **Category**: Choose from dropdown
   - **Thumbnail**: Image URL (optional)
3. Click "Publish Post"

### View Posts
- **Homepage**: See all posts as thumbnails
- **Post Details**: Click any post to read full content
- **Navigation**: Use "Home" and "Create Post" links

---

## 🗄️ Database Information

**Database Name**: `dailyposts`
**Table Name**: `posts`

### Post Fields
- `id`: Unique identifier
- `title`: Post title
- `slug`: URL-friendly name (auto-generated)
- `excerpt`: Short preview
- `content`: Full content
- `author`: Author name
- `category`: Post category
- `thumbnail`: Image URL
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

---

## 🔧 Useful Commands

```bash
# Start both frontend and backend
npm run dev

# Start only backend
npm run backend

# Start only frontend
npm run frontend

# Initialize database (if needed again)
npm run init-db

# Install dependencies
npm install

# Build for production
npm build

# Check if backend is running
curl http://localhost:5000/health

# Get all posts
curl http://localhost:5000/api/posts

# Create a new post via API
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My Post","excerpt":"Short text","content":"Full content","category":"Technology"}'
```

---

## ⚙️ Configuration (.env.local)

If you need to change database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=dailyposts
DB_PORT=3306
BACKEND_PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🔗 API Endpoints

All endpoints are prefixed with `http://localhost:5000/api/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | Get all posts |
| GET | `/posts/:slug` | Get post by slug |
| POST | `/posts` | Create new post |
| PUT | `/posts/:id` | Update post |
| DELETE | `/posts/:id` | Delete post |

---

## 📱 Features

✅ **Create Posts**: Full form with all post details
✅ **View All Posts**: Homepage with post cards
✅ **Post Details**: Individual post pages
✅ **Database Storage**: All data in MySQL
✅ **Auto-generated Slugs**: URLs created automatically
✅ **Timestamps**: Track when posts are created/updated
✅ **Categories**: Organize posts by category
✅ **Responsive Design**: Works on all devices

---

## 🐛 Troubleshooting

### Posts not showing?
1. Make sure MySQL is running
2. Check backend is running on port 5000
3. Test with: `curl http://localhost:5000/api/posts`

### Can't create posts?
1. Verify database credentials in `.env.local`
2. Check that `posts` table exists
3. Run `npm run init-db` again

### Port already in use?
- Port 3000/3001: Next.js will auto-switch to next available
- Port 5000: Kill process using that port first

---

## 📁 Project Files Created/Modified

**New Files:**
- `server.js` - Express backend server
- `init-db.js` - Database initialization script
- `.env.local` - Environment configuration
- `SETUP_GUIDE.md` - Detailed setup documentation
- `QUICK_START.md` - This file

**Modified Files:**
- `package.json` - Added dependencies and scripts
- `src/app/api/posts/route.ts` - Updated to use backend API
- `src/app/api/posts/[slug]/route.ts` - Updated to use backend API
- `src/app/page.tsx` - Updated date field
- `src/app/posts/[slug]/page.tsx` - Updated date field

---

## ✨ Next Steps (Optional Enhancements)

- Add authentication (login/register)
- Add image upload functionality
- Add search functionality
- Add comment system
- Add post editing
- Add post deletion
- Deploy to production

---

## 💡 Tips

- Slugs are auto-generated from titles (lowercase, hyphens)
- All timestamps are in UTC format
- Posts are sorted by newest first
- Database uses UTF8MB4 for proper Unicode support
- Connection pooling handles multiple requests efficiently

---

## 🎯 Testing Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3001
- [ ] Can view homepage
- [ ] Can click "Create Post"
- [ ] Can fill form and submit
- [ ] Can see post on homepage
- [ ] Can click post and view details
- [ ] Can return to home

---

## 📞 Support

For detailed information, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

Enjoy your Daily Posts application! 🎉
