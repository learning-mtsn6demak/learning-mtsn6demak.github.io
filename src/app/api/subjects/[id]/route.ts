import { NextResponse } from "next/server";
import { db } from "@/db";
import { materialProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const subjectData = await db.query.subject.findFirst({
    where: (s, { eq }) => eq(s.id, id),
    with: {
      chapters: {
        with: {
          subChapters: true,
        },
        orderBy: (c, { asc }) => [asc(c.orderIndex)],
      },
    },
  });

  if (!subjectData) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Get user progress
  const userProgress = await db
    .select()
    .from(materialProgress)
    .where(eq(materialProgress.userId, session.user.id));

  const completedIds = new Set(
    userProgress.filter((p) => p.completed).map((p) => p.subChapterId)
  );

  // Annotate sub-chapters with completion status
  const enrichedChapters = subjectData.chapters.map((ch) => ({
    ...ch,
    subChapters: ch.subChapters.map((sc) => ({
      ...sc,
      completed: completedIds.has(sc.id),
    })),
  }));

  const totalSubs = enrichedChapters.reduce(
    (sum, c) => sum + c.subChapters.length,
    0
  );
  const completedSubs = enrichedChapters.reduce(
    (sum, c) => sum + c.subChapters.filter((sc) => sc.completed).length,
    0
  );

  return NextResponse.json({
    ...subjectData,
    chapters: enrichedChapters,
    progress: totalSubs > 0 ? Math.round((completedSubs / totalSubs) * 100) : 0,
  });
}
