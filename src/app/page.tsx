import Link from "next/link";
import {
  BookOpen,
  PenTool,
  ClipboardList,
  GraduationCap,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BookOpen,
    title: "Materi Terstruktur",
    description: "Materi disusun per mata pelajaran, bab, dan sub-bab dengan dukungan teks, PDF, dan video.",
  },
  {
    icon: PenTool,
    title: "Latihan Interaktif",
    description: "Kuis dengan pilihan ganda, benar/salah, dan isian singkat dilengkapi umpan balik instan.",
  },
  {
    icon: ClipboardList,
    title: "Manajemen Tugas",
    description: "Sistem penugasan dengan deadline, pengumpulan file, dan penilaian langsung dari guru.",
  },
  {
    icon: GraduationCap,
    title: "Pelacakan Nilai",
    description: "Dashboard nilai lengkap dengan grafik perkembangan dan histori pencapaian akademik.",
  },
];

const benefits = [
  "Belajar kapan saja, di mana saja",
  "Materi lengkap dengan video pembelajaran",
  "Umpan balik instan untuk setiap latihan",
  "Pantau progres belajar secara real-time",
  "Antarmuka responsif untuk ponsel & tablet",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center shadow-md shadow-primary/20">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">BelajarOnline</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" id="btn-masuk">
                Masuk
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" id="btn-daftar" className="gradient-teal text-white border-0 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              Platform Belajar Interaktif #1
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Belajar Lebih{" "}
              <span className="text-gradient-teal">Cerdas</span>,{" "}
              <br className="hidden sm:block" />
              Raih Prestasi{" "}
              <span className="text-gradient-teal">Gemilang</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Akses materi, kerjakan kuis interaktif, kumpulkan tugas, dan pantau
              perkembangan nilaimu — semua dalam satu platform yang mudah dan menyenangkan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard">
                <Button size="lg" id="btn-mulai" className="gradient-teal text-white border-0 text-base px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all hover:scale-[1.02]">
                  Mulai Belajar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="#fitur">
                <Button variant="outline" size="lg" id="btn-pelajari" className="text-base px-8">
                  Pelajari Fitur
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { value: "500+", label: "Siswa Aktif" },
              { value: "50+", label: "Mata Pelajaran" },
              { value: "1000+", label: "Soal Latihan" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gradient-teal">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="py-16 sm:py-24 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Fitur <span className="text-gradient-teal">Unggulan</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Dirancang khusus untuk mendukung proses belajar mengajar yang efektif dan menyenangkan.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group relative bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center mb-4 shadow-md shadow-primary/20 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                Kenapa Harus <span className="text-gradient-teal">BelajarOnline</span>?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Kami menyediakan lingkungan belajar yang terstruktur, interaktif, dan mudah
                diakses dari perangkat apapun.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="inline-block mt-8">
                <Button size="lg" className="gradient-teal text-white border-0 shadow-md shadow-primary/20 hover:shadow-lg transition-shadow">
                  Mulai Sekarang
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl gradient-teal-soft border border-primary/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <GraduationCap className="w-24 h-24 text-primary mx-auto mb-6 opacity-80" />
                  <p className="text-2xl font-bold text-gradient-teal">85%</p>
                  <p className="text-sm text-muted-foreground mt-1">Tingkat Ketuntasan Belajar</p>
                </div>
              </div>
              {/* Floating accent elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl gradient-teal opacity-10 blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-2xl gradient-teal opacity-10 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-border/40 bg-muted/20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-teal flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">BelajarOnline</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 BelajarOnline. Platform Belajar Interaktif.
          </p>
        </div>
      </footer>
    </div>
  );
}
