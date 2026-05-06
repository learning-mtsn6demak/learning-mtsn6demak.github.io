import Link from "next/link";
import {
  BookOpen,
  PenTool,
  ClipboardList,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { subjects, assignments, grades, quizzes } from "@/lib/data";

export default function DashboardPage() {
  const overallProgress = Math.round(
    subjects.reduce((sum, s) => sum + s.progress, 0) / subjects.length
  );
  const avgScore = Math.round(
    grades.reduce((sum, g) => sum + g.score, 0) / grades.length
  );
  const pendingAssignments = assignments.filter(
    (a) => a.status === "belum"
  ).length;
  const completedQuizzes = quizzes.filter((q) => q.attempts > 0).length;

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Halo, <span className="text-gradient-teal">Ahmad!</span> 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ayo lanjutkan belajarmu hari ini.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
          <Clock className="w-3.5 h-3.5" />
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "Progres Belajar",
            value: `${overallProgress}%`,
            icon: TrendingUp,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Rata-rata Nilai",
            value: avgScore.toString(),
            icon: GraduationCap,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
          },
          {
            label: "Tugas Pending",
            value: pendingAssignments.toString(),
            icon: AlertCircle,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-900/20",
          },
          {
            label: "Kuis Selesai",
            value: `${completedQuizzes}/${quizzes.length}`,
            icon: CheckCircle2,
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-900/20",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="border-border/50 hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progres per Mata Pelajaran */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Progres Mata Pelajaran
            </CardTitle>
            <Link href="/materi">
              <Button variant="ghost" size="sm" className="text-xs text-primary">
                Lihat Semua
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjects.slice(0, 4).map((subject) => (
            <div key={subject.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{subject.name}</span>
                <span className="text-muted-foreground text-xs">
                  {subject.progress}%
                </span>
              </div>
              <Progress value={subject.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions + Tugas Mendatang */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Akses Cepat</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              { label: "Materi", icon: BookOpen, href: "/materi", color: "gradient-teal" },
              { label: "Latihan", icon: PenTool, href: "/latihan", color: "bg-blue-500" },
              { label: "Tugas", icon: ClipboardList, href: "/tugas", color: "bg-amber-500" },
              { label: "Nilai", icon: GraduationCap, href: "/nilai", color: "bg-emerald-500" },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <div className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                  <div
                    className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Tugas Mendatang */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Tugas Mendatang
              </CardTitle>
              <Link href="/tugas">
                <Button variant="ghost" size="sm" className="text-xs text-primary">
                  Semua
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignments
              .filter((a) => a.status === "belum" || a.status === "dikumpulkan")
              .slice(0, 3)
              .map((assignment) => {
                const deadlineDate = new Date(assignment.deadline);
                const isUrgent =
                  deadlineDate.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;
                return (
                  <div
                    key={assignment.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border/40 hover:border-primary/20 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        assignment.status === "dikumpulkan"
                          ? "bg-emerald-500"
                          : isUrgent
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {assignment.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[11px] text-muted-foreground">
                          {deadlineDate.toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <Badge
                          variant={
                            assignment.status === "dikumpulkan"
                              ? "default"
                              : "secondary"
                          }
                          className="text-[10px] h-5"
                        >
                          {assignment.status === "dikumpulkan"
                            ? "Sudah"
                            : "Belum"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </div>

      {/* Nilai Terbaru */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Nilai Terbaru
            </CardTitle>
            <Link href="/nilai">
              <Button variant="ghost" size="sm" className="text-xs text-primary">
                Selengkapnya
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {grades.slice(0, 5).map((grade) => (
              <div
                key={grade.id}
                className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                      grade.score >= 85
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                        : grade.score >= 70
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                        : "bg-red-50 text-red-600 dark:bg-red-900/20"
                    }`}
                  >
                    {grade.score}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{grade.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {grade.subjectName} · {grade.type === "kuis" ? "Kuis" : "Tugas"}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {new Date(grade.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
