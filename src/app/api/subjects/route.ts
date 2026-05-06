import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subject, chapter, subChapter, materialProgress } from "@/db/schema";
import { eq, and, count, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch all subjects with chapter counts and user progress
  const allSubjects = await db.query.subject.findMany({
    with: {
      chapters: {
        with: {
          subChapters: true,
        },
      },
    },
  });

  // Get user progress for all sub-chapters
  const userProgress = await db
    .select()
    .from(materialProgress)
    .where(
      and(
        eq(materialProgress.userId, session.user.id),
        eq(materialProgress.completed, true)
      )
    );

  const completedIds = new Set(userProgress.map((p) => p.subChapterId));

  const subjectsWithProgress = allSubjects.map((s) => {
    const totalSubChapters = s.chapters.reduce(
      (sum, c) => sum + c.subChapters.length,
      0
    );
    const completedSubChapters = s.chapters.reduce(
      (sum, c) =>
        sum + c.subChapters.filter((sc) => completedIds.has(sc.id)).length,
      0
    );
    const progress =
      totalSubChapters > 0
        ? Math.round((completedSubChapters / totalSubChapters) * 100)
        : 0;

    return {
      id: s.id,
      name: s.name,
      icon: s.icon,
      color: s.color,
      description: s.description,
      chaptersCount: s.chapters.length,
      progress,
    };
  });

  return NextResponse.json(subjectsWithProgress);
}
