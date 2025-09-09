import * as React from "react";
import GameCard from "./GameCard";
import { Game, Platform } from "../types";

type Props = {
  games: Game[];
  platform: Platform;
  onAdd: (g: Game) => void;
  onOpen: (g: Game) => void;
  formatIDR: (n: number) => string;
  fitContainCovers?: boolean;  // true = object-contain cover
  useFixedHeights?: boolean;   // seragamkan tinggi kartu
  title?: string;
  limit?: number;
};

// helper kelas sederhana (pengganti clsx)
function cx(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ");
}

export default function LatestGamesRow({
  games,
  platform,
  onAdd,
  onOpen,
  formatIDR,
  fitContainCovers = false,   // default disamakan dengan GameCard
  useFixedHeights = true,     // default true biar seragam tingginya
  title = "Game Terbaru",
  limit = 10,
}: Props) {
  const latest = React.useMemo(() => {
    return games
      .filter((g) => g.platform === platform)
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
      .slice(0, limit);
  }, [games, platform, limit]);

  if (!latest.length) {
    return (
      <section className="mb-6" aria-label={title}>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-lg font-bold">{title}</h2>
          <span className="text-xs text-gray-500">Belum ada game.</span>
        </div>
      </section>
    );
  }

  const [enableSmooth, setEnableSmooth] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      setEnableSmooth(!reduce);
    }
  }, []);

  return (
    <section className="mb-6 relative" aria-label={title}>
      {/* Fade edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent"
        aria-hidden="true"
      />

      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="text-xs text-gray-500">
          Menampilkan {latest.length} game
        </span>
      </div>

      <div
        className={cx(
          "-mx-4 px-4 overflow-x-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
          enableSmooth && "scroll-smooth"
        )}
        tabIndex={0}
        aria-label={`${title} — daftar geser`}
      >
        <ul
          className="flex gap-5 items-stretch snap-x snap-mandatory"
          role="list"
        >
          {latest.map((g) => (
            <li
              key={g.id}
              className="shrink-0 snap-start h-full"
              style={{ width: "clamp(260px, 28vw, 320px)" }} // lebar konsisten & responsif
            >
              <GameCard
                game={g}
                onAdd={() => onAdd(g)}
                onOpen={() => onOpen(g)}
                formatIDR={formatIDR}
                fitContain={fitContainCovers}
                fixedHeights={useFixedHeights} // penting untuk stretch card
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
