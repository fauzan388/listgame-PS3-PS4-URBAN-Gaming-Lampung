import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

export default function Header({
  store,
  cartCount, // masih ada supaya tidak error, tapi tidak dipakai lagi
  onCartClick, // juga tidak dipakai
}: {
  store: { name: string; address: string; mapsUrl: string };
  cartCount: number;
  onCartClick: () => void;
}) {
  return (
    <header className="relative border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <RentalLogo />
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-gray-900">
                List Game PS3 & PS4 <span className="text-gray-600">{store.name}</span>
              </h1>
            </div>
            <p className="text-xs md:text-sm text-gray-600 mt-1 flex items-center gap-2 flex-wrap">
              <MapPin className="w-4 h-4" />
              <span>{store.address}</span>
              {/* Link kecil Lihat Maps dihapus, sekarang jadi tombol di kanan */}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={store.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 text-white px-3 py-2 text-sm font-semibold hover:bg-gray-800 active:scale-[.98] shadow"
            >
              <MapPin className="w-5 h-5" />
              <span className="hidden sm:block">Lihat Maps</span>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function RentalLogo() {
  return (
    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-300 shadow-sm bg-white">
      <img
        src="https://i.ibb.co.com/207KDFc7/PLAYBOX.png"
        alt="Logo"
        className="w-full h-full object-contain p-1"
      />
    </div>
  );
}
