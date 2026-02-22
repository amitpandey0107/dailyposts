import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// POST bulk upload CSV
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Only CSV files are allowed" },
        { status: 400 }
      );
    }

    const text = await file.text();
    const lines = text.trim().split("\n");

    if (lines.length < 2) {
      return NextResponse.json(
        { error: "CSV file must contain headers and at least one row" },
        { status: 400 }
      );
    }

    // Parse headers
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const titleIdx = headers.indexOf("title");
    const excerptIdx = headers.indexOf("excerpt");
    const contentIdx = headers.indexOf("content");
    const authorIdx = headers.indexOf("author");
    const categoryIdx = headers.indexOf("category");
    const thumbnailIdx = headers.indexOf("thumbnail");

    if (titleIdx === -1 || excerptIdx === -1 || contentIdx === -1 || categoryIdx === -1) {
      return NextResponse.json(
        { error: "CSV must contain title, excerpt, content, and category columns" },
        { status: 400 }
      );
    }

    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    // Parse and insert rows
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(",").map((v) => v.trim());

        const title = values[titleIdx];
        const excerpt = values[excerptIdx];
        const content = values[contentIdx];
        const author = authorIdx !== -1 ? values[authorIdx] : "Daily Post";
        const category = values[categoryIdx];
        const thumbnail = thumbnailIdx !== -1 ? values[thumbnailIdx] : "/images/placeholder-default.jpg";

        if (!title || !excerpt || !content || !category) {
          errors.push(`Row ${i + 1}: Missing required fields`);
          failed++;
          continue;
        }

        // Generate slug
        const slug = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");

        // Check if slug exists
        const existing = await query("SELECT id FROM posts WHERE slug = ?", [slug]);

        if (Array.isArray(existing) && existing.length > 0) {
          errors.push(`Row ${i + 1}: Title already exists`);
          failed++;
          continue;
        }

        // Insert post
        await query(
          `INSERT INTO posts (title, slug, excerpt, content, author, category, thumbnail)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [title, slug, excerpt, content, author, category, thumbnail]
        );

        imported++;
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : "Unknown error"}`);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      failed,
      total: lines.length - 1,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error bulk uploading posts:", error);
    return NextResponse.json(
      { error: "Failed to bulk upload posts" },
      { status: 500 }
    );
  }
}
