# Troubleshooting Guide

## Common Issues & Solutions

---

## 🔴 Issue: MySQL Connection Error

### Error Message
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

### Cause
MySQL server is not running or not accessible

### Solution
**Windows:**
```bash
# Check if MySQL is running
services.msc  # Look for MySQL service

# Or start MySQL from command line
mysql -u root -p

# If prompted, enter password
```

**Mac:**
```bash
# Start MySQL with Homebrew
brew services start mysql

# Or manually
/usr/local/mysql/support-files/mysql.server start
```

**Linux:**
```bash
sudo service mysql start
# or
sudo systemctl start mysql
```

### Verification
```bash
# Test connection
mysql -u root -p
# Should show MySQL prompt (mysql>)
```

---

## 🔴 Issue: Port 3000/3001 Already in Use

### Error Message
```
Port 3000 is in use by process XXXX
```

### Cause
Another application is using the port

### Solution
**Windows:**
```bash
# Find process using port
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find process using port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Alternative
Next.js will automatically use port 3001 if 3000 is taken. No action needed.

---

## 🔴 Issue: Backend Port 5000 Already in Use

### Error Message
```
Error: listen EADDRINUSE: address already in use :::5000
```

### Cause
Port 5000 is already in use

### Solution
**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

### Alternative
Change port in `.env.local`:
```env
BACKEND_PORT=5001
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

## 🔴 Issue: Database Not Initialized (No posts table)

### Error Message
```
Error: ENOENT: no such file or directory
Table 'dailyposts.posts' doesn't exist
```

### Cause
Haven't run the database initialization script

### Solution
```bash
npm run init-db
```

You should see:
```
Connected to MySQL database
✓ Posts table created successfully
Database initialization completed
```

---

## 🔴 Issue: No Posts Appearing on Homepage

### Checklist
1. **Is backend running?**
   ```bash
   curl http://localhost:5000/health
   # Should return: {"status":"Backend server is running"}
   ```

2. **Are posts in database?**
   ```bash
   mysql -u root
   USE dailyposts;
   SELECT COUNT(*) FROM posts;
   ```

3. **Can API be accessed?**
   ```bash
   curl http://localhost:5000/api/posts
   # Should return JSON array
   ```

4. **Is frontend running?**
   - Check if Next.js server is running
   - Should see logs in terminal

### Solution Steps
1. Stop all servers: Press `Ctrl+C` in terminals
2. Restart backend: `npm run backend`
3. Restart frontend: `npm run frontend` (in new terminal)
4. Clear browser cache: `Ctrl+Shift+Delete` or `Cmd+Shift+Delete`
5. Reload page

---

## 🔴 Issue: Can't Create Posts

### Checklist
- [x] Required fields filled (Title, Excerpt, Content, Category)
- [x] Browser console shows no errors (`Ctrl+Shift+I`)
- [x] Backend is running
- [x] Database is accessible

### Database Error
```sql
# Check if posts table exists
SHOW TABLES;

# Check table structure
DESCRIBE posts;

# Count posts
SELECT COUNT(*) FROM posts;
```

### Solution
```bash
# Reinitialize database
npm run init-db

# Restart servers
npm run dev
```

---

## 🔴 Issue: "next: command not found"

### Error Message
```
bash: next: command not found
```

### Cause
Trying to run Next.js directly instead of through npm

### Solution
Always use npm scripts:
```bash
# ✅ Correct
npm run frontend

# ❌ Wrong
next dev
```

---

## 🔴 Issue: "Unable to acquire lock at .next/dev/lock"

### Error Message
```
Unable to acquire lock at D:\..\.next\dev\lock
is another instance of next dev running?
```

### Cause
Next.js dev server already running or lock file exists

### Solution
```bash
# Kill any running Next.js processes
# Windows:
taskkill /F /IM node.exe

# Mac/Linux:
pkill node

# Clean Next.js cache
rm -rf .next

# Restart
npm run frontend
```

---

## 🔴 Issue: ".env.local not working"

### Error Message
```
Error: Missing DB_HOST
```

### Cause
Environment variables not loaded

### Solution
1. **Verify file exists**
   ```bash
   ls -la .env.local  # Mac/Linux
   dir .env.local     # Windows
   ```

2. **Check format**
   ```env
   # ✅ Correct format
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   
   # ❌ Wrong format
   DB_HOST = localhost
   DB_USER = root
   ```

3. **Restart servers** after modifying .env.local

4. **Don't use quotes** around values:
   ```env
   # ✅ Correct
   DB_NAME=dailyposts
   
   # ❌ Wrong
   DB_NAME="dailyposts"
   DB_PASSWORD="pass"
   ```

---

## 🔴 Issue: Database Credentials Wrong

### Signs
- Backend won't start
- Posts API returns error
- Database initialization fails

### Fix
Edit `.env.local`:
```env
DB_HOST=localhost
DB_USER=root              # Your MySQL username
DB_PASSWORD=              # Your MySQL password
DB_NAME=dailyposts        # Database name
DB_PORT=3306              # MySQL port (usually 3306)
```

### Verify Credentials
```bash
# Test connection directly
mysql -u root -p
# or if no password:
mysql -u root
```

---

## 🔴 Issue: CORS Error in Browser Console

### Error Message
```
Access to XMLHttpRequest has been blocked by CORS policy
```

### Cause
Backend CORS not properly configured

### Solution
Check `server.js` has:
```javascript
const cors = require('cors');
app.use(cors());
```

If not, update and restart backend.

---

## 🔴 Issue: Slug Already Exists Error

### Error Message
```
A post with this title already exists
```

### Cause
URL slug generated from title matches existing post

### Solution
Use a different title or check database:
```sql
SELECT title, slug FROM posts WHERE slug LIKE '%your-title%';
```

---

## 🔴 Issue: Large Content Not Saving

### Error Message
```
Error: Packet too large
```

### Cause
MySQL max_allowed_packet is too small

### Solution
Increase MySQL packet size:
```sql
SET GLOBAL max_allowed_packet = 16777216;
```

Or in MySQL config file:
```ini
[mysqld]
max_allowed_packet=256M
```

---

## 🔴 Issue: Special Characters in Post

### Problem
Special characters not displaying correctly

### Solution
The database uses UTF8MB4 encoding (includes emoji support)
Should work automatically. If not, restart servers.

---

## 🔴 Issue: Frontend Shows Blank Page

### Checklist
1. **Open browser console** (`F12` → Console)
2. **Look for errors**
3. **Check Network tab** for failed requests
4. **Verify URLs match**:
   - Frontend on 3001
   - Backend on 5000

### Common Issues
- Backend not running
- Wrong API URL in `.env.local`
- JavaScript errors in console

### Fix
```bash
# Restart everything fresh
npm run dev
```

---

## 🔴 Issue: Images Not Loading

### Solution
Ensure image URLs are:
- ✅ Absolute URLs (http://...)
- ✅ Valid and accessible
- ✅ Properly formatted

Or use placeholder images in Next.js public folder

---

## 🔴 Issue: Very Slow Performance

### Causes
1. Database query slow
2. Large number of posts
3. Unindexed searches

### Solutions
```bash
# Restart servers to clear memory
npm run dev

# Check database indexes
SHOW INDEX FROM posts;

# Rebuild if needed
ALTER TABLE posts ADD INDEX idx_slug (slug);
```

---

## 🟡 Issue: Dependencies Change Required

### If you need different MySQL driver
```bash
npm install mysql
npm uninstall mysql2
```

### If you need different ORM
```bash
npm install sequelize  # Or typeorm, prisma, etc.
```

Then update `server.js` accordingly.

---

## ✅ Diagnostic Checklist

**Before reporting issues, verify:**

- [ ] MySQL is running and accessible
- [ ] Database `dailyposts` exists
- [ ] Table `posts` has been created
- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 3001
- [ ] `.env.local` has correct values
- [ ] No port conflicts
- [ ] Browser cache cleared
- [ ] Node modules installed (`npm install`)
- [ ] Dependencies installed (`npm install`)

**Test endpoints:**
```bash
# Backend health
curl http://localhost:5000/health

# Get posts
curl http://localhost:5000/api/posts

# Get single post
curl http://localhost:5000/api/posts/post-slug
```

---

## 📞 Getting Help

### Check Logs
```bash
# Backend logs appear in terminal running npm run backend
# Frontend logs appear in terminal running npm run frontend
```

### Common Error Messages

| Error | Meaning | Fix |
|-------|---------|-----|
| ECONNREFUSED | Can't connect to MySQL | Start MySQL |
| EADDRINUSE | Port already in use | Kill process or change port |
| ENOENT | File/table not found | Run init-db |
| CORS error | Backend blocked | Check CORS config |
| 404 on post | Post doesn't exist | Create post or check slug |
| 500 error | Server error | Check backend logs |

---

## 🚀 Quick Recovery Steps

If everything breaks:

```bash
# 1. Kill all Node processes
taskkill /F /IM node.exe    # Windows
pkill -f node               # Mac/Linux

# 2. Clean up
rm -rf node_modules .next package-lock.json

# 3. Reinstall
npm install

# 4. Reinitialize database
npm run init-db

# 5. Restart
npm run dev
```

---

## 📝 Notes

- Check browser console (`F12`) for JavaScript errors
- Check terminal for server errors
- Always restart servers after changing `.env.local`
- MySQL must be running before starting backend
- Run `npm install` if you change package.json

---

## 🎯 Still Having Issues?

1. **Check all logs** - Terminal output is your friend
2. **Verify prerequisites** - MySQL running, database exists
3. **Test endpoints** - Use curl to test API
4. **Clear cache** - Browser cache can cause issues
5. **Restart everything** - Kill and restart all servers

---

**Last Updated**: February 19, 2026
**Version**: 1.0
**Status**: Complete troubleshooting guide for Daily Posts application
