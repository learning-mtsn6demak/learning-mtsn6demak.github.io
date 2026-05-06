import { NextResponse } from "next/server";
import { db } from "@/db";
import { quizAttempt } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "better-auth/utils";

// GET: Fetch quiz with questions (no answers for integrity)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const quizData = await db.query.quiz.findFirst({
    where: (q, { eq }) => eq(q.id, id),
    with: {
      subject: true,
      questions: {
        orderBy: (q, { asc }) => [asc(q.orderIndex)],
      },
      attempts: {
        where: (a, { eq }) => eq(a.userId, session.user.id),
        orderBy: (a, { desc }) => [desc(a.finishedAt)],
      },
    },
  });

  if (!quizData) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const bestAttempt = quizData.attempts.reduce(
    (best, a) => (a.score > (best?.score ?? 0) ? a : best),
    null as (typeof quizData.attempts)[0] | null
  );

  return NextResponse.json({
    id: quizData.id,
    title: quizData.title,
    type: quizData.type,
    timeLimit: quizData.timeLimit,
    subjectName: quizData.subject.name,
    bestScore:
      bestAttempt && quizData.questions.length > 0
        ? Math.round((bestAttempt.score / bestAttempt.maxScore) * 100)
        : undefined,
    attempts: quizData.attempts.length,
    questions: quizData.questions.map((q) => ({
      id: q.id,
      text: q.text,
      type: q.type,
      options: q.options ? JSON.parse(q.options) : undefined,
      // Don't send correctAnswer/explanation before submission
    })),
  });
}

// POST: Submit quiz answers
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { answers, startedAt } = await request.json();

  // Fetch quiz with questions to grade
  const quizData = await db.query.quiz.findFirst({
    where: (q, { eq }) => eq(q.id, id),
    with: { questions: true },
  });

  if (!quizData) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Grade the quiz
  let score = 0;
  const results = quizData.questions.map((q) => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correctAnswer;
    if (isCorrect) score++;
    return {
      questionId: q.id,
      text: q.text,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
    };
  });

  // Save attempt
  const now = new Date();
  await db.insert(quizAttempt).values({
    id: nanoid(),
    quizId: id,
    userId: session.user.id,
    score,
    maxScore: quizData.questions.length,
    answers: JSON.stringify(answers),
    startedAt: startedAt ? new Date(startedAt) : now,
    finishedAt: now,
  });

  return NextResponse.json({
    score,
    maxScore: quizData.questions.length,
    scorePercent: Math.round((score / quizData.questions.length) * 100),
    results,
  });
}
