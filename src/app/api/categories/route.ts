import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface InsertResult {
  insertId: number;
}

// GET all categories
export async function GET() {
  try {
    const categories = await query(
      'SELECT id, name, slug, emoji FROM categories ORDER BY name ASC'
    );
    return NextResponse.json(Array.isArray(categories) ? categories : []);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST new category
export async function POST(request: NextRequest) {
  try {
    const { name, emoji } = await request.json();

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    // Check if category already exists
    const existing = await query(
      'SELECT id FROM categories WHERE slug = ? OR LOWER(name) = LOWER(?)',
      [slug, name]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      );
    }

    // Insert new category
    const result = await query(
      `INSERT INTO categories (name, slug, emoji) VALUES (?, ?, ?)`,
      [name.trim(), slug, emoji || '📌']
    );

    return NextResponse.json(
      {
        id: (result as InsertResult).insertId,
        name: name.trim(),
        slug,
        emoji: emoji || '📌',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
