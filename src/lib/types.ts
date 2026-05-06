// Types for the BelajarOnline application

export interface User {
  id: string;
  name: string;
  email: string;
  role: "siswa" | "guru";
  avatar?: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  chaptersCount: number;
  progress: number; // 0-100
  description: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  subChapters: SubChapter[];
}

export interface SubChapter {
  id: string;
  chapterId: string;
  title: string;
  type: "text" | "pdf" | "video";
  duration?: string;
  completed: boolean;
}

export interface Quiz {
  id: string;
  subjectId: string;
  title: string;
  questionCount: number;
  timeLimit: number; // minutes
  bestScore?: number;
  attempts: number;
  type: "pilihan_ganda" | "benar_salah" | "isian";
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: "pilihan_ganda" | "benar_salah" | "isian";
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  deadline: string;
  status: "belum" | "dikumpulkan" | "dinilai" | "terlambat";
  grade?: number;
  feedback?: string;
  maxFileSize: number; // MB
  allowedFormats: string[];
}

export interface Grade {
  id: string;
  subjectId: string;
  subjectName: string;
  type: "kuis" | "tugas";
  title: string;
  score: number;
  maxScore: number;
  date: string;
}
