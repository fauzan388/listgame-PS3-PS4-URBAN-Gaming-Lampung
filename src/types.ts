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
};

export type Product = {
  id: string;
  name: string;
  price: number;
  note?: string;
  cover?: string;
};

export type CartItem = {
  id: string;
  name: string;
  platform: Platform | 'PRODUK';
  price: number;
  qty: number;
};