# PMS KM. M.H. Thamrin — Operasional Multiuser (Kandidat Uji)

Aplikasi PMS berbasis browser untuk Departemen Mesin KM. M.H. Thamrin. Source ini menggantikan versi **DEMO localStorage**. Data operasional berada di **PostgreSQL Supabase**, akses dibatasi **Row Level Security (RLS)**, sementara halaman aplikasi dipublikasikan lewat **GitHub Pages**.

> **PENTING:** Belum tersambung ke proyek Supabase milikmu dan **belum diuji end-to-end pada database produksi**. Jangan gunakan sebagai sistem catatan keselamatan resmi sampai diuji bersama KKM, termasuk validasi jam operasi, interval PMS, hierarki PIC, hasil persetujuan, cadangan data, dan prosedur ketika internet kapal terputus.

## Yang tersedia

- **14 mesin/peralatan dan 194 item perawatan**, dari master data source PMS Google Drive yang dibahas sebelumnya. Tidak menyalin hour meter historis, data operasional, serial number, atau password.
- **Email/password login** via Supabase Auth; akun baru dibuat **nonaktif**, lalu diaktifkan administrator setelah verifikasi.
- **Role & pangkat:** ADMIN (Nakhoda/KKM), SUPERVISOR (perwira), CREW (pelaksana); pembatasan hak akses diberlakukan di sisi database melalui RPC dan RLS, bukan hanya tombol UI.
- **Data bersama** running hours, master mesin, interval perawatan, penugasan, laporan realisasi, persetujuan, koreksi, bukti foto/PDF privat, dan audit log.
- **Penjadwalan kalender / running hours**; status jatuh tempo tetap **Belum ada acuan** sampai data dasar divalidasi.
- **Approval berjenjang:** atasan yang berpangkat lebih tinggi dapat memeriksa, menyetujui atau mengembalikan laporan; tidak dapat menyetujui pekerjaan sendiri.
- Laporan CSV data pekerjaan, tugas, dan audit (sesuai hak akses).

## Cara mengganti isi repository GitHub yang SUDAH ADA

Repository: **https://github.com/raidahqodriah/pms-km-mh-thamrin**

1. Ekstrak ZIP ini, buka folder hasil ekstraksi **PMS-MH-Thamrin-Operasional**.
2. Buka repository GitHub → tab **Code** → **Add file** → **Upload files**.
3. Unggah isi folder hasil ekstraksi (bukan folder luarnya) sehingga file `index.html`, `app.js`, `config.js`, `styles.css` ada langsung di **root repository**. Sertakan folder `database` yang berisi kedua file SQL.
4. **Commit changes**. Saat file lama bernama sama, GitHub akan menggantinya dengan versi baru pada branch `main`.
5. Di tab Code, hapus file `data.js` dari versi demo karena tidak digunakan lagi. Jika ada folder lama bernama `pms-km-mh-thamrin-github-pages`, sebaiknya hapus setelah memverifikasi file di root.
6. Pastikan **Settings → Pages → Build and deployment** masih `Deploy from a branch`, `main`, `/(root)`.
7. Setelah penerbitan, alamat tetap: **https://raidahqodriah.github.io/pms-km-mh-thamrin/**. Sebelum Supabase siap, halaman akan menjelaskan bahwa backend belum dikonfigurasi.

> Jika file `index.html` lama masih tampak setelah upload, lakukan hard refresh (`Ctrl+Shift+R`) atau tunggu GitHub Pages menerbitkan commit terbaru.

## Hubungkan ke Supabase (wajib agar multiuser benar-benar bekerja)

1. Di **https://supabase.com/dashboard**, buat **New project**. Pilih wilayah server yang mendekati penggunaan operasional, catat database password secara privat dan jangan bagikan kepada orang lain.
2. Buka **SQL Editor** → **New query**, tempel isi `database/schema.sql`, kemudian klik **Run**. Pastikan tidak ada kesalahan. SQL mengaktifkan RLS, hak akses RPC, profil pengguna, dan bucket dokumen privat.
3. Buka query baru, tempel isi `database/seed.sql` → **Run**. Hasil: 14 mesin, 194 item pekerjaan, daftar jabatan. **Cek hasil** (SQL Editor):
   ```sql
   select count(*) as mesin from public.equipment;        -- 14
   select count(*) as pekerjaan from public.maintenance_items; -- 194
   ```
4. Buka **Project Settings → API** (atau **Connect → API keys**, tergantung tampilan dashboard). Catat **Project URL** (`https://...supabase.co`) dan **publishable key** (`sb_publishable_...`) atau **legacy anon key**. Keduanya boleh digunakan untuk browser dengan RLS yang benar. **JANGAN gunakan `service_role` atau secret key.**
5. Edit `config.js` yang ada di GitHub → klik ikon pensil:
   ```js
   window.PMS_CONFIG = {
     url: 'https://NAMA-PROYEK.supabase.co',
     anonKey: 'PUBLISHABLE_ATAU_ANON_KEY'
   };
   ```
   Klik **Commit changes**, tunggu GitHub Pages menerbitkan ulang.
6. Di Supabase **Authentication → URL Configuration**, tetapkan **Site URL** `https://raidahqodriah.github.io/pms-km-mh-thamrin/`. Di **Redirect URLs**, tambahkan alamat yang sama (dan opsi wildcard yang relevan). Buka **Authentication → Providers → Email** dan sesuaikan kebijakan pendaftaran/konfirmasi email; untuk kapal, dianjurkan undangan personel yang diverifikasi, bukan pendaftaran terbuka selamanya.
7. Daftarkan **akun KKM yang benar-benar ditunjuk sebagai administrator** lewat halaman aplikasi atau undang melalui Supabase Authentication. Jika aktivasi email dinyalakan, pastikan email dikonfirmasi terlebih dahulu. **Hanya untuk bootstrap pertama**, gunakan SQL Editor Supabase, ganti email pada perintah berikut dengan email admin yang terdaftar:
   ```sql
   update public.profiles
      set rank_code = 'C/E', active = true, full_name = 'Nama Kepala Kamar Mesin'
    where id = (select id from auth.users where email = 'email-kkm@example.com');
   ```
   Perintah ini ditujukan untuk **KKM yang telah diverifikasi**, bukan akun uji tanpa otorisasi. Setelahnya, login sebagai KKM → **Manajemen Crew** → aktifkan akun lainnya sesuai jabatan.
8. **Uji dengan setidaknya tiga akun berbeda:** KKM (Admin), Masinis (Supervisor), dan Crew. Periksa bahwa crew tidak bisa mengubah data master, persetujuan hanya dapat dilakukan atasan, dan perubahan terlihat setelah klik **Sinkronkan** di perangkat lain.

## Perhatian keamanan & kesiapan operasional

- Database Supabase dan URL GitHub Pages tidak saling mengubah sendiri; situs frontend dan database harus dipasang terpisah.
- `config.js` berisi **publishable/anon key**, **BUKAN** rahasia database. Keamanan bergantung pada RLS dan fungsi SQL. **Jangan commit password, `service_role`, kunci rahasia, ataupun file `.env`.**
- Paket SQL disediakan sebagai **instalasi baru**. Jangan langsung jalankan di proyek Supabase yang sudah memiliki data lain tanpa membuat backup dan review migrasi.
- **Tanpa internet** browser tidak dapat membaca/menyimpan data baru. Sebelum digunakan di kapal, pastikan prosedur fallback offline, rekonsiliasi data, dan backup terjadwal. Ini belum aplikasi offline-first.
- Hasil approval dan status jatuh tempo bergantung pada kualitas HM awal, tanggal perawatan terakhir, dan konfigurasi interval. Validasi dengan catatan kapal.
- Bukti foto/PDF masuk **bucket privat**. Jangan menyimpan foto dokumen pribadi atau informasi sensitif tanpa SOP retensi dan hak akses.
- Jangan anggap uji awal di browser sebagai validasi kualitas perangkat lunak untuk keselamatan pelayaran.

## Isi paket

- `index.html` — kerangka aplikasi.
- `styles.css` — tampilan desktop/mobile.
- `app.js` — autentikasi, dashboard, perawatan, jam operasi, tugas, approval, ekspor.
- `config.js` — lokasi pengisian Project URL dan publishable key.
- `database/schema.sql` — skema PostgreSQL, RLS, fungsi RPC, bucket bukti.
- `database/seed.sql` — data referensi 14 mesin, 194 pekerjaan, dan pangkat.
- `.nojekyll` — penerbitan GitHub Pages.

## Alur keputusan sistem

| Pengguna | Dapat melakukan |
|---|---|
| ADMIN (Nakhoda/KKM) | Kelola akun, data master, kalibrasi HM & interval, catat/koreksi RH, tugas dan approval sesuai hierarki |
| SUPERVISOR (Masinis/Perwira) | Mencatat/koreksi RH, memberi tugas ke bawahan, menyetujui/menolak/batalkan tugas sesuai hierarki |
| CREW (Kadet/Oiler/Fitter dll.) | Mencatat RH baru, melihat daftar mesin, mengajukan pekerjaan ditugaskan, melihat riwayat sendiri |
| Akun belum aktif | Melihat status menunggu aktivasi saja |

**Akses final** ditentukan oleh aturan SQL di Supabase; bukan oleh label yang ditampilkan pada tombol.
