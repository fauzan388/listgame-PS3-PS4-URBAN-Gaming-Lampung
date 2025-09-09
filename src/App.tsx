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
import { CartItem, Game, Product } from './types';
import { ps3Games } from './data/ps3';
import { ps4Games } from './data/ps4';
import { otherProducts } from './data/products';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import LatestGamesRow from './components/LatestGamesRow';

// tambahan
import FloatingActions from './components/FloatingActions';
import AnnouncementModal from './components/AnnouncementModal';
import OtherProductDetailModal from './components/OtherProductDetailModal';

// utils inventory
import { isUnavailable, displayName, alphaCompareIgnoringSlash } from './utils/inventory';

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
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selected, setSelected] = useState<Game | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const q = query.trim().toLowerCase();
  const match = (s: string) => displayName(s).toLowerCase().includes(q);

  const displayedGames = useMemo(() => {
    const filtered = games
      .filter((g) => g.platform === activeTab)
      .filter((g) => !q || match(g.name));

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
          // abjad: abaikan "/" di depan nama
          return alphaCompareIgnoringSlash(a.name, b.name);
      }
    });
    return sorted;
  }, [activeTab, sortBy, games, q]);

  const filteredOtherProducts = useMemo(() => {
    if (!q) return otherProducts;
    return otherProducts.filter((p) => match(p.name));
  }, [q]);

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
    // tolak jika tidak tersedia
    if (isUnavailable(game.name)) {
      showQuickToast('Game Tidak Tersedia ❌');
      return;
    }
    const cleanName = displayName(game.name);
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === game.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1, name: cleanName };
        return copy;
      }
      return [
        ...prev,
        { id: game.id, name: cleanName, platform: game.platform, price: game.price, qty: 1 },
      ];
    });
    showQuickToast('Ditambahkan ke keranjang ✅');
  }

  function addProductToCart(id: string, name: string, price: number) {
    if (isUnavailable(name)) {
      showQuickToast('Stok kosong ❌');
      return;
    }
    const cleanName = displayName(name);
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1, name: cleanName };
        return copy;
      }
      return [...prev, { id, name: cleanName, platform: 'PRODUK', price, qty: 1 }];
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

  // floating Chat Admin
  function chatAdmin() {
    const url = `https://wa.me/${WHATSAPP_NUMBER}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <Header store={STORE} cartCount={cartCount} onCartClick={() => setShowCart(true)} />

      {/* filter bar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
          <div className="flex flex-1 md:flex-none items-center gap-2">
            <div className="relative w-full md:w-80">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder={activeTab === 'Produk Lainnya' ? 'Cari produk…' : 'Cari game…'}
              />
              <svg
                className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-60"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 21l-4.3-4.3m1.55-4.45a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

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
      </div>

      {/* content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'Produk Lainnya' ? (
          <OtherProductsGrid
            products={filteredOtherProducts}
            onAdd={(p) => addProductToCart(p.id, p.name, p.price)}
            onOpen={(p) => setSelectedProduct(p)}
            formatIDR={formatIDR}
          />
        ) : (
          <>
            {/* SECTION: Game Terbaru (maks 10, urut tahun terbaru, horizontal scroll) */}
            {(activeTab === 'PS3' || activeTab === 'PS4') && (
              <LatestGamesRow
                games={activeTab === 'PS3' ? ps3Games : ps4Games}
                platform={activeTab as 'PS3' | 'PS4'}
                onAdd={(g) => addToCart(g)}
                onOpen={(g) => setSelected(g)}
                formatIDR={formatIDR}
              />
            )}

            {/* GRID semua game */}
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
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
          </>
        )}
      </main>

      <Footer />

      {/* modals */}
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
            onCheckout={() => setShowCart(false)}
          />
        )}
      </AnimatePresence>

      <OtherProductDetailModal
        open={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={(p) => {
          addProductToCart(p.id, p.name, p.price);
          setSelectedProduct(null);
        }}
        formatIDR={formatIDR}
      />

      <AnnouncementModal open={showAnnouncement} onClose={() => setShowAnnouncement(false)} />

      {/* floating actions */}
      <FloatingActions
        cartCount={cartCount}
        onChatAdmin={chatAdmin}
        onOpenCart={() => setShowCart(true)}
        onOpenAnnouncement={() => setShowAnnouncement(true)}
      />

      {/* toast */}
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
