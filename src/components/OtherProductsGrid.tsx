import React from 'react';
import { Product } from '../types';
import OtherProductCard from './OtherProductCard';

export default function OtherProductsGrid({
  products,
  onAdd,
  onOpen,
  formatIDR,
}: {
  products: Product[];
  onAdd: (p: Product) => void;
  onOpen?: (p: Product) => void; // baru: untuk buka modal preview
  formatIDR: (n: number) => string;
}) {
  if (!products?.length) {
    return (
      <div className="w-full py-16 text-center text-gray-500">
        Produk tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((p) => (
        <OtherProductCard
          key={p.id}
          product={p}
          onAdd={() => onAdd(p)}
          onOpen={onOpen ? () => onOpen(p) : undefined} // diteruskan ke card
          formatIDR={formatIDR}
        />
      ))}
    </div>
  );
}
