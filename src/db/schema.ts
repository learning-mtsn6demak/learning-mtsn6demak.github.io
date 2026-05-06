import {
  sqliteTable,
  text,
  integer,
  real,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ─── Better Auth Core Tables ────────────────────────────────────────────────
// These tables are required by better-auth. Field names match better-auth expectations.

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  // Custom fields
  role: text("role", { enum: ["siswa", "guru"] }).notNull().default("siswa"),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }),
  updatedAt: integer("updatedAt", { mode: "timestamp" }),
});

// ─── Application Tables ─────────────────────────────────────────────────────

export const subject = sqliteTable("subject", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  description: text("description").notNull(),
  createdBy: text("createdBy").references(() => user.id),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export const chapter = sqliteTable("chapter", {
  id: text("id").primaryKey(),
  subjectId: text("subjectId")
    .notNull()
    .references(() => subject.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  orderIndex: integer("orderIndex").notNull().default(0),
});

export const subChapter = sqliteTable("sub_chapter", {
  id: text("id").primaryKey(),
  chapterId: text("chapterId")
    .notNull()
    .references(() => chapter.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type", { enum: ["text", "pdf", "video"] }).notNull(),
  content: text("content"), // rich text or URL
  duration: text("duration"),
  orderIndex: integer("orderIndex").notNull().default(0),
});

export const materialProgress = sqliteTable("material_progress", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  subChapterId: text("subChapterId")
    .notNull()
    .references(() => subChapter.id, { onDelete: "cascade" }),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  completedAt: integer("completedAt", { mode: "timestamp" }),
});

export const quiz = sqliteTable("quiz", {
  id: text("id").primaryKey(),
  subjectId: text("subjectId")
    .notNull()
    .references(() => subject.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type", { enum: ["pilihan_ganda", "benar_salah", "isian"] }).notNull(),
  timeLimit: integer("timeLimit").notNull(), // in minutes
  createdBy: text("createdBy").references(() => user.id),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export const question = sqliteTable("question", {
  id: text("id").primaryKey(),
  quizId: text("quizId")
    .notNull()
    .references(() => quiz.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  type: text("type", { enum: ["pilihan_ganda", "benar_salah", "isian"] }).notNull(),
  options: text("options"), // JSON array for pilihan_ganda
  correctAnswer: text("correctAnswer").notNull(),
  explanation: text("explanation").notNull(),
  orderIndex: integer("orderIndex").notNull().default(0),
});

export const quizAttempt = sqliteTable("quiz_attempt", {
  id: text("id").primaryKey(),
  quizId: text("quizId")
    .notNull()
    .references(() => quiz.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  maxScore: integer("maxScore").notNull(),
  answers: text("answers"), // JSON: { questionId: userAnswer }
  startedAt: integer("startedAt", { mode: "timestamp" }).notNull(),
  finishedAt: integer("finishedAt", { mode: "timestamp" }).notNull(),
});

export const assignment = sqliteTable("assignment", {
  id: text("id").primaryKey(),
  subjectId: text("subjectId")
    .notNull()
    .references(() => subject.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  deadline: integer("deadline", { mode: "timestamp" }).notNull(),
  maxFileSize: integer("maxFileSize").notNull().default(10), // MB
  allowedFormats: text("allowedFormats").notNull(), // JSON array
  createdBy: text("createdBy").references(() => user.id),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export const submission = sqliteTable("submission", {
  id: text("id").primaryKey(),
  assignmentId: text("assignmentId")
    .notNull()
    .references(() => assignment.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  fileUrl: text("fileUrl"),
  notes: text("notes"),
  status: text("status", {
    enum: ["dikumpulkan", "dinilai", "terlambat"],
  })
    .notNull()
    .default("dikumpulkan"),
  grade: real("grade"),
  feedback: text("feedback"),
  submittedAt: integer("submittedAt", { mode: "timestamp" }).notNull(),
  gradedAt: integer("gradedAt", { mode: "timestamp" }),
});

// ─── Relations ──────────────────────────────────────────────────────────────

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  materialProgress: many(materialProgress),
  quizAttempts: many(quizAttempt),
  submissions: many(submission),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const subjectRelations = relations(subject, ({ many, one }) => ({
  chapters: many(chapter),
  quizzes: many(quiz),
  assignments: many(assignment),
  creator: one(user, { fields: [subject.createdBy], references: [user.id] }),
}));

export const chapterRelations = relations(chapter, ({ one, many }) => ({
  subject: one(subject, { fields: [chapter.subjectId], references: [subject.id] }),
  subChapters: many(subChapter),
}));

export const subChapterRelations = relations(subChapter, ({ one }) => ({
  chapter: one(chapter, { fields: [subChapter.chapterId], references: [chapter.id] }),
}));

export const materialProgressRelations = relations(materialProgress, ({ one }) => ({
  user: one(user, { fields: [materialProgress.userId], references: [user.id] }),
  subChapter: one(subChapter, { fields: [materialProgress.subChapterId], references: [subChapter.id] }),
}));

export const quizRelations = relations(quiz, ({ one, many }) => ({
  subject: one(subject, { fields: [quiz.subjectId], references: [subject.id] }),
  questions: many(question),
  attempts: many(quizAttempt),
}));

export const questionRelations = relations(question, ({ one }) => ({
  quiz: one(quiz, { fields: [question.quizId], references: [quiz.id] }),
}));

export const quizAttemptRelations = relations(quizAttempt, ({ one }) => ({
  quiz: one(quiz, { fields: [quizAttempt.quizId], references: [quiz.id] }),
  user: one(user, { fields: [quizAttempt.userId], references: [user.id] }),
}));

export const assignmentRelations = relations(assignment, ({ one, many }) => ({
  subject: one(subject, { fields: [assignment.subjectId], references: [subject.id] }),
  submissions: many(submission),
  creator: one(user, { fields: [assignment.createdBy], references: [user.id] }),
}));

export const submissionRelations = relations(submission, ({ one }) => ({
  assignment: one(assignment, { fields: [submission.assignmentId], references: [assignment.id] }),
  user: one(user, { fields: [submission.userId], references: [user.id] }),
}));
