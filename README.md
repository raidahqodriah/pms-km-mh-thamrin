# PMS KM. MH. Thamrin

Plan Maintenance System (PMS) Departemen Mesin: daftar tugas perawatan **per mesin**, running hours harian,
penugasan berjenjang sesuai pangkat kapal, approval, dan laporan PDF/CSV.

Stack: Next.js 15 (App Router, Server Actions) · Tailwind CSS · Prisma · SQLite · sesi JWT (cookie httpOnly) ·
pdfkit (laporan PDF) · font Plus Jakarta Sans (paket lokal, tanpa CDN).

## Menjalankan

```bash
npm install
cp .env.example .env      # lalu ganti SESSION_SECRET
npm run setup             # prisma generate + db push + seed
npm run dev               # http://localhost:3000
```

Produksi: `npm run build && npm start`. Reset database (hapus semua data): `npm run db:reset`.
Hentikan server dev/produksi sebelum `prisma generate`/`build` (Windows mengunci file engine Prisma).

### Akun awal (dari seeder) — ganti lewat menu Akun / Password

| Username | Password | Pangkat | Hak akses |
|---|---|---|---|
| `masinis` | `masinis123` | C/E (KKM) | Administrator |
| `masinis1`, `masinis2`, `masinis3` | `perwira123` | 1/E, 2/E, 3/E | Supervisor |
| `mekanik1` | `krew123` | FTR | Crew |
| `oiler1`, `oiler2` | `krew123` | OLR | Crew |

## Daftar Mesin

Sumber data: *Plan Maintenance System – Engine Departement* (F-TECH-01-xx-02-R00). 14 mesin/peralatan, 194 pekerjaan:
Main Engine, Auxiliary Engine, Gearbox, Fuel Purifier, Steering Gear, Anchor Gear, 5 pompa (GS, Bilge, Pemadam
Kebakaran, OWS, Fresh Water), Pipa-pipa, Kelistrikan, House Keeping. Tiap pekerjaan = **Obyek**, **Uraian pekerjaan**,
**Keterangan**, **PIC**, dan **interval**.

> Merk/tipe/lokasi mesin (mis. Caterpillar C18, Weichai 226B) berasal dari file sumber; sesuaikan lewat *Edit Mesin*
> bila kapal berbeda. HM terakhir & tanggal perawatan pada file sumber **tidak** disalin — isi sendiri.

- **PIC** bisa **Semua crew** atau satu/lebih pangkat (mis. 1/E + OLR). Difilter di Daftar Mesin.
- **Interval dua indikator** — tiap pekerjaan boleh memakai:
  - *interval waktu* (tiap N hari / minggu / bulan), dan/atau
  - *maksimum running hours* (mis. 250 RH, 750 RH, 3.000 RH).
  
  Bila keduanya diisi, perawatan jatuh tempo pada indikator yang **tercapai lebih dulu** (mis. Oil sampling: 1.500 RH atau 6 bulan).
- Jatuh tempo dihitung dari perawatan terakhir yang disetujui (tanggal **dan** running hours mesin saat itu) atau dari
  isian manual "terakhir dikerjakan". Filter: *Perlu dikerjakan / Terlambat / Aman / Belum ada acuan*.
- Administrator dapat menambah/mengubah/menghapus mesin dan item (yang sudah punya riwayat hanya diarsipkan).

## Running Hours

Menu **Running Hours** (semua user): catat jam operasi mesin per hari (0–24 jam) lewat kalender bulanan.
- Total RH = *running hours awal* mesin (diisi di Edit Mesin) + jumlah catatan harian. Kartu ringkasan: total RH,
  jam bulan ini, rata-rata 30 hari (untuk perkiraan "±N hari lagi"), catatan terakhir.
- Mesin bisa mengikuti RH mesin lain (Gearbox mengikuti Main Engine).
- Crew boleh mencatat/mengubah 7 hari terakhir; perwira semua tanggal. Perwira dapat **kalibrasi jam meter** (menyamakan
  total dengan hour meter fisik) dan menghapus catatan.
- Dashboard & Tugas Saya menampilkan pengingat bila RH hari ini belum dicatat.
- Saat tugas disetujui, RH mesin pada tanggal tugas disimpan sebagai acuan interval berikutnya.

## Hierarki & hak akses

Setiap akun punya **pangkat** (tabel `Rank`, dapat diubah di *Pangkat & Role*) yang menentukan **level**
(1 = tertinggi) dan **hak akses** (`ADMIN` / `SUPERVISOR` / `CREW`).

| | Administrator (Nakhoda, KKM) | Supervisor (perwira) | Crew (rating) |
|---|---|---|---|
| Lihat Daftar Mesin | ✔ | ✔ | – |
| Edit mesin & item | ✔ | – | – |
| Kelola akun & pangkat | ✔ | – | – |
| Tugaskan / Approve | ✔ | ✔ | – |
| Tarik data (PDF/CSV) | ✔ | ✔ | – |
| Kalibrasi RH, hapus catatan RH | ✔ | ✔ | – |
| Catat running hours | ✔ | ✔ | ✔ |
| Kerjakan & ajukan tugas sendiri | ✔ | ✔ | ✔ |

Menugaskan dan meng-approve **hanya untuk pangkat dengan level lebih besar** dari user; approve dilakukan atas pangkat
orang yang mengerjakan. Sistem menolak tindakan yang membuat tidak ada Administrator aktif. Ubah kebijakan di
`src/lib/permissions.ts`.

## Tugas bersama

Satu pekerjaan dapat ditugaskan ke beberapa petugas; begitu salah satu mengajukan selesai, tugas tertanda selesai untuk
semua. Menugaskan item yang sama pada tanggal yang sama menambah petugas ke tugas yang ada.

## Tarik Data

Rentang tanggal + filter mesin/petugas/status → **PDF** (ringkasan, progres per mesin, rincian, tanda tangan,
lampiran foto opsional) atau **CSV** (22 kolom, termasuk RH saat selesai).

## Akses lewat internet (Cloudflare Tunnel)

Aplikasi berjalan di komputer ini (SQLite + folder foto), dibuka ke internet lewat tunnel — tanpa membuka port router.

**Cepat (tanpa akun):** klik dua kali `scripts\start-public.cmd`. Alamat `https://xxxx.trycloudflare.com` muncul di
jendela "PMS Tunnel"; alamat **berubah** tiap tunnel dinyalakan ulang dan hanya aktif selama komputer, server, dan tunnel menyala.

**Alamat tetap (butuh akun Cloudflare + domain):**

```bash
cloudflared tunnel login
cloudflared tunnel create pms
cloudflared tunnel route dns pms pms.domainanda.com
# ~/.cloudflared/config.yml:  tunnel: pms / credentials-file: ... / ingress: [{hostname: pms.domainanda.com, service: http://localhost:3000}, {service: http_status:404}]
cloudflared service install      # jalan otomatis saat Windows menyala
```

Tambahkan domain ke `allowedOrigins` di `next.config.mjs` lalu build ulang.

**Wajib sebelum dibuka ke publik:** `COOKIE_SECURE="true"` dan `SESSION_SECRET` acak panjang di `.env`; **ganti semua
password bawaan seeder**; login dibatasi (6 gagal/username atau 20/IP per 15 menit); cadangkan `prisma/dev.db` dan `uploads/`.

## Struktur

```
prisma/schema.prisma        Rank, User, Equipment, MaintenanceItem, RunningHourLog, Task, TaskAssignee
prisma/seed-data.ts         daftar mesin + pekerjaan dari PDF, daftar pangkat
prisma/seed.ts              seeder idempotent (tidak menimpa perubahan; memindahkan item buatan pengguna)
src/lib/interval.ts         label interval & jatuh tempo (waktu dan/atau RH)
src/lib/hours.ts            statistik & total running hours
src/lib/permissions.ts      matriks izin + level hierarki
src/lib/export.ts, pdf-report.ts   laporan CSV / PDF
src/app/supervisor/*        perwira: ringkasan, Daftar Mesin (master), tugas, export, akun, pangkat
src/app/hours               Running Hours (semua user)
src/app/crew, /account      area crew, ganti password
```

## Catatan

- Penjadwalan otomatis (membuat tugas sendiri saat jatuh tempo) belum ada; atasan menugaskan manual, dibantu status jatuh tempo.
- "Hari ini" mengikuti `APP_TIMEZONE` (default `Asia/Jakarta`).
- Foto dikompres di browser dan disimpan di `UPLOAD_DIR`, bukan `public/`. Untuk PostgreSQL: ubah `provider` di `schema.prisma`.
