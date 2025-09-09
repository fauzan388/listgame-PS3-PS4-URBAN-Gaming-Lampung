// GameList.tsx
import React from 'react';
import GameCard from './GameCard';
import { Game } from '../types';

export default function GameList({
  games,
  onAdd,
  onOpen,
  formatIDR,
}: {
  games: Game[];
  onAdd: (game: Game) => void;
  onOpen: (game: Game) => void;
  formatIDR: (n: number) => string;
}) {
  return (
    <section className="w-full">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Game Lainnya
      </h2>

      {/* Grid kumpulan kartu */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onAdd={() => onAdd(game)}
            onOpen={() => onOpen(game)}
            formatIDR={formatIDR}
            fitContain
            fixedHeights
          />
        ))}
      </div>
    </section>
  );
}
