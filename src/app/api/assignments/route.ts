import { NextResponse } from "next/server";
import { db } from "@/db";
import { submission } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "better-auth/utils";

// GET: Fetch all assignments with user submission status
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allAssignments = await db.query.assignment.findMany({
    with: {
      subject: true,
      submissions: {
        where: (s, { eq }) => eq(s.userId, session.user.id),
      },
    },
    orderBy: (a, { desc }) => [desc(a.deadline)],
  });

  const result = allAssignments.map((a) => {
    const userSubmission = a.submissions[0];
    const now = new Date();
    const isOverdue = new Date(a.deadline) < now;

    let status: string;
    if (userSubmission) {
      status = userSubmission.status;
    } else if (isOverdue) {
      status = "terlambat";
    } else {
      status = "belum";
    }

    return {
      id: a.id,
      subjectId: a.subjectId,
      subjectName: a.subject.name,
      title: a.title,
      description: a.description,
      deadline: a.deadline.toISOString(),
      status,
      grade: userSubmission?.grade ?? undefined,
      feedback: userSubmission?.feedback ?? undefined,
      maxFileSize: a.maxFileSize,
      allowedFormats: JSON.parse(a.allowedFormats),
    };
  });

  return NextResponse.json(result);
}

// POST: Submit an assignment
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { assignmentId, fileUrl, notes } = await request.json();

  if (!assignmentId) {
    return NextResponse.json(
      { error: "assignmentId is required" },
      { status: 400 }
    );
  }

  // Check assignment exists
  const assignmentData = await db.query.assignment.findFirst({
    where: (a, { eq }) => eq(a.id, assignmentId),
  });

  if (!assignmentData) {
    return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
  }

  const now = new Date();
  const isLate = now > new Date(assignmentData.deadline);

  // Check if already submitted
  const existing = await db.query.submission.findFirst({
    where: (s, { eq, and }) =>
      and(eq(s.assignmentId, assignmentId), eq(s.userId, session.user.id)),
  });

  if (existing) {
    // Update submission
    await db
      .update(submission)
      .set({
        fileUrl,
        notes,
        status: isLate ? "terlambat" : "dikumpulkan",
        submittedAt: now,
      })
      .where(eq(submission.id, existing.id));
  } else {
    await db.insert(submission).values({
      id: nanoid(),
      assignmentId,
      userId: session.user.id,
      fileUrl,
      notes,
      status: isLate ? "terlambat" : "dikumpulkan",
      submittedAt: now,
    });
  }

  return NextResponse.json({ success: true });
}
