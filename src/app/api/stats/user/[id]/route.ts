import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET user statistics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    // Total posts by user
    const totalPostsResult = await query(
      'SELECT COUNT(*) as count FROM posts WHERE user_id = ?',
      [userId]
    );

    // Posts created this month
    const monthPostsResult = await query(
      `SELECT COUNT(*) as count FROM posts 
       WHERE user_id = ? AND MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())`,
      [userId]
    );

    // Posts created this week
    const weekPostsResult = await query(
      `SELECT COUNT(*) as count FROM posts 
       WHERE user_id = ? AND WEEK(created_at) = WEEK(NOW()) AND YEAR(created_at) = YEAR(NOW())`,
      [userId]
    );

    // Posts created today
    const todayPostsResult = await query(
      `SELECT COUNT(*) as count FROM posts 
       WHERE user_id = ? AND DATE(created_at) = DATE(NOW())`,
      [userId]
    );

    const stats = {
      total: (totalPostsResult as any)[0]?.count || 0,
      thisMonth: (monthPostsResult as any)[0]?.count || 0,
      thisWeek: (weekPostsResult as any)[0]?.count || 0,
      today: (todayPostsResult as any)[0]?.count || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 }
    );
  }
}
