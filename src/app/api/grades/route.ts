import { NextResponse } from "next/server";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET: Fetch all grades (quiz attempts + graded submissions) for the user
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch quiz attempts
  const quizAttempts = await db.query.quizAttempt.findMany({
    where: (a, { eq }) => eq(a.userId, session.user.id),
    with: {
      quiz: {
        with: { subject: true },
      },
    },
    orderBy: (a, { desc }) => [desc(a.finishedAt)],
  });

  // Fetch graded submissions
  const gradedSubmissions = await db.query.submission.findMany({
    where: (s, { eq, and, isNotNull }) =>
      and(eq(s.userId, session.user.id), eq(s.status, "dinilai")),
    with: {
      assignment: {
        with: { subject: true },
      },
    },
    orderBy: (s, { desc }) => [desc(s.gradedAt)],
  });

  // Combine into unified grades list
  const grades = [
    ...quizAttempts.map((a) => ({
      id: a.id,
      subjectId: a.quiz.subjectId,
      subjectName: a.quiz.subject.name,
      type: "kuis" as const,
      title: a.quiz.title,
      score: a.maxScore > 0 ? Math.round((a.score / a.maxScore) * 100) : 0,
      maxScore: 100,
      date: a.finishedAt.toISOString(),
    })),
    ...gradedSubmissions.map((s) => ({
      id: s.id,
      subjectId: s.assignment.subjectId,
      subjectName: s.assignment.subject.name,
      type: "tugas" as const,
      title: s.assignment.title,
      score: s.grade ?? 0,
      maxScore: 100,
      date: (s.gradedAt ?? s.submittedAt).toISOString(),
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json(grades);
}
