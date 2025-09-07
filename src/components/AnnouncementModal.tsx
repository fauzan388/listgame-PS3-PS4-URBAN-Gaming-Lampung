import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function AnnouncementModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            className="relative mx-auto mt-16 max-w-xl rounded-3xl bg-white shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-black">Pengumuman Promo</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Tutup">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-3 text-gray-800">
                <p className="text-sm">Promo khusus pembelian game PS3/PS4:</p>
                <ul className="text-sm grid gap-2">
                  <li className="rounded-xl border p-3">isi <b>5</b> game : <b>diskon 10%</b></li>
                  <li className="rounded-xl border p-3">isi <b>10</b> game : <b>diskon 15%</b></li>
                  <li className="rounded-xl border p-3">isi <b>15</b> game : <b>diskon 20%</b></li>
                </ul>
                <p className="text-xs text-gray-500">Diskon otomatis dihitung di keranjang.</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={onClose} className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50">
                  Mengerti
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
