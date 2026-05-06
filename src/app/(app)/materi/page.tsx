import Link from "next/link";
import {
  BookOpen,
  Calculator,
  Atom,
  Leaf,
  Globe,
  FlaskConical,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { subjects } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Calculator,
  BookOpen,
  Atom,
  Leaf,
  Globe,
  FlaskConical,
};

export default function MateriPage() {
  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Materi <span className="text-gradient-teal">Pembelajaran</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pilih mata pelajaran untuk mulai belajar
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="border-border/50 overflow-hidden">
        <div className="gradient-teal p-5">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-sm opacity-90">Total Progres Belajar</p>
              <p className="text-3xl font-bold mt-1">
                {Math.round(
                  subjects.reduce((sum, s) => sum + s.progress, 0) / subjects.length
                )}
                %
              </p>
            </div>
            <BookOpen className="w-12 h-12 opacity-30" />
          </div>
          <div className="mt-3 bg-white/20 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{
                width: `${Math.round(
                  subjects.reduce((sum, s) => sum + s.progress, 0) / subjects.length
                )}%`,
              }}
            />
          </div>
        </div>
      </Card>

      {/* Subject Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => {
          const IconComponent = iconMap[subject.icon] || BookOpen;
          return (
            <Link key={subject.id} href={`/materi/${subject.id}`}>
              <Card
                id={`subject-${subject.id}`}
                className="group border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center shadow-md shadow-primary/15 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {subject.chaptersCount} Bab
                    </Badge>
                  </div>
                  <h3 className="text-base font-semibold mb-1 group-hover:text-primary transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                    {subject.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progres</span>
                      <span className="font-medium text-primary">
                        {subject.progress}%
                      </span>
                    </div>
                    <Progress value={subject.progress} className="h-1.5" />
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Buka Materi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
