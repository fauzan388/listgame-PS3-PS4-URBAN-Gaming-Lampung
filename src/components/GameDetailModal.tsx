import React from 'react';
import { motion } from 'framer-motion';
import { X, PlayCircle, ShoppingCart } from 'lucide-react';
import { Game } from '../types';

export default function GameDetailModal({
  game,
  onClose,
  onAdd,
  formatIDR,
}: {
  game: Game & { gameplayYoutubeUrl?: string }; // opsional
  onClose: () => void;
  onAdd: () => void;
  formatIDR: (n: number) => string;
}) {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  React.useEffect(() => setActiveIndex(0), [game]);

  // Ubah berbagai format YouTube ke URL embed
  const toEmbedUrl = (url: string) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) {
        // https://youtu.be/VIDEOID -> /embed/VIDEOID
        const id = u.pathname.replace('/', '');
        return `https://www.youtube.com/embed/${id}`;
      }
      if (u.searchParams.get('v')) {
        return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
      }
      // Jika sudah embed atau format lain, pakai apa adanya
      return url;
    } catch {
      return url;
    }
  };

  const fallbackQuery =
    game.youtubeQuery && game.youtubeQuery.trim().length > 0
      ? game.youtubeQuery
      : `${game.name} gameplay`;

  const videoSrc = game.gameplayYoutubeUrl
    ? toEmbedUrl(game.gameplayYoutubeUrl)
    : `https://www.youtube-nocookie.com/embed?rel=0&listType=search&list=${encodeURIComponent(
        fallbackQuery
      )}`;

  const imageSlides: string[] = [...(game.screenshots || []), game.cover].filter(Boolean);
  const slides: Array<{ type: 'video' | 'image'; src: string }> = [
    { type: 'video', src: videoSrc },
    ...imageSlides.map((s) => ({ type: 'image' as const, src: s })),
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
    >
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        className="relative mx-auto mt-10 mb-10 max-w-3xl rounded-3xl bg-white shadow-xl overflow-hidden"
      >
        {/* Media utama */}
        <div className="relative">
          {slides[activeIndex]?.type === 'video' ? (
            <iframe
              className="w-full aspect-video"
              src={slides[activeIndex].src}
              title={`${game.name} gameplay`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <img
              src={slides[activeIndex]?.src}
              alt={game.name}
              className="w-full aspect-video object-cover"
              loading="lazy"
            />
          )}

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="px-5 pt-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`border rounded-lg overflow-hidden shrink-0 ${
                  activeIndex === i ? 'ring-2 ring-gray-800' : 'border-gray-200'
                }`}
                aria-label={s.type === 'video' ? 'Video gameplay' : `Screenshot ${i}`}
              >
                {s.type === 'video' ? (
                  <div className="w-28 h-16 flex items-center justify-center bg-black text-white text-xs font-semibold">
                    ▶ Video
                  </div>
                ) : (
                  <img src={s.src} className="w-28 h-16 object-cover" loading="lazy" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Info game */}
        <div className="p-5 md:p-6">
          <h3 className="text-xl md:text-2xl font-black text-gray-900">
            {game.name} <span className="text-gray-600">[{game.platform}]</span>
          </h3>
          <div className="mt-1 text-sm text-gray-600">
            Rilis {game.year} • Ukuran {game.size} • Build {game.build} • Player {game.players}
          </div>
          <p className="mt-3 text-gray-800 leading-relaxed text-sm md:text-base">{game.description}</p>

          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(fallbackQuery)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 underline"
            >
              <PlayCircle className="w-4 h-4" /> Buka di YouTube
            </a>
          </div>

          {/* Harga & CTA */}
          <div className="mt-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Harga</div>
              <div className="text-2xl font-extrabold">{formatIDR(game.price)}</div>
            </div>
            <button
              onClick={onAdd}
              className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 text-white text-sm font-semibold px-4 py-3 hover:bg-gray-800 active:scale-[.98]"
            >
              <ShoppingCart className="w-4 h-4" /> Tambahkan ke Keranjang
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
