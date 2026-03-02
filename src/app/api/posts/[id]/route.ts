import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  created_at?: string;
  thumbnail: string;
}

// GET single post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const posts = await query(
      'SELECT * FROM posts WHERE slug = ?',
      [id]
    );

    if (!Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const post: Post = (posts as any)[0];
    const postWithNumber = {
      ...post,
      post_number: String((post as any).id).padStart(4, '0')
    };
    return NextResponse.json(postWithNumber);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT update post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    if (!body.title?.trim() || !body.excerpt?.trim() || !body.content?.trim()) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    // First, find the post by slug or ID
    const posts = await query(
      'SELECT id FROM posts WHERE slug = ? OR id = ?',
      [id, parseInt(id) || 0]
    );

    if (!Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const postId = (posts as any)[0].id;

    // Update the post
    await query(
      `UPDATE posts SET title = ?, excerpt = ?, content = ?, author = ?, category = ?, thumbnail = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        body.title,
        body.excerpt,
        body.content,
        body.author || "Daily Post",
        body.category,
        body.thumbnail || "/images/placeholder-default.jpg",
        postId
      ]
    );

    // Return updated post
    const updatedPosts = await query(
      'SELECT * FROM posts WHERE id = ?',
      [postId]
    );

    return NextResponse.json((updatedPosts as any)[0]);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First, find the post by slug or ID
    const posts = await query(
      'SELECT id FROM posts WHERE slug = ? OR id = ?',
      [id, parseInt(id) || 0]
    );

    if (!Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const postId = (posts as any)[0].id;

    // Delete the post
    await query('DELETE FROM posts WHERE id = ?', [postId]);

    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
