export type Platform = 'PS3' | 'PS4';

export type Game = {
  id: string;
  platform: Platform;
  name: string;
  size: string;
  build: string;
  year: number;
  players: string;
  price: number;
  cover: string;
  screenshots: string[];
  youtubeQuery: string;
  description: string;

  // opsional: bisa isi link langsung ke video YouTube
  gameplayYoutubeUrl?: string;
};
