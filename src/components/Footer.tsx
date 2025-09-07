import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} URBAN PlayStation Lampung · Desain retro putih & abu dengan UI modern · Dibuat untuk keperluan isi game PS3 & PS4
      </div>
    </footer>
  );
}