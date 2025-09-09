import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { isUnavailable, displayName } from '../utils/inventory';

export default function OtherProductCard({
  product,
  onAdd,
  onOpen,        // NEW: buka preview
  formatIDR,
}: {
  product: Product;
  onAdd: () => void;
  onOpen?: () => void;     // optional biar backward compatible
  formatIDR: (n: number) => string;
}) {
  const [flash, setFlash] = React.useState(false);

  const unavailable = isUnavailable(product.name);
  const shownName = displayName(product.name);

  function handleAdd() {
    if (unavailable) return;
    onAdd();
    setFlash(true);
    setTimeout(() => setFlash(false), 1100);
  }

  return (
    <div
      className={`relative group rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm transition-all ${
        unavailable ? '' : 'hover:shadow-md'
      }`}
    >
      {/* cover 1:1 + klik untuk preview */}
      <button
        type="button"
        onClick={onOpen}
        className="block w-full relative focus:outline-none"
        aria-label={`Preview ${shownName}`}
      >
        <img
          src={product.cover || 'https://picsum.photos/seed/default/400/400'}
          alt={shownName}
          className={`w-full aspect-square object-cover ${unavailable ? 'opacity-60' : ''}`}
        />
      </button>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 line-clamp-1">{shownName}</h3>

        {product.note && (
          <span className="inline-flex text-[11px] mt-1 px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-700">
            {product.note}
          </span>
        )}

        <div className="mt-3">
          <div className="text-lg font-extrabold tracking-tight">{formatIDR(product.price)}</div>
          <button
            onClick={handleAdd}
            disabled={unavailable}
            className={`mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold px-3 py-2 transition
              ${unavailable
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[.98]'}
            `}
          >
            {unavailable ? 'Stok kosong' : (<><ShoppingCart className="w-3.5 h-3.5" /> Tambahkan ke keranjang</>)}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {flash && !unavailable && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-800/70 text-white grid place-items-center text-xs font-semibold"
          >
            sudah di masukan ke dalam keranjang
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
