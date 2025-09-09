// GameCard.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, ShoppingCart } from 'lucide-react';
import { Game } from '../types';
import { isUnavailable, displayName } from '../utils/inventory';

export default function GameCard({
  game,
  onAdd,
  onOpen,
  formatIDR,
  fitContain = false,
  fixedHeights = false, // <-- BARU
}: {
  game: Game;
  onAdd: () => void;
  onOpen: () => void;
  formatIDR: (n: number) => string;
  fitContain?: boolean;
  fixedHeights?: boolean; // <-- BARU
}) {
  const [flash, setFlash] = React.useState(false);
  const unavailable = isUnavailable(game.name);
  const shownName = displayName(game.name);

  function handleAdd() {
    if (unavailable) return;
    onAdd();
    setFlash(true);
    setTimeout(() => setFlash(false), 1100);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={unavailable ? {} : { y: -4 }}
      className="relative group rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow
                 flex flex-col h-full"
    >
      <button onClick={onOpen} className="block w-full relative flex-shrink-0" title="Lihat detail">
        {/* Cover fix 3:4 */}
        <div className={`relative w-full overflow-hidden aspect-[3/4] ${fitContain ? 'bg-gray-100' : ''}`}>
          <img
            src={game.cover}
            alt={shownName}
            loading="lazy"
            decoding="async"
            className={[
              'absolute inset-0 h-full w-full',
              fitContain ? 'object-contain' : 'object-cover',
              unavailable ? 'opacity-60' : '',
            ].join(' ')}
          />
        </div>

        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 text-[11px] bg-white/90 backdrop-blur rounded-full px-2 py-1 border border-gray-200">
          <PlayCircle className="w-3.5 h-3.5" /> Preview
        </span>
      </button>

      <div className="p-4 flex flex-col flex-1">
        {/* Judul terkunci 2 baris */}
        <h3
          className={[
            'font-bold text-gray-900 line-clamp-2 leading-snug',
            fixedHeights ? 'min-h-[2.6rem]' : '', // ~2 baris @ leading-snug
          ].join(' ')}
          title={shownName}
        >
          {shownName}
        </h3>

        {/* Meta terkunci tinggi + cegah wrap aneh */}
        <div
          className={[
            'mt-1 text-xs text-gray-600 grid grid-cols-2 gap-y-1',
            fixedHeights ? 'min-h-[3.4rem]' : '', // kira-kira 2 baris info
          ].join(' ')}
        >
          <span className="whitespace-nowrap">
            Ukuran: <b className="text-gray-800">{game.size}</b>
          </span>
          <span className="whitespace-nowrap">
            Rilis: <b className="text-gray-800">{game.year}</b>
          </span>
          <span className="whitespace-nowrap">
            Build: <b className="text-gray-800">{game.build}</b>
          </span>
          <span className="whitespace-nowrap">
            Player: <b className="text-gray-800">{game.players}</b>
          </span>
        </div>

        <div className="mt-auto">
          <div className="text-lg font-extrabold tracking-tight whitespace-nowrap">
            {formatIDR(game.price)}
          </div>

          <button
            onClick={handleAdd}
            disabled={unavailable}
            className={`mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold px-3 py-2 transition
              ${unavailable
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[.98]'}`}
          >
            {unavailable ? (
              <>Game Tidak Tersedia</>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Tambahkan ke keranjang
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {flash && !unavailable && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-800/70 text-white grid place-items-center text-xs font-semibold"
          >
            sudah di masukan ke dalam keranjang
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
