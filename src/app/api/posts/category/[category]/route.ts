import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET posts by category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    // Decode category name (convert URL slug to actual category)
    const categoryName = decodeURIComponent(category).replace(/-/g, " ");

    const posts = await query(
      'SELECT * FROM posts WHERE LOWER(category) = LOWER(?) ORDER BY created_at DESC',
      [categoryName]
    );

    if (!Array.isArray(posts)) {
      return NextResponse.json({ error: "No posts found" }, { status: 404 });
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
