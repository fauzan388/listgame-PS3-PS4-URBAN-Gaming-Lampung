# URBAN PS3 & PS4 Web App

Web app untuk pengunjung yang ingin mengisi game **PS3 & PS4** di **URBAN PlayStation Lampung**.
- Header dengan alamat & tombol Maps, tombol **Hubngi Admin (WhatsApp)**, tombol **Keranjang** dengan badge merah.
- Tab **PS3 / PS4 / Produk Lainnya** dengan filter sort (abjad, harga, rilis).
- Kartu game & produk: cover besar, info detail, **harga di section sendiri**, tombol **Tambahkan ke keranjang** di section bawahnya.
- Klik cover game membuka **popup**: screenshot full, thumbnail-switcher, deskripsi, link YouTube, **harga kiri + tombol kanan**.
- **Keranjang**: list item **scroll horizontal**, kontrol qty, hapus item, subtotal, **diskon otomatis** (5=10%, 10=15%, 15=20% hanya untuk jumlah game PS3/PS4), total.
- Tombol **Kirim ke Admin (WA)** akan otomatis **generate PDF invoice** dan membuka WhatsApp dengan ringkasan order.

## Struktur Kode
- `src/data/ps3.ts` — daftar game PS3
- `src/data/ps4.ts` — daftar game PS4
- `src/data/products.ts` — daftar Produk Lainnya
- `src/components/*` — komponen UI modular (Header, Tabs, GameCard, GameDetailModal, CartModal, dll)
- `src/App.tsx` — logic utama aplikasi
- `src/styles/index.css` — Tailwind CSS

## Menjalankan secara lokal
1. Pastikan Node.js v18+ terpasang.
2. Install dependensi:
   ```bash
   npm install
   ```
3. Jalankan dev server:
   ```bash
   npm run dev
   ```
4. Build produksi:
   ```bash
   npm run build
   npm run preview
   ```

   Test Build
