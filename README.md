<div align="center">

<img src="public/assets/logo_rise_aceh.jpg" alt="RISE App Logo" width="120" height="120" style="border-radius: 50%; shadow: 0 4px 12px rgba(0,0,0,0.1);" />

# 🌸 RISE App

### *Resilience Intervention for Supporting Eldest*
**Aplikasi Resiliensi Akademik & Kesehatan Emosional Siswi Anak Sulung Perempuan**

> Aplikasi interaktif berbasis **Model RISE** yang dikembangkan oleh Tim Peneliti OPSI **SMAN Modal Bangsa Aceh** (Siti Endah Dinara & Zalfa Zahiya) untuk mendampingi siswi anak sulung perempuan (*Eldest Daughter Syndrome*).

---

[![OPSI](https://img.shields.io/badge/OPSI-100%25%20PDF%20Compliant-FF4081?style=for-the-badge&logo=google-docs&logoColor=white)](https://sman-modalbangsa.sch.id)
[![TypeScript](https://img.shields.io/badge/TypeScript-98%25-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Online%20DB-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![OpenRouter](https://img.shields.io/badge/AI-Si%20Jeumpa%20Gemini-FF6B6B?style=for-the-badge&logo=google&logoColor=white)](https://openrouter.ai/)

</div>

---

## 📄 100% Keselarasan dengan PDF Proposal Riset OPSI

Seluruh struktur instrumen, teori resiliensi, indikator kelelahan, dan modul intervensi pada **RISE App** dirancang **100% presisi dan terintegrasi penuh** sesuai dengan dokumen PDF Proposal Riset OPSI (*Olimpiade Penelitian Siswa Indonesia*) SMAN Modal Bangsa Aceh:

- 📌 **3 Indikator Utama Eldest Daughter Syndrome (EDS)**:
  - ⏱️ **Time Strain**: Kelelahan alokasi waktu belajar akibat jam membantu rumah tangga (&gt;3 jam/hari).
  - ⚖️ **Role Burden**: Tuntutan menjadi contoh perfeksionis tanpa cela bagi adik-adik di rumah.
  - 😔 **Role Guilt**: Rasa bersalah saat menggunakan waktu pribadi untuk istirahat atau fokus belajar.
- 📌 **4 Dimensi Resiliensi Akademik (Martin & Marsh, 2006)**:
  - 🌟 **Confidence** → Keyakinan Diri Akademik (Soal 1 & 2)
  - ⏱️ **Control** → Kendali Waktu & Tugas (Soal 3 & 4)
  - 🧘 **Composure** → Ketenangan Emosi & Stres (Soal 5 & 6)
  - 💪 **Commitment** → Ketekunan & Kegigihan (Soal 7 & 8)
- 📌 **4 Pilar Modul Intervensi RISE**:
  - **Modul 1**: Psikoedukasi Batasan Sehat (*Healthy Boundaries*)
  - **Modul 2**: Regulasi Emosi CBT (*Cognitive Behavioral Therapy*) & Reframing Pikiran
  - **Modul 3**: Pendampingan Guru BK SMAN Modal Bangsa & Peer Support Group
  - **Modul 4**: Belajar Adaptif (Teknik Pomodoro 25m & Top 2 Priorities)

---

## ✨ Fitur Unggulan Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🔒 **Sistem Autentikasi & PIN 6-Digit** | Login profil siswi menggunakan Username Unik & PIN 6-digit rahasia. Akses `Cek Tes` dikunci (*Strict Login Gate*) khusus untuk profil terdaftar. |
| 🩺 **Skrining Resiliensi Akademik** | 8 soal evaluasi 4 dimensi resiliensi (skala 1-5) yang dimulai **kosong secara default** dengan *live progress counter* dan validasi pengiriman. |
| 🤖 **Si Jeumpa AI (True Floating Widget)** | Asisten konseling AI hangat khas Aceh berbasis Gemini Flash via OpenRouter. Melayang adaptif di pojok kanan bawah pada semua tingkat zoom browser (100% - 200%). |
| 🛡️ **Dashboard Admin BK & Peneliti** | Panel pemantauan 5-kolom ringkas (tanpa horizontal scroll), rekapitulasi statistik, serta fitur reset PIN profil siswi. |
| 📊 **Ekspor Asli Excel (.xlsx)** | Download rekapitulasi data penelitian dalam format asli Microsoft Excel (`.xlsx`) lengkap dengan lebar kolom auto-fit dan penomoran urut otomatis. |
| 📋 **Papan Catatan & Jurnal (Padlet View)** | Papan sticky note estetik untuk riwayat tes & reframing CBT Si Jeumpa. Mode Admin dapat memantau seluruh catatan siswi dengan fitur search. |
| ☁️ **Online Database Sync (Firebase)** | Sinkronisasi data riwayat tes & profil secara real-time ke Firebase Firestore/Realtime DB dengan fallback *local storage*. |
| 📱 **Desain Fixed Header & Responsive Zoom** | Navbar `fixed top-0` dengan *top-padding* `pt-32` serta auto smooth-scroll ke atas setiap pindah langkah/tab. |

---

## 🔐 Kredensial Akses

### 1. Akun Siswi (User)
- Siswi dapat membuat profil baru langsung melalui menu lencana **`Login Profil Siswi`** di header kanan atas.
- **Form Pendaftaran**: Nama Lengkap, Username Unik (cth: `dinara123`), Usia (14-19 tahun), dan PIN 6-Digit Rahasia (cth: `123456`).

### 2. Panel Admin (Konselor BK / Peneliti OPSI)
- **Akses Login**: Klik **`Login Profil Siswi`** ➔ **`🔐 Mode Admin`**
- **Email / Username**: `admin@gmail.com` atau `admin`
- **Password Admin**: `sudahlupa`

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Bundler**: Vite 6
- **Styling**: TailwindCSS v4 + Custom Vanilla CSS
- **Icons**: Custom SVG Icon System (`CustomIcons.tsx` & `RiseLogoSvg.tsx`)
- **Excel Generator**: `xlsx` (SheetJS)
- **Online Database**: Firebase Online Realtime / Firestore DB
- **AI Integration**: OpenRouter API (`google/gemini-2.5-flash`)
- **Typography**: Plus Jakarta Sans & Outfit (Google Fonts)

---

## 🚀 Cara Menjalankan Aplikasi Secara Lokal

### 1. Clone Repository

```bash
git clone https://github.com/faruqeclypst/TemanSulung.git
cd TemanSulung
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi File Environment `.env`

Buat file `.env` di root direktori proyek:

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_FIREBASE_DATABASE_URL=your_firebase_database_url_here
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
```

### 4. Jalankan Server Dev

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`.

### 5. Build untuk Produksi

```bash
npm run build
```

---

## 👥 Tim Peneliti & Pembimbing OPSI

**SMAN Modal Bangsa Aceh**
- **Siti Endah Dinara** (*Tim Peneliti OPSI SMAN Modal Bangsa*)
- **Zalfa Zahiya** (*Tim Peneliti OPSI SMAN Modal Bangsa*)
- **Eva Susanti, S.Ag., M.M** (*Pembimbing Penelitian OPSI SMAN Modal Bangsa*)
- **Alfaruq Asri, S.Pd. Gr** (*Pembimbing Aplikasi Web*)

---

<div align="center">

*Dikembangkan dengan 🌸 dan kepedulian untuk kesehatan emosional siswi Indonesia.*

</div>
