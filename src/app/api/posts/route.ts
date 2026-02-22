import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET all posts
export async function GET() {
  try {
    const posts = await query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title?.trim() || !body.excerpt?.trim() || !body.content?.trim()) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    // Check if slug already exists
    const existing = await query(
      'SELECT id FROM posts WHERE slug = ?',
      [slug]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { error: 'A post with this title already exists' },
        { status: 400 }
      );
    }

    // Insert new post
    const result = await query(
      `INSERT INTO posts (title, slug, excerpt, content, author, category, thumbnail, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.title,
        slug,
        body.excerpt,
        body.content,
        body.author || 'Daily Post',
        body.category,
        body.thumbnail || '/images/placeholder-default.jpg',
        body.user_id || null,
      ]
    );

    return NextResponse.json(
      {
        id: (result as any).insertId,
        title: body.title,
        slug,
        excerpt: body.excerpt,
        content: body.content,
        author: body.author || 'Daily Post',
        category: body.category,
        thumbnail: body.thumbnail || '/images/placeholder-default.jpg',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
