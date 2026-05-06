import { NextResponse } from "next/server";
import { db } from "@/db";
import { materialProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "better-auth/utils";

// POST: Mark a sub-chapter as completed/uncompleted
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subChapterId, completed } = await request.json();

  if (!subChapterId) {
    return NextResponse.json(
      { error: "subChapterId is required" },
      { status: 400 }
    );
  }

  // Check if progress record exists
  const existing = await db.query.materialProgress.findFirst({
    where: (mp, { eq, and }) =>
      and(
        eq(mp.userId, session.user.id),
        eq(mp.subChapterId, subChapterId)
      ),
  });

  if (existing) {
    await db
      .update(materialProgress)
      .set({
        completed: completed ?? true,
        completedAt: completed ? new Date() : null,
      })
      .where(eq(materialProgress.id, existing.id));
  } else {
    await db.insert(materialProgress).values({
      id: nanoid(),
      userId: session.user.id,
      subChapterId,
      completed: completed ?? true,
      completedAt: new Date(),
    });
  }

  return NextResponse.json({ success: true });
}
