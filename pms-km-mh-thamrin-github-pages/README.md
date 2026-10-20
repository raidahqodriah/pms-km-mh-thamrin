# PMS KM. M.H. Thamrin — Versi GitHub Pages (DEMO)

Aplikasi web statis untuk uji coba **Planned Maintenance System Departemen Mesin KM. M.H. Thamrin**. Menggunakan **14 mesin/peralatan dan 194 item perawatan** dari `prisma/seed-data.ts` yang disimpan dalam proyek asal di Google Drive.

> ⚠️ **Bukan pengganti PMS operasional kapal.** Tidak ada autentikasi, pembatasan hak akses, persetujuan perwira yang terverifikasi, sinkronisasi antar pengguna, maupun database server. Semua data demo ada pada `localStorage` browser masing-masing. Data bisa hilang ketika cache/data situs dihapus. Jangan memasukkan data rahasia atau bergantung pada demo untuk pengendalian keselamatan.

## Cara menerbitkan di GitHub Pages

**Alamat yang diharapkan setelah penerbitan:** `https://raidahqodriah.github.io/pms-km-mh-thamrin/`

1. Masuk ke GitHub dengan akun **raidahqodriah**.
2. Klik **New repository**, beri nama **`pms-km-mh-thamrin`**, pilih **Public**, lalu **Create repository**.
3. Pilih **Add file → Upload files**, lalu unggah **semua file yang ada di dalam folder ini** ke root repository (jangan unggah file ZIP sebagai satu file). Berkas utamanya adalah `index.html`, `styles.css`, `app.js`, `data.js`, dan `.nojekyll`.
4. Klik **Commit changes**.
5. Masuk **Settings → Pages → Build and deployment → Deploy from a branch → Branch: main → /(root) → Save**.
6. Setelah GitHub menyatakan berhasil menerbitkan situs, buka alamat GitHub Pages di atas. Jika muncul 404, periksa bahwa file `index.html` berada di root repo, bukan di subfolder.

**Alternatif:** Jika pengguna sudah punya repository, boleh unggah berkas ke repository itu lalu aktifkan Pages dari root atau subfolder yang berisi `index.html` (URL akan mengikuti nama repository tersebut).

## Menjalankan tanpa hosting

Buka `index.html` menggunakan browser biasa setelah mengekstrak ZIP. Tidak ada instalasi Node.js atau server. Aplikasi tidak menggunakan CDN.

## Fitur demo

- Dashboard: total mesin, item pekerjaan, terlambat, menunggu approval, ringkasan status.
- Daftar mesin: 14 mesin/peralatan, pencarian, interval waktu atau jam operasi dan detail 194 pekerjaan.
- Editing metadata mesin: nama, merk/tipe, lokasi, serial, nilai hour meter awal.
- Atur PIC per pekerjaan (Semua crew atau beberapa pangkat).
- Set tanggal/RH perawatan terakhir untuk mengaktifkan perhitungan jatuh tempo.
- Running hours: pencatatan harian 0–24 jam, total RH = HM awal + total catatan harian. Gearbox mengikuti RH Main Engine.
- Tugas: penugasan manual, pengajuan selesai, approval **simulasi**; approval mengubah acuan jadwal.
- Laporan/riwayat: ekspor CSV master dan tugas.
- Cadangan: ekspor/impor JSON untuk memindahkan data secara manual, atau reset.

## Berbeda dari source Next.js asli

Source asli berbasis Next.js + Prisma + SQLite dan berjalan melalui Cloudflare Tunnel. **Versi ini adalah implementasi demo statis yang terpisah**, bukan hasil deployment langsung dari aplikasi Next.js. GitHub Pages tidak dapat menjalankan backend Next.js server actions, SQLite, login JWT, atau pengunggahan bukti foto seperti source asli.

Untuk aplikasi nyata yang dapat dipakai bersama KKM, masinis dan crew, disarankan backend ter-hosting dan database PostgreSQL, autentikasi role-based yang terverifikasi, audit log, serta penyimpanan bukti pekerjaan. Penggunaan harus diuji dan disetujui sebelum dipakai dalam operasi kapal.

## File

- `index.html`: kerangka halaman aplikasi.
- `styles.css`: desain responsif.
- `app.js`: logika UI dan pencatatan data lokal.
- `data.js`: data referensi 14 mesin / 194 pekerjaan dari source asli (tanpa data operasional atau password).
- `.nojekyll`: mendukung publikasi sebagai berkas statis langsung.

Tidak memasukkan `.env`, akun/password seeder, `dev.db`, folder `node_modules`, `.next`, atau data operasional kapal.
