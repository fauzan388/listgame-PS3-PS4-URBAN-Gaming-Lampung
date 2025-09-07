import React from 'react';
import { MessageCircle, ShoppingCart, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

type Props = {
  cartCount: number;
  onChatAdmin: () => void;
  onOpenCart: () => void;
  onOpenAnnouncement: () => void;
};

export default function FloatingActions({ cartCount, onChatAdmin, onOpenCart, onOpenAnnouncement }: Props) {
  const Item = ({
    children,
    onClick,
    className,
    label,
  }: { children: React.ReactNode; onClick: () => void; className: string; label: string }) => (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative flex items-center justify-center gap-2 rounded-xl px-4 py-3 shadow-lg border text-white w-48 h-12 ${className}`}
      aria-label={label}
    >
      {children}
      <span className="text-sm font-semibold">{label}</span>
    </motion.button>
  );

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col-reverse gap-3 md:right-6 md:bottom-6">
      <Item
        onClick={onOpenAnnouncement}
        className="bg-red-600 border-red-700 hover:brightness-110 active:brightness-95"
        label="Pengumuman"
      >
        <Megaphone className="w-5 h-5" />
      </Item>

      <div className="relative">
        <Item
          onClick={onOpenCart}
          className="bg-black border-black hover:brightness-110 active:brightness-95"
          label="Keranjang"
        >
          <ShoppingCart className="w-5 h-5" />
        </Item>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 grid place-items-center w-5 h-5 rounded-full text-[11px] bg-white text-black font-bold border">
            {cartCount}
          </span>
        )}
      </div>

      <Item
        onClick={onChatAdmin}
        className="bg-green-500 border-green-600 hover:brightness-110 active:brightness-95"
        label="Chat Admin"
      >
        <MessageCircle className="w-5 h-5" />
      </Item>
    </div>
  );
}
