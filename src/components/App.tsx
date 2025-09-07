import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import GameCard from './components/GameCard';
import GameDetailModal from './components/GameDetailModal';
import CartModal from './components/CartModal';
import OtherProductsGrid from './components/OtherProductsGrid';
import Footer from './components/Footer';
import { CartItem, Game } from './types';
import { ps3Games } from './data/ps3';
import { ps4Games } from './data/ps4';
import { otherProducts } from './data/products';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const WHATSAPP_NUMBER = '6285709647790';
const STORE = {
  name: 'URBAN PlayStation Lampung',
  address:
    'Jl. Imam Bonjol No.380, Segala Mider, Kec. Langkapura, Kota Bandar Lampung, Lampung 35118',
  mapsUrl: 'https://maps.app.goo.gl/5N2GSLRw9Dt2JkGp7',
} as const;

const TABS = ['PS3', 'PS4', 'Produk Lainnya'] as const;
type Tab = (typeof TABS)[number];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('PS3');
  const [sortBy, setSortBy] = useState(
    'abjad' as 'abjad' | 'harga-asc' | 'harga-desc' | 'rilis-new' | 'rilis-old'
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selected, setSelected] = useState<Game | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const games = useMemo(() => [...ps3Games, ...ps4Games], []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('urbanps_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('urbanps_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const displayedGames = useMemo(() => {
    const filtered = games.filter((g) => g.platform === activeTab);
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'harga-asc':
          return a.price - b.price;
        case 'harga-desc':
          return b.price - a.price;
        case 'rilis-new':
          return b.year - a.year;
        case 'rilis-old':
          return a.year - b.year;
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return sorted;
  }, [activeTab, sortBy, games]);

  const cartCount = cart.reduce((acc, it) => acc + it.qty, 0);

  const { subtotal, discountPercent, discountAmount, total } = useMemo(() => {
    const sub = cart.reduce((s, it) => s + it.price * it.qty, 0);
    const countGames = cart.reduce(
      (n, it) => n + ((it.platform === 'PS3' || it.platform === 'PS4') ? it.qty : 0),
      0
    );
    const subGames = cart.reduce(
      (s, it) => s + ((it.platform === 'PS3' || it.platform === 'PS4') ? it.price * it.qty : 0),
      0
    );
    let percent = 0;
    if (countGames >= 15) percent = 20;
    else if (countGames >= 10) percent = 15;
    else if (countGames >= 5) percent = 10;
    const disc = Math.floor((subGames * percent) / 100);
    return { subtotal: sub, discountPercent: percent, discountAmount: disc, total: sub - disc };
  }, [cart]);

  function addToCart(game: Game) {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === game.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [
        ...prev,
        { id: game.id, name: game.name, platform: game.platform, price: game.price, qty: 1 },
      ];
    });
    showQuickToast('Ditambahkan ke keranjang ✅');
  }

  function addProductToCart(id: string, name: string, price: number) {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { id, name, platform: 'PRODUK', price, qty: 1 }];
    });
    showQuickToast('Ditambahkan ke keranjang ✅');
  }

  function formatIDR(v: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(v);
  }

  function showQuickToast(text: string) {
    setToast(text);
    setTimeout(() => setToast(null), 1900);
  }

  function waUrl(message: string) {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  }

  // ====== FIX: Buka WhatsApp dulu, lalu generate+download PDF (dengan fallback bila plugin table tidak ada) ======
  function handleCheckout() {
    if (cart.length === 0) {
      showQuickToast('Keranjang kosong');
      return;
    }

    // Siapkan data pesan & nama file lebih dulu
    const now = new Date();
    const ts = now
      .toLocaleString('id-ID', { hour12: false })
      .replace(/[/:]/g, '-')
      .replace(/\s/g, '_');
    const filename = `Invoice-URBAN-PlayStation-${ts}.pdf`;

    const formatLine = (it: CartItem, i: number) =>
      `${i + 1}. ${it.name} [${it.platform}] x${it.qty} — ${formatIDR(it.price * it.qty)}`;

    const msgLines = [
      `Halo Admin, saya ingin order:`,
      ``,
      ...cart.map(formatLine),
      ``,
      `Subtotal: ${formatIDR(subtotal)}`,
      `Diskon (${discountPercent}%): -${formatIDR(discountAmount)}`,
      `TOTAL: ${formatIDR(total)}`,
      ``,
      `Invoice PDF akan terunduh otomatis: ${filename}`,
    ];
    const urlWA = waUrl(msgLines.join('\n'));

    // 1) Buka WhatsApp DULU agar tidak dianggap popup terblokir
    try {
      window.open(urlWA, '_blank', 'noopener');
    } catch {}

    // 2) Lanjut: generate & unduh PDF via Blob (non-blocking)
    setTimeout(() => {
      try {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(16);
        doc.text(`Invoice — ${STORE.name}`, 14, 16);
        doc.setFontSize(10);
        doc.text(STORE.address, 14, 22, { maxWidth: 180 });
        doc.text(`Tanggal: ${now.toLocaleString('id-ID')}`, 14, 28);

        // Tabel (gunakan plugin bila ada, jika tidak ada → fallback manual)
        const rows = cart.map((it, i) => [
          i + 1,
          it.name,
          it.platform,
          formatIDR(it.price),
          it.qty,
          formatIDR(it.price * it.qty),
        ]);

        const hasAutoTable =
          typeof (doc as any).autoTable === 'function' ||
          typeof (doc as any).__autoTable === 'object';

        if (hasAutoTable) {
          // @ts-ignore
          doc.autoTable({
            startY: 34,
            head: [['No', 'Nama Item', 'Konsol/Produk', 'Harga', 'Qty', 'Subtotal']],
            body: rows,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [80, 80, 80] },
          });
        } else {
          // Fallback sederhana jika plugin belum aktif
          let y = 40;
          doc.setFontSize(11);
          doc.text('Daftar Item:', 14, 34);
          cart.forEach((it, i) => {
            const line = `${i + 1}. ${it.name} [${it.platform}] x${it.qty} — ${formatIDR(
              it.price * it.qty
            )}`;
            doc.text(line, 14, y);
            y += 6;
          });
          // @ts-ignore
          (doc as any).lastAutoTable = { finalY: y };
        }

        let y =
          // @ts-ignore
          ((doc as any).lastAutoTable?.finalY ?? 34) + 6;
        doc.setFontSize(11);
        doc.text(`Subtotal: ${formatIDR(subtotal)}`, 140, y);
        y += 6;
        doc.text(`Diskon (${discountPercent}%): -${formatIDR(discountAmount)}`, 140, y);
        y += 6;
        doc.setFont(undefined, 'bold');
        doc.text(`TOTAL: ${formatIDR(total)}`, 140, y);
        doc.setFont(undefined, 'normal');

        y += 12;
        doc.setFontSize(10);
        doc.text(
          `Terima kasih telah order di ${STORE.name}. Hubungi Admin: +62 857-0964-7790 (WhatsApp).`,
          14,
          y,
          { maxWidth: 180 }
        );

        // Unduh via Blob (kompatibel lintas browser)
        const blob = doc.output('blob');
        const urlBlob = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(urlBlob), 1500);

        showQuickToast('Invoice diunduh & WhatsApp dibuka');
      } catch (err) {
        console.error('PDF error:', err);
        // Minimal: pastikan WA tetap terbuka
        try {
          window.open(urlWA, '_blank', 'noopener');
        } catch {}
        showQuickToast('WA dibuka (PDF gagal dibuat)');
      }
    }, 0);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <Header store={STORE} cartCount={cartCount} onCartClick={() => setShowCart(true)} />

      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="abjad">Berdasarkan Abjad (A-Z)</option>
              <option value="harga-asc">Harga Terendah</option>
              <option value="harga-desc">Harga Tertinggi</option>
              <option value="rilis-new">Rilis Paling Baru</option>
              <option value="rilis-old">Rilis Paling Jadul</option>
            </select>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'Produk Lainnya' ? (
          <OtherProductsGrid
            products={otherProducts}
            onAdd={(p) => addProductToCart(p.id, p.name, p.price)}
            formatIDR={formatIDR}
          />
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayedGames.map((g) => (
              <GameCard
                key={g.id}
                game={g}
                onAdd={() => addToCart(g)}
                onOpen={() => setSelected(g)}
                formatIDR={formatIDR}
              />
            ))}
          </motion.div>
        )}
      </main>

      <Footer />

      <AnimatePresence>
        {selected && (
          <GameDetailModal
            game={selected}
            onAdd={() => addToCart(selected)}
            onClose={() => setSelected(null)}
            formatIDR={formatIDR}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCart && (
          <CartModal
            items={cart}
            setItems={setCart}
            onClose={() => setShowCart(false)}
            formatIDR={formatIDR}
            subtotal={subtotal}
            discountPercent={discountPercent}
            discountAmount={discountAmount}
            total={total}
            onCheckout={handleCheckout}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] rounded-full bg-gray-900 text-white text-sm px-4 py-2 shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
