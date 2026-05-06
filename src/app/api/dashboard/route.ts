import { NextResponse } from "next/server";
import { db } from "@/db";
import { materialProgress, quizAttempt, submission } from "@/db/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET: Aggregated dashboard stats for the current user
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // 1. Overall learning progress
  const allSubjects = await db.query.subject.findMany({
    with: {
      chapters: {
        with: { subChapters: true },
      },
    },
  });

  const userProgress = await db
    .select()
    .from(materialProgress)
    .where(
      and(eq(materialProgress.userId, userId), eq(materialProgress.completed, true))
    );

  const completedIds = new Set(userProgress.map((p) => p.subChapterId));
  let totalSubs = 0;
  let completedSubs = 0;

  const subjectProgress = allSubjects.map((s) => {
    const subs = s.chapters.flatMap((c) => c.subChapters);
    totalSubs += subs.length;
    const done = subs.filter((sc) => completedIds.has(sc.id)).length;
    completedSubs += done;
    return {
      id: s.id,
      name: s.name,
      progress: subs.length > 0 ? Math.round((done / subs.length) * 100) : 0,
    };
  });

  const overallProgress =
    totalSubs > 0 ? Math.round((completedSubs / totalSubs) * 100) : 0;

  // 2. Average grade from quiz attempts
  const allAttempts = await db.query.quizAttempt.findMany({
    where: (a, { eq }) => eq(a.userId, userId),
  });

  const avgScore =
    allAttempts.length > 0
      ? Math.round(
          allAttempts.reduce(
            (sum, a) =>
              sum + (a.maxScore > 0 ? (a.score / a.maxScore) * 100 : 0),
            0
          ) / allAttempts.length
        )
      : 0;

  // 3. Pending assignments
  const allAssignments = await db.query.assignment.findMany({
    with: {
      subject: true,
      submissions: {
        where: (s, { eq }) => eq(s.userId, userId),
      },
    },
    orderBy: (a, { asc }) => [asc(a.deadline)],
  });

  const pendingAssignments = allAssignments
    .filter((a) => a.submissions.length === 0 && new Date(a.deadline) > new Date())
    .map((a) => ({
      id: a.id,
      title: a.title,
      subjectName: a.subject.name,
      deadline: a.deadline.toISOString(),
    }));

  // 4. Quiz completion
  const allQuizzes = await db.query.quiz.findMany();
  const quizIdsAttempted = new Set(allAttempts.map((a) => a.quizId));
  const quizzesCompleted = quizIdsAttempted.size;

  // 5. Recent grades
  const recentAttempts = await db.query.quizAttempt.findMany({
    where: (a, { eq }) => eq(a.userId, userId),
    with: { quiz: { with: { subject: true } } },
    orderBy: (a, { desc }) => [desc(a.finishedAt)],
    limit: 5,
  });

  const recentGrades = recentAttempts.map((a) => ({
    id: a.id,
    title: a.quiz.title,
    subjectName: a.quiz.subject.name,
    score: a.maxScore > 0 ? Math.round((a.score / a.maxScore) * 100) : 0,
    date: a.finishedAt.toISOString(),
    type: "kuis" as const,
  }));

  return NextResponse.json({
    user: {
      name: session.user.name,
      role: (session.user as any).role ?? "siswa",
    },
    stats: {
      overallProgress,
      avgScore,
      pendingCount: pendingAssignments.length,
      quizzesCompleted,
      totalQuizzes: allQuizzes.length,
    },
    subjectProgress,
    pendingAssignments: pendingAssignments.slice(0, 5),
    recentGrades,
  });
}
