import { NextResponse } from "next/server";
import { db } from "@/db";
import { quizAttempt } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET: Fetch all quizzes with user attempts
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allQuizzes = await db.query.quiz.findMany({
    with: {
      subject: true,
      questions: true,
      attempts: {
        where: (a, { eq }) => eq(a.userId, session.user.id),
        orderBy: (a, { desc }) => [desc(a.finishedAt)],
      },
    },
  });

  const result = allQuizzes.map((q) => {
    const bestAttempt = q.attempts.reduce(
      (best, a) => (a.score > (best?.score ?? 0) ? a : best),
      null as (typeof q.attempts)[0] | null
    );

    return {
      id: q.id,
      subjectId: q.subjectId,
      subjectName: q.subject.name,
      title: q.title,
      type: q.type,
      questionCount: q.questions.length,
      timeLimit: q.timeLimit,
      bestScore:
        bestAttempt && q.questions.length > 0
          ? Math.round((bestAttempt.score / bestAttempt.maxScore) * 100)
          : undefined,
      attempts: q.attempts.length,
    };
  });

  return NextResponse.json(result);
}
