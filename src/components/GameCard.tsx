import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, ShoppingCart } from 'lucide-react';
import { Game } from '../types';

export default function GameCard({
  game,
  onAdd,
  onOpen,
  formatIDR,
}: {
  game: Game;
  onAdd: () => void;
  onOpen: () => void;
  formatIDR: (n: number) => string;
}) {
  const [flash, setFlash] = React.useState(false);
  function handleAdd() {
    onAdd();
    setFlash(true);
    setTimeout(() => setFlash(false), 1100);
  }
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative group rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <button onClick={onOpen} className="block w-full relative" title="Lihat detail">
        <img src={game.cover} alt={game.name} className="w-full aspect-[3/4] object-cover" />
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 text-[11px] bg-white/90 backdrop-blur rounded-full px-2 py-1 border border-gray-200">
          <PlayCircle className="w-3.5 h-3.5" /> Preview
        </span>
      </button>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 line-clamp-1">{game.name}</h3>
        <div className="mt-1 text-xs text-gray-600 grid grid-cols-2 gap-y-1">
          <span>Ukuran: <b className="text-gray-800">{game.size}</b></span>
          <span>Rilis: <b className="text-gray-800">{game.year}</b></span>
          <span>Build: <b className="text-gray-800">{game.build}</b></span>
          <span>Player: <b className="text-gray-800">{game.players}</b></span>
        </div>

        <div className="mt-3">
          <div className="text-lg font-extrabold tracking-tight">{formatIDR(game.price)}</div>
          <button
            onClick={handleAdd}
            className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold px-3 py-2 hover:bg-gray-800 active:scale-[.98]"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Tambahkan ke keranjang
          </button>
        </div>
      </div>

      <AnimatePresence>
        {flash && (
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