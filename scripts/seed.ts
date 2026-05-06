import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../src/db/schema";

const sqlite = new Database("sqlite.db");
sqlite.pragma("journal_mode = WAL");
const db = drizzle({ client: sqlite, schema });

async function seed() {
  console.log("🌱 Seeding database...");

  const now = new Date();

  // ─── Create Subjects ────────────────────────────────────────────────
  const subjectsData = [
    {
      id: "matematika",
      name: "Matematika",
      icon: "Calculator",
      color: "blue",
      description: "Aljabar, Geometri, Statistika, dan Kalkulus dasar",
    },
    {
      id: "bahasa-indonesia",
      name: "Bahasa Indonesia",
      icon: "BookOpen",
      color: "green",
      description: "Tata bahasa, sastra, dan keterampilan menulis",
    },
    {
      id: "fisika",
      name: "Fisika",
      icon: "Atom",
      color: "purple",
      description: "Mekanika, Termodinamika, Gelombang, dan Listrik",
    },
    {
      id: "biologi",
      name: "Biologi",
      icon: "Leaf",
      color: "emerald",
      description: "Sel, Genetika, Ekosistem, dan Evolusi",
    },
    {
      id: "geografi",
      name: "Geografi",
      icon: "Globe",
      color: "amber",
      description: "Litosfer, Atmosfer, Hidrosfer, dan Biosfer",
    },
    {
      id: "kimia",
      name: "Kimia",
      icon: "FlaskConical",
      color: "red",
      description: "Struktur atom, Ikatan kimia, dan Reaksi kimia",
    },
  ];

  for (const s of subjectsData) {
    await db
      .insert(schema.subject)
      .values({ ...s, createdAt: now })
      .onConflictDoNothing();
  }
  console.log("  ✓ Subjects seeded");

  // ─── Create Chapters & Sub-chapters ─────────────────────────────────
  const chaptersData = [
    {
      id: "mat-ch1",
      subjectId: "matematika",
      title: "Bab 1: Aljabar Linear",
      orderIndex: 0,
      subChapters: [
        { id: "mat-ch1-s1", title: "Persamaan Linear Satu Variabel", type: "text" as const, duration: "15 menit" },
        { id: "mat-ch1-s2", title: "Persamaan Linear Dua Variabel", type: "text" as const, duration: "20 menit" },
        { id: "mat-ch1-s3", title: "Sistem Persamaan Linear", type: "video" as const, duration: "25 menit" },
        { id: "mat-ch1-s4", title: "Latihan Soal Aljabar", type: "pdf" as const, duration: "30 menit" },
      ],
    },
    {
      id: "mat-ch2",
      subjectId: "matematika",
      title: "Bab 2: Geometri Dasar",
      orderIndex: 1,
      subChapters: [
        { id: "mat-ch2-s1", title: "Bangun Datar", type: "text" as const, duration: "20 menit" },
        { id: "mat-ch2-s2", title: "Bangun Ruang", type: "video" as const, duration: "25 menit" },
        { id: "mat-ch2-s3", title: "Teorema Pythagoras", type: "text" as const, duration: "15 menit" },
      ],
    },
    {
      id: "bi-ch1",
      subjectId: "bahasa-indonesia",
      title: "Bab 1: Teks Eksposisi",
      orderIndex: 0,
      subChapters: [
        { id: "bi-ch1-s1", title: "Pengertian Teks Eksposisi", type: "text" as const, duration: "10 menit" },
        { id: "bi-ch1-s2", title: "Struktur Teks Eksposisi", type: "text" as const, duration: "15 menit" },
        { id: "bi-ch1-s3", title: "Contoh & Analisis", type: "pdf" as const, duration: "20 menit" },
      ],
    },
    {
      id: "bi-ch2",
      subjectId: "bahasa-indonesia",
      title: "Bab 2: Puisi",
      orderIndex: 1,
      subChapters: [
        { id: "bi-ch2-s1", title: "Unsur-Unsur Puisi", type: "text" as const, duration: "15 menit" },
        { id: "bi-ch2-s2", title: "Analisis Puisi Chairil Anwar", type: "video" as const, duration: "20 menit" },
      ],
    },
    {
      id: "fis-ch1",
      subjectId: "fisika",
      title: "Bab 1: Kinematika",
      orderIndex: 0,
      subChapters: [
        { id: "fis-ch1-s1", title: "Gerak Lurus Beraturan", type: "text" as const, duration: "20 menit" },
        { id: "fis-ch1-s2", title: "Gerak Lurus Berubah Beraturan", type: "video" as const, duration: "25 menit" },
        { id: "fis-ch1-s3", title: "Gerak Parabola", type: "text" as const, duration: "20 menit" },
      ],
    },
    {
      id: "bio-ch1",
      subjectId: "biologi",
      title: "Bab 1: Sel",
      orderIndex: 0,
      subChapters: [
        { id: "bio-ch1-s1", title: "Struktur Sel", type: "text" as const, duration: "15 menit" },
        { id: "bio-ch1-s2", title: "Organel Sel", type: "video" as const, duration: "20 menit" },
        { id: "bio-ch1-s3", title: "Sel Prokariotik vs Eukariotik", type: "text" as const, duration: "15 menit" },
      ],
    },
  ];

  for (const ch of chaptersData) {
    const { subChapters, ...chapterData } = ch;
    await db.insert(schema.chapter).values(chapterData).onConflictDoNothing();
    for (const sc of subChapters) {
      await db
        .insert(schema.subChapter)
        .values({ ...sc, chapterId: ch.id, orderIndex: 0 })
        .onConflictDoNothing();
    }
  }
  console.log("  ✓ Chapters & sub-chapters seeded");

  // ─── Create Quizzes & Questions ─────────────────────────────────────
  const quizzesData = [
    {
      id: "quiz-aljabar",
      subjectId: "matematika",
      title: "Kuis Aljabar Linear",
      type: "pilihan_ganda" as const,
      timeLimit: 15,
      questions: [
        {
          id: "q1",
          text: "Jika 2x + 5 = 15, berapakah nilai x?",
          type: "pilihan_ganda" as const,
          options: ["3", "4", "5", "6"],
          correctAnswer: "5",
          explanation: "2x + 5 = 15 → 2x = 10 → x = 5",
        },
        {
          id: "q2",
          text: "Penyelesaian dari 3x - 7 = 2x + 3 adalah...",
          type: "pilihan_ganda" as const,
          options: ["8", "9", "10", "11"],
          correctAnswer: "10",
          explanation: "3x - 7 = 2x + 3 → x = 10",
        },
        {
          id: "q3",
          text: "Nilai y jika 4y + 8 = 2y + 20 adalah...",
          type: "pilihan_ganda" as const,
          options: ["4", "5", "6", "7"],
          correctAnswer: "6",
          explanation: "4y + 8 = 2y + 20 → 2y = 12 → y = 6",
        },
        {
          id: "q4",
          text: "Himpunan penyelesaian dari |x - 3| = 5 adalah...",
          type: "pilihan_ganda" as const,
          options: ["{-2, 8}", "{2, 8}", "{-2, -8}", "{2, -8}"],
          correctAnswer: "{-2, 8}",
          explanation: "|x - 3| = 5 → x - 3 = 5 atau x - 3 = -5 → x = 8 atau x = -2",
        },
        {
          id: "q5",
          text: "Jika x + y = 10 dan x - y = 4, maka x = ...",
          type: "pilihan_ganda" as const,
          options: ["5", "6", "7", "8"],
          correctAnswer: "7",
          explanation: "x + y = 10, x - y = 4 → 2x = 14 → x = 7",
        },
      ],
    },
    {
      id: "quiz-geometri",
      subjectId: "matematika",
      title: "Kuis Geometri Dasar",
      type: "pilihan_ganda" as const,
      timeLimit: 12,
      questions: [
        {
          id: "q6",
          text: "Luas segitiga dengan alas 10 cm dan tinggi 8 cm adalah...",
          type: "pilihan_ganda" as const,
          options: ["40 cm²", "60 cm²", "80 cm²", "20 cm²"],
          correctAnswer: "40 cm²",
          explanation: "L = ½ × a × t = ½ × 10 × 8 = 40 cm²",
        },
        {
          id: "q7",
          text: "Keliling lingkaran dengan jari-jari 7 cm (π = 22/7) adalah...",
          type: "pilihan_ganda" as const,
          options: ["44 cm", "22 cm", "154 cm", "88 cm"],
          correctAnswer: "44 cm",
          explanation: "K = 2πr = 2 × 22/7 × 7 = 44 cm",
        },
        {
          id: "q8",
          text: "Diagonal sisi kubus dengan rusuk 6 cm adalah...",
          type: "pilihan_ganda" as const,
          options: ["6√2 cm", "6√3 cm", "12 cm", "6 cm"],
          correctAnswer: "6√2 cm",
          explanation: "Diagonal sisi = r√2 = 6√2 cm",
        },
      ],
    },
    {
      id: "quiz-eksposisi",
      subjectId: "bahasa-indonesia",
      title: "Kuis Teks Eksposisi",
      type: "benar_salah" as const,
      timeLimit: 10,
      questions: [
        {
          id: "q9",
          text: "Teks eksposisi bertujuan untuk meyakinkan pembaca",
          type: "benar_salah" as const,
          options: ["Benar", "Salah"],
          correctAnswer: "Salah",
          explanation: "Teks eksposisi bertujuan memaparkan/menjelaskan, bukan meyakinkan. Yang bertujuan meyakinkan adalah teks persuasi.",
        },
        {
          id: "q10",
          text: "Struktur teks eksposisi terdiri dari tesis, argumentasi, dan penegasan ulang",
          type: "benar_salah" as const,
          options: ["Benar", "Salah"],
          correctAnswer: "Benar",
          explanation: "Struktur teks eksposisi memang terdiri dari tesis, rangkaian argumentasi, dan penegasan ulang.",
        },
      ],
    },
    {
      id: "quiz-kinematika",
      subjectId: "fisika",
      title: "Kuis Kinematika",
      type: "pilihan_ganda" as const,
      timeLimit: 15,
      questions: [
        {
          id: "q11",
          text: "Sebuah mobil bergerak dengan kecepatan 72 km/jam. Berapa m/s?",
          type: "pilihan_ganda" as const,
          options: ["10 m/s", "20 m/s", "36 m/s", "72 m/s"],
          correctAnswer: "20 m/s",
          explanation: "72 km/jam = 72 × 1000/3600 = 20 m/s",
        },
        {
          id: "q12",
          text: "Benda bergerak dari keadaan diam dengan percepatan 4 m/s². Kecepatan setelah 5 detik adalah...",
          type: "pilihan_ganda" as const,
          options: ["10 m/s", "15 m/s", "20 m/s", "25 m/s"],
          correctAnswer: "20 m/s",
          explanation: "v = v₀ + at = 0 + 4 × 5 = 20 m/s",
        },
      ],
    },
  ];

  for (const qz of quizzesData) {
    const { questions, ...quizData } = qz;
    await db
      .insert(schema.quiz)
      .values({ ...quizData, createdAt: now })
      .onConflictDoNothing();
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      await db
        .insert(schema.question)
        .values({
          ...q,
          quizId: qz.id,
          options: q.options ? JSON.stringify(q.options) : null,
          orderIndex: i,
        })
        .onConflictDoNothing();
    }
  }
  console.log("  ✓ Quizzes & questions seeded");

  // ─── Create Assignments ─────────────────────────────────────────────
  const assignmentsData = [
    {
      id: "a1",
      subjectId: "matematika",
      title: "Tugas Aljabar: Sistem Persamaan",
      description:
        "Kerjakan soal nomor 1-10 pada buku halaman 45. Tuliskan langkah-langkah penyelesaiannya dengan rapi.",
      deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      maxFileSize: 10,
      allowedFormats: JSON.stringify([".pdf", ".doc", ".docx"]),
    },
    {
      id: "a2",
      subjectId: "bahasa-indonesia",
      title: "Essay: Analisis Puisi",
      description:
        'Buatlah analisis mendalam terhadap puisi "Aku" karya Chairil Anwar. Minimal 500 kata.',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxFileSize: 5,
      allowedFormats: JSON.stringify([".pdf", ".doc", ".docx"]),
    },
    {
      id: "a3",
      subjectId: "fisika",
      title: "Laporan Praktikum: Gerak Lurus",
      description:
        "Buatlah laporan praktikum gerak lurus beraturan yang telah dilakukan. Sertakan data pengamatan, analisis, dan kesimpulan.",
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      maxFileSize: 15,
      allowedFormats: JSON.stringify([".pdf"]),
    },
    {
      id: "a4",
      subjectId: "biologi",
      title: "Presentasi: Organel Sel",
      description:
        "Buat presentasi tentang organel sel eukariotik beserta fungsinya. Minimal 10 slide.",
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      maxFileSize: 20,
      allowedFormats: JSON.stringify([".pptx", ".pdf"]),
    },
  ];

  for (const a of assignmentsData) {
    await db
      .insert(schema.assignment)
      .values({ ...a, createdAt: now })
      .onConflictDoNothing();
  }
  console.log("  ✓ Assignments seeded");

  console.log("\n✅ Database seeded successfully!");
}

seed()
  .catch(console.error)
  .finally(() => process.exit(0));
