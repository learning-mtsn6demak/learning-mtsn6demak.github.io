"use client";

import { useState } from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Upload,
  FileText,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { assignments, subjects } from "@/lib/data";

const statusConfig = {
  belum: {
    label: "Belum Dikumpulkan",
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    badge: "destructive" as const,
  },
  dikumpulkan: {
    label: "Sudah Dikumpulkan",
    icon: CheckCircle2,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    badge: "default" as const,
  },
  dinilai: {
    label: "Sudah Dinilai",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    badge: "default" as const,
  },
  terlambat: {
    label: "Terlambat",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-900/20",
    badge: "destructive" as const,
  },
};

export default function TugasPage() {
  const [activeTab, setActiveTab] = useState("semua");

  const filteredAssignments =
    activeTab === "semua"
      ? assignments
      : assignments.filter((a) => a.status === activeTab);

  const stats = {
    total: assignments.length,
    belum: assignments.filter((a) => a.status === "belum").length,
    dikumpulkan: assignments.filter((a) => a.status === "dikumpulkan").length,
    dinilai: assignments.filter((a) => a.status === "dinilai").length,
  };

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Manajemen <span className="text-gradient-teal">Penugasan</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola dan kumpulkan tugas sebelum deadline
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-primary" },
          { label: "Pending", value: stats.belum, color: "text-amber-600" },
          { label: "Dikumpulkan", value: stats.dikumpulkan, color: "text-blue-600" },
          { label: "Dinilai", value: stats.dinilai, color: "text-emerald-600" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-3 text-center">
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="semua" onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="semua" className="text-xs">Semua</TabsTrigger>
          <TabsTrigger value="belum" className="text-xs">Belum</TabsTrigger>
          <TabsTrigger value="dikumpulkan" className="text-xs">Dikumpulkan</TabsTrigger>
          <TabsTrigger value="dinilai" className="text-xs">Dinilai</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 space-y-3">
          {filteredAssignments.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Tidak ada tugas di kategori ini.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAssignments.map((assignment) => {
              const subject = subjects.find(
                (s) => s.id === assignment.subjectId
              );
              const config = statusConfig[assignment.status];
              const StatusIcon = config.icon;
              const deadline = new Date(assignment.deadline);
              const isOverdue = deadline < new Date() && assignment.status === "belum";

              return (
                <Card
                  key={assignment.id}
                  id={`assignment-${assignment.id}`}
                  className="border-border/50 hover:border-primary/20 transition-colors"
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}
                      >
                        <StatusIcon className={`w-5 h-5 ${config.color}`} />
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-[10px]">
                                {subject?.name}
                              </Badge>
                              <Badge
                                variant={
                                  assignment.status === "dinilai"
                                    ? "default"
                                    : assignment.status === "terlambat" ||
                                      isOverdue
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="text-[10px]"
                              >
                                {isOverdue ? "Melewati Deadline" : config.label}
                              </Badge>
                            </div>
                            <h3 className="text-sm font-semibold">
                              {assignment.title}
                            </h3>
                          </div>
                          {assignment.grade !== undefined && (
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                                assignment.grade >= 85
                                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                                  : assignment.grade >= 70
                                  ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                                  : "bg-red-50 text-red-600 dark:bg-red-900/20"
                              }`}
                            >
                              {assignment.grade}
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {assignment.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Deadline:{" "}
                            {deadline.toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            Maks {assignment.maxFileSize}MB
                          </span>
                        </div>

                        {/* Feedback */}
                        {assignment.feedback && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-xl">
                            <div className="flex items-center gap-1.5 mb-1">
                              <MessageSquare className="w-3.5 h-3.5 text-primary" />
                              <span className="text-xs font-medium text-primary">
                                Komentar Guru
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {assignment.feedback}
                            </p>
                          </div>
                        )}

                        {/* Upload Button */}
                        {assignment.status === "belum" && (
                          <Dialog>
                            <DialogTrigger
                                className="mt-2 inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-8 px-3 gradient-teal text-white border-0 shadow-md shadow-primary/20 cursor-pointer"
                                id={`btn-upload-${assignment.id}`}
                              >
                                <Upload className="w-4 h-4" />
                                Kumpulkan Tugas
                              </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Kumpulkan Tugas</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                  {assignment.title}
                                </p>
                                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                                  <p className="text-sm font-medium">
                                    Klik atau drag file ke sini
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Format: {assignment.allowedFormats.join(", ")} ·
                                    Maks {assignment.maxFileSize}MB
                                  </p>
                                </div>
                                <Textarea
                                  placeholder="Catatan tambahan (opsional)"
                                  rows={3}
                                />
                                <Button className="w-full gradient-teal text-white border-0">
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload & Kirim
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
