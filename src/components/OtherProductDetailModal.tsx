import React, { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Product } from "../types";
import { isUnavailable, displayName } from "../utils/inventory";

/**
 * Modal detail produk dengan dukungan hingga 3 screenshot tambahan.
 * Integrasi stok: nama diawali "/" => dianggap habis.
 */
export default function OtherProductDetailModal({
  open,
  product,
  onClose,
  onAdd,
  formatIDR,
}: {
  open: boolean;
  product: (Product & { images?: string[] }) | null;
  onClose: () => void;
  onAdd?: (p: Product) => void;
  formatIDR: (n: number) => string;
}) {
  const fallback = "https://picsum.photos/seed/default/800/800";

  const unavailable = !!product && isUnavailable(product.name);
  const shownName = product ? displayName(product.name) : "";

  // Ambil maksimal 3 screenshot
  const screenshots = useMemo(() => (product?.images ?? []).slice(0, 3), [product]);

  // Daftar thumbnail: cover + screenshot (TANPA dedup)
  const thumbs = useMemo(() => {
    const list: string[] = [];
    if (product?.cover) list.push(product.cover);
    screenshots.forEach((s) => list.push(s));
    return list.filter(Boolean).slice(0, 4);
  }, [product?.cover, screenshots]);

  // Index gambar aktif (pakai index, bukan URL)
  const [mainIndex, setMainIndex] = useState(0);
  useEffect(() => {
    setMainIndex(0); // reset saat product berubah
  }, [product?.id]);

  const mainSrc = thumbs[mainIndex] || fallback;

  return (
    <AnimatePresence>
      {open && product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-modal
          role="dialog"
          aria-labelledby="product-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="mx-auto mt-16 w-[90vw] max-w-xl rounded-3xl bg-white overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 id="product-title" className="text-base md:text-lg font-extrabold line-clamp-2">
                {shownName}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media */}
            <div className="bg-gray-50 border-b">
              <div className="aspect-square w-full overflow-hidden">
                <img
                  src={mainSrc || fallback}
                  alt={`${shownName} - pratinjau`}
                  className={`w-full h-full object-cover ${unavailable ? "opacity-60" : ""}`}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = fallback;
                  }}
                />
              </div>

              {thumbs.length > 1 && (
                <div className="px-4 py-3 flex gap-2 overflow-x-auto bg-white">
                  {thumbs.map((src, i) => {
                    const isActive = i === mainIndex;
                    return (
                      <button
                        key={`${i}`}
                        onClick={() => setMainIndex(i)}
                        className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border transition ${
                          isActive ? "ring-2 ring-gray-900" : "hover:opacity-90"
                        }`}
                        aria-label={`Lihat gambar ${i + 1}`}
                      >
                        <img
                          src={src}
                          alt={`${shownName} - gambar ${i + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = fallback;
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              <div className="text-xl font-extrabold tracking-tight">
                {formatIDR(product.price)}
              </div>

              <div className="text-sm text-gray-800 leading-relaxed">
                {product.note ? (
                  <p>{product.note}</p>
                ) : (
                  <p className="text-gray-500 italic">Belum ada keterangan.</p>
                )}
              </div>

              {onAdd && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (!unavailable) onAdd(product);
                    }}
                    disabled={unavailable}
                    className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition
                      ${unavailable
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-gray-900 text-white hover:bg-gray-800 active:scale-[.98]"}
                    `}
                  >
                    {unavailable ? "Stok kosong" : "Tambah ke keranjang"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
