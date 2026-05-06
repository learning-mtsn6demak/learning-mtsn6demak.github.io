import Link from "next/link";
import {
  PenTool,
  Clock,
  Trophy,
  BarChart3,
  ArrowRight,
  Play,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { quizzes, subjects } from "@/lib/data";

export default function LatihanPage() {
  const completedCount = quizzes.filter((q) => q.attempts > 0).length;
  const avgBestScore =
    quizzes.filter((q) => q.bestScore).reduce((sum, q) => sum + (q.bestScore ?? 0), 0) /
    (quizzes.filter((q) => q.bestScore).length || 1);

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Latihan <span className="text-gradient-teal">Soal & Kuis</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Uji pemahamanmu dengan latihan soal interaktif
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Kuis", value: quizzes.length, icon: PenTool },
          { label: "Sudah Dicoba", value: completedCount, icon: CheckCircle2 },
          { label: "Rata-rata Skor", value: Math.round(avgBestScore), icon: Trophy },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4 text-center">
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quiz List */}
      <div className="space-y-3">
        {quizzes.map((quiz) => {
          const subject = subjects.find((s) => s.id === quiz.subjectId);
          const hasAttempted = quiz.attempts > 0;

          return (
            <Link key={quiz.id} href={`/latihan/${quiz.id}`}>
              <Card
                id={`quiz-${quiz.id}`}
                className="group border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge
                          variant="outline"
                          className="text-[10px] shrink-0"
                        >
                          {subject?.name ?? "Umum"}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-[10px] shrink-0"
                        >
                          {quiz.type === "pilihan_ganda"
                            ? "Pilihan Ganda"
                            : quiz.type === "benar_salah"
                            ? "Benar/Salah"
                            : "Isian"}
                        </Badge>
                      </div>
                      <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                        {quiz.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3.5 h-3.5" />
                          {quiz.questionCount} soal
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {quiz.timeLimit} menit
                        </span>
                        {hasAttempted && (
                          <span className="flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5 text-amber-500" />
                            Skor terbaik: {quiz.bestScore}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {hasAttempted ? (
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold ${
                            (quiz.bestScore ?? 0) >= 85
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                              : (quiz.bestScore ?? 0) >= 70
                              ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                              : "bg-red-50 text-red-600 dark:bg-red-900/20"
                          }`}
                        >
                          {quiz.bestScore}
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center shadow-md shadow-primary/15 group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {quiz.attempts > 0
                          ? `${quiz.attempts}x dicoba`
                          : "Belum dicoba"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
