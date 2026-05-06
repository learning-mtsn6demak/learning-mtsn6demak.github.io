Product Requirements Document (PRD)

Proyek: Aplikasi Belajar Online
Fokus Utama: Manajemen Materi, Penugasan, Latihan Interaktif, & Pelacakan Nilai
Status: Draft - Versi 1.1

1. Ringkasan Eksekutif
Aplikasi Belajar Online ini dirancang untuk memfasilitasi proses belajar mengajar secara
interaktif dan terstruktur. Aplikasi ini bertujuan memberikan pengalaman belajar mandiri
yang efisien dengan menyediakan akses ke materi ajar, sistem penugasan terstruktur,
memfasilitasi evaluasi melalui latihan soal, dan menampilkan rekam jejak kemampuan siswa
secara transparan melalui rekapitulasi nilai. Antarmuka dirancang agar responsif, khususnya
untuk penggunaan melalui ponsel dan tablet.

2. Pengguna Sasaran (User Personas)
Siswa: Pengguna utama yang login untuk mengakses modul materi, mengunggah
tugas, mengerjakan latihan kuis, dan memantau perkembangan nilai mereka sendiri.
Guru/Instruktur: Pengguna dengan hak akses manajerial untuk mengatur kelas,
mengunggah materi, memberikan tugas, menyusun bank soal, dan menganalisis
capaian belajar siswa.
•

•

3. Ruang Lingkup & Fitur Utama

A. Modul Materi Pembelajaran
Fitur ini merupakan pusat distribusi pengetahuan dari guru ke siswa.
Dukungan Berbagai Format: Menampilkan teks kaya, dokumen (PDF), dan video
pembelajaran.
Kategorisasi Terstruktur: Materi disusun berdasarkan Mata Pelajaran > Bab >
Sub-bab agar mudah ditelusuri.
Indikator Penyelesaian: Memungkinkan siswa menandai materi yang telah
selesai dipelajari, memberikan representasi visual tentang progres belajar
mereka.

B. Latihan Soal & Kuis Interaktif
Sistem evaluasi mandiri untuk mengukur penyerapan materi.
Variasi Soal: Mendukung pilihan ganda, benar/salah, dan isian singkat.
Bank Soal: Guru dapat membuat kumpulan soal yang dapat diacak urutannya
saat disajikan kepada siswa.
Umpan Balik Instan: Setelah latihan selesai, siswa langsung mendapatkan skor
beserta pembahasan untuk soal yang salah.
Pengaturan Waktu: Fitur penghitung waktu mundur (timer) untuk simulasi ujian
yang lebih terstruktur.
•

•

•

•
•

•

•

C. Manajemen Penugasan (Assignments)
Sistem pemberian dan pengumpulan tugas berbasis tenggat waktu (deadline).
Pemberian Tugas: Guru dapat membuat instruksi penugasan dengan deskripsi
detail, melampirkan file pendukung, dan menetapkan batas waktu pengumpulan
(deadline).
Pengumpulan Tugas: Siswa dapat mengunggah hasil pekerjaan mereka dalam
berbagai format (seperti PDF, Dokumen, Gambar, atau tautan URL) sebelum
tenggat waktu berakhir.
Penilaian & Umpan Balik Guru: Guru dapat memeriksa file yang diunggah,
memberikan nilai ukur, serta menambahkan komentar atau evaluasi tertulis
langsung pada tugas siswa.
Integrasi Nilai: Nilai dari penugasan secara otomatis masuk dan diakumulasikan
ke dalam sistem rekap nilai (Gradebook).

D. Dasbor Rekap Nilai (Gradebook)
Pusat pelacakan data akademik untuk memastikan ketercapaian tujuan belajar.

Dasbor Siswa: Menampilkan histori nilai per latihan dan tugas, kalkulasi nilai rata-
rata, dan grafik perkembangan capaian akademik.

Dasbor Guru: Menampilkan rekapitulasi nilai seluruh siswa di kelas, fungsi
pencarian data siswa yang spesifik, serta kapabilitas untuk mengekspor data ke
dalam bentuk Spreadsheet (Excel/CSV).

4. Kebutuhan Non-Fungsional

Aspek Kebutuhan

UI/UX
Design

Desain responsif yang optimal untuk perangkat seluler dan tablet.
Mengusung skema warna hijau tosca yang segar dan menggunakan
navigasi minimalis berbasis ikon di tengah layar agar intuitif digunakan.

Akses &
Keamanan
•

•

•

•

•

•

Sistem otentikasi dengan pembagian hak akses (role-based login) yang
ketat antara Siswa dan Guru. File tugas yang diunggah siswa harus
tersimpan aman dan hanya bisa diakses oleh guru yang bersangkutan.

Kinerja

Transisi antar soal dalam mode kuis harus bebas hambatan. Proses
unggah/unduh file tugas harus berjalan lancar dengan batasan ukuran
file yang jelas (misal maks. 10MB).

5. Kriteria Kesuksesan (Success Metrics)
Tingkat ketuntasan belajar materi oleh siswa minimal 85%.
Tingkat pengumpulan tugas tepat waktu mencapai di atas 90%.
Frekuensi penggunaan latihan soal harian/mingguan meningkat stabil.
Laporan umpan balik yang positif dari guru mengenai kemudahan dalam manajemen
kelas, pemberian umpan balik tugas, dan pemantauan nilai.