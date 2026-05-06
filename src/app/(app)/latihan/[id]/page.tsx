"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Home,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { quizzes, questions as allQuestions } from "@/lib/data";

type QuizState = "intro" | "playing" | "result";

export default function QuizDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const quiz = quizzes.find((q) => q.id === id);
  const questions = allQuestions.filter((q) => q.quizId === id);

  const [state, setState] = useState<QuizState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Timer
  useEffect(() => {
    if (state !== "playing" || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setState("result");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state, timeLeft]);

  const startQuiz = useCallback(() => {
    setState("playing");
    setCurrentQuestion(0);
    setAnswers({});
    setShowExplanation(false);
    setTimeLeft((quiz?.timeLimit ?? 15) * 60);
  }, [quiz]);

  if (!quiz) {
    return (
      <div className="px-4 sm:px-6 py-6 max-w-3xl">
        <p className="text-muted-foreground">Kuis tidak ditemukan.</p>
        <Link href="/latihan">
          <Button variant="ghost" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const score = questions.reduce((sum, q) => {
    return sum + (answers[q.id] === q.correctAnswer ? 1 : 0);
  }, 0);

  const scorePercent = Math.round((score / questions.length) * 100);

  // Intro State
  if (state === "intro") {
    return (
      <div className="px-4 sm:px-6 py-6 space-y-6 max-w-3xl">
        <Link href="/latihan">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>

        <Card className="border-border/50 overflow-hidden">
          <div className="gradient-teal p-6 text-white text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-80" />
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <p className="text-sm opacity-80 mt-2">Siap menguji pemahamanmu?</p>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-muted/50 rounded-xl">
                <p className="text-xl font-bold">{questions.length}</p>
                <p className="text-[10px] text-muted-foreground">Soal</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-xl">
                <p className="text-xl font-bold">{quiz.timeLimit}</p>
                <p className="text-[10px] text-muted-foreground">Menit</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-xl">
                <p className="text-xl font-bold">
                  {quiz.bestScore ?? "-"}
                </p>
                <p className="text-[10px] text-muted-foreground">Skor Terbaik</p>
              </div>
            </div>

            <div className="space-y-3 mb-6 text-sm text-muted-foreground">
              <p>📋 Tipe soal: Pilihan ganda</p>
              <p>⏱️ Waktu terbatas — jawab sebelum habis</p>
              <p>📊 Hasil dan pembahasan langsung ditampilkan</p>
            </div>

            <Button
              onClick={startQuiz}
              className="w-full gradient-teal text-white border-0 shadow-md shadow-primary/20"
              size="lg"
              id="btn-start-quiz"
            >
              Mulai Kuis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Result State
  if (state === "result") {
    return (
      <div className="px-4 sm:px-6 py-6 space-y-6 max-w-3xl">
        <Card className="border-border/50 overflow-hidden">
          <div className="gradient-teal p-6 text-white text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-3">
              <span className="text-3xl font-bold">{scorePercent}</span>
            </div>
            <h2 className="text-xl font-bold">Hasil Kuis</h2>
            <p className="text-sm opacity-80 mt-1">
              {score} dari {questions.length} jawaban benar
            </p>
          </div>
          <CardContent className="p-6 space-y-4">
            {/* Score breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-emerald-600">{score}</p>
                <p className="text-[10px] text-muted-foreground">Benar</p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
                <XCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-red-600">
                  {questions.length - score}
                </p>
                <p className="text-[10px] text-muted-foreground">Salah</p>
              </div>
            </div>

            {/* Review answers */}
            <h3 className="font-semibold text-sm mt-6 mb-3">Pembahasan:</h3>
            <div className="space-y-3">
              {questions.map((q, i) => {
                const isCorrect = answers[q.id] === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border ${
                      isCorrect
                        ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-900/10"
                        : "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-900/10"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {i + 1}. {q.text}
                        </p>
                        {!isCorrect && (
                          <p className="text-xs text-red-600 mt-1">
                            Jawabanmu: {answers[q.id] ?? "Tidak dijawab"}
                          </p>
                        )}
                        <p className="text-xs text-emerald-600 mt-1">
                          Jawaban benar: {q.correctAnswer}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          💡 {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={startQuiz}
                className="flex-1 gradient-teal text-white border-0"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
              <Link href="/latihan" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Playing State
  const currentQ = questions[currentQuestion];

  return (
    <div className="px-4 sm:px-6 py-6 space-y-4 max-w-3xl">
      {/* Timer + Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Soal {currentQuestion + 1}/{questions.length}
          </Badge>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono font-medium ${
            timeLeft < 60
              ? "bg-red-50 text-red-600 dark:bg-red-900/20"
              : "bg-muted text-foreground"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <Progress
        value={((currentQuestion + 1) / questions.length) * 100}
        className="h-1.5"
      />

      {/* Question */}
      <Card className="border-border/50">
        <CardContent className="p-5 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-6">
            {currentQ.text}
          </h2>

          <div className="space-y-3">
            {currentQ.options?.map((option, i) => {
              const isSelected = answers[currentQ.id] === option;
              return (
                <button
                  key={i}
                  id={`option-${i}`}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [currentQ.id]: option }))
                  }
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                      : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                        isSelected
                          ? "gradient-teal text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-sm font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          id="btn-prev"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Sebelumnya
        </Button>

        {currentQuestion < questions.length - 1 ? (
          <Button
            onClick={() =>
              setCurrentQuestion((prev) =>
                Math.min(questions.length - 1, prev + 1)
              )
            }
            className="gradient-teal text-white border-0"
            id="btn-next"
          >
            Selanjutnya
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => setState("result")}
            className="gradient-teal text-white border-0"
            id="btn-finish"
          >
            Selesai
            <CheckCircle2 className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Question Navigation Dots */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestion(i)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
              i === currentQuestion
                ? "gradient-teal text-white shadow-md"
                : answers[q.id]
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground hover:bg-primary/5"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
