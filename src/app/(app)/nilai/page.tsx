"use client";

import { useState, useMemo } from "react";
import {
  GraduationCap,
  TrendingUp,
  Award,
  BarChart3,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { grades, subjects } from "@/lib/data";

export default function NilaiPage() {
  const [subjectFilter, setSubjectFilter] = useState("semua");
  const [typeFilter, setTypeFilter] = useState("semua");

  const filteredGrades = useMemo(() => {
    return grades.filter((g) => {
      if (subjectFilter !== "semua" && g.subjectId !== subjectFilter) return false;
      if (typeFilter !== "semua" && g.type !== typeFilter) return false;
      return true;
    });
  }, [subjectFilter, typeFilter]);

  const avgScore = useMemo(() => {
    if (filteredGrades.length === 0) return 0;
    return Math.round(
      filteredGrades.reduce((sum, g) => sum + g.score, 0) / filteredGrades.length
    );
  }, [filteredGrades]);

  const highestScore = useMemo(() => {
    if (filteredGrades.length === 0) return 0;
    return Math.max(...filteredGrades.map((g) => g.score));
  }, [filteredGrades]);

  const lowestScore = useMemo(() => {
    if (filteredGrades.length === 0) return 0;
    return Math.min(...filteredGrades.map((g) => g.score));
  }, [filteredGrades]);

  // Grade distribution data for the visual chart
  const gradeDistribution = useMemo(() => {
    const dist = { A: 0, B: 0, C: 0, D: 0 };
    filteredGrades.forEach((g) => {
      if (g.score >= 85) dist.A++;
      else if (g.score >= 70) dist.B++;
      else if (g.score >= 55) dist.C++;
      else dist.D++;
    });
    return dist;
  }, [filteredGrades]);

  // Per-subject averages
  const subjectAverages = useMemo(() => {
    const map = new Map<string, { total: number; count: number; name: string }>();
    grades.forEach((g) => {
      const existing = map.get(g.subjectId) || {
        total: 0,
        count: 0,
        name: g.subjectName,
      };
      existing.total += g.score;
      existing.count++;
      map.set(g.subjectId, existing);
    });
    return Array.from(map.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      average: Math.round(data.total / data.count),
    }));
  }, []);

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Rekap <span className="text-gradient-teal">Nilai</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pantau perkembangan akademikmu
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Rata-rata",
            value: avgScore,
            icon: BarChart3,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Nilai Tertinggi",
            value: highestScore,
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
          },
          {
            label: "Nilai Terendah",
            value: lowestScore,
            icon: Award,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-900/20",
          },
          {
            label: "Total Penilaian",
            value: filteredGrades.length,
            icon: GraduationCap,
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-900/20",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grade Distribution Bar Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Distribusi Nilai
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-32">
            {Object.entries(gradeDistribution).map(([grade, count]) => {
              const maxCount = Math.max(
                ...Object.values(gradeDistribution),
                1
              );
              const height = (count / maxCount) * 100;
              const colors = {
                A: "gradient-teal",
                B: "bg-blue-500",
                C: "bg-amber-500",
                D: "bg-red-400",
              };
              return (
                <div
                  key={grade}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <span className="text-xs font-bold">{count}</span>
                  <div
                    className={`w-full rounded-t-lg ${colors[grade as keyof typeof colors]} transition-all duration-500`}
                    style={{ height: `${Math.max(height, 8)}%` }}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {grade}
                    <span className="block text-[9px]">
                      {grade === "A"
                        ? "≥85"
                        : grade === "B"
                        ? "70-84"
                        : grade === "C"
                        ? "55-69"
                        : "<55"}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Per-subject average */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Rata-rata per Mata Pelajaran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {subjectAverages
            .sort((a, b) => b.average - a.average)
            .map((sa) => (
              <div key={sa.id} className="flex items-center gap-3">
                <span className="text-sm font-medium w-32 sm:w-40 truncate">
                  {sa.name}
                </span>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-teal rounded-full transition-all duration-500"
                    style={{ width: `${sa.average}%` }}
                  />
                </div>
                <span
                  className={`text-sm font-bold min-w-[32px] text-right ${
                    sa.average >= 85
                      ? "text-emerald-600"
                      : sa.average >= 70
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                >
                  {sa.average}
                </span>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter:</span>
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger id="filter-subject" className="w-40 h-9 text-xs">
            <SelectValue placeholder="Mata Pelajaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Mapel</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger id="filter-type" className="w-32 h-9 text-xs">
            <SelectValue placeholder="Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Tipe</SelectItem>
            <SelectItem value="kuis">Kuis</SelectItem>
            <SelectItem value="tugas">Tugas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grade Table */}
      <Card className="border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Penilaian</TableHead>
              <TableHead className="text-xs">Mata Pelajaran</TableHead>
              <TableHead className="text-xs">Tipe</TableHead>
              <TableHead className="text-xs">Tanggal</TableHead>
              <TableHead className="text-xs text-right">Nilai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGrades.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-sm text-muted-foreground"
                >
                  Tidak ada data nilai.
                </TableCell>
              </TableRow>
            ) : (
              filteredGrades.map((grade) => (
                <TableRow key={grade.id} className="hover:bg-muted/30">
                  <TableCell className="text-sm font-medium">
                    {grade.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {grade.subjectName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">
                      {grade.type === "kuis" ? "Kuis" : "Tugas"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(grade.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`inline-flex items-center justify-center w-10 h-7 rounded-md text-xs font-bold ${
                        grade.score >= 85
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                          : grade.score >= 70
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                          : "bg-red-50 text-red-600 dark:bg-red-900/20"
                      }`}
                    >
                      {grade.score}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
