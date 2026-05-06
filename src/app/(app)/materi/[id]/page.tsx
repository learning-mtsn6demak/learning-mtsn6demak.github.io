import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Video,
  File,
  CheckCircle2,
  Circle,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { subjects, chapters } from "@/lib/data";

const typeIcons = {
  text: FileText,
  pdf: File,
  video: Video,
};

const typeLabels = {
  text: "Teks",
  pdf: "PDF",
  video: "Video",
};

export default async function SubjectDetailPage(props: PageProps<'/materi/[id]'>) {
  const { id } = await props.params;
  const subject = subjects.find((s) => s.id === id);
  const subjectChapters = chapters.filter((c) => c.subjectId === id);

  if (!subject) {
    return (
      <div className="px-4 sm:px-6 py-6 max-w-5xl">
        <p className="text-muted-foreground">Mata pelajaran tidak ditemukan.</p>
        <Link href="/materi">
          <Button variant="ghost" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
      </div>
    );
  }

  const totalSubs = subjectChapters.reduce(
    (sum, c) => sum + c.subChapters.length,
    0
  );
  const completedSubs = subjectChapters.reduce(
    (sum, c) => sum + c.subChapters.filter((sc) => sc.completed).length,
    0
  );

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-5xl">
      {/* Back */}
      <Link href="/materi">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Materi
        </Button>
      </Link>

      {/* Subject Header */}
      <Card className="border-border/50 overflow-hidden">
        <div className="gradient-teal p-6">
          <div className="flex items-start justify-between">
            <div className="text-white">
              <h1 className="text-2xl font-bold">{subject.name}</h1>
              <p className="text-sm opacity-80 mt-1">{subject.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <span>{subject.chaptersCount} Bab</span>
                <span>·</span>
                <span>
                  {completedSubs}/{totalSubs} Sub-bab selesai
                </span>
              </div>
            </div>
            <BookOpen className="w-14 h-14 opacity-20 hidden sm:block" />
          </div>
          <div className="mt-4 bg-white/20 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${subject.progress}%` }}
            />
          </div>
          <p className="text-white/80 text-xs mt-2">{subject.progress}% selesai</p>
        </div>
      </Card>

      {/* Chapters */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Daftar Bab</h2>
        {subjectChapters.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Belum ada materi untuk mata pelajaran ini.
              </p>
            </CardContent>
          </Card>
        ) : (
          subjectChapters.map((chapter) => {
            const chapterComplete = chapter.subChapters.filter(
              (sc) => sc.completed
            ).length;
            const chapterTotal = chapter.subChapters.length;

            return (
              <Card
                key={chapter.id}
                className="border-border/50 overflow-hidden"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{chapter.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {chapterComplete}/{chapterTotal} sub-bab selesai
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        chapterComplete === chapterTotal ? "default" : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {chapterComplete === chapterTotal ? "Selesai" : "Dalam Progres"}
                    </Badge>
                  </div>

                  <Separator className="my-4" />

                  {/* Sub-chapters */}
                  <div className="space-y-2">
                    {chapter.subChapters.map((sub) => {
                      const TypeIcon = typeIcons[sub.type];
                      return (
                        <div
                          key={sub.id}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                        >
                          {sub.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0 group-hover:text-primary/50 transition-colors" />
                          )}
                          <TypeIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {sub.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant="outline" className="text-[10px]">
                              {typeLabels[sub.type]}
                            </Badge>
                            {sub.duration && (
                              <span className="text-[10px] text-muted-foreground">
                                {sub.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
