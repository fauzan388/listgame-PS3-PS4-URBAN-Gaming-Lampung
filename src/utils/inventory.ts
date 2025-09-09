// src/utils/inventory.ts

/**
 * Mengecek apakah nama produk/game ditandai tidak tersedia
 * dengan awalan "/" (mis. "/FIFA 25").
 */
export const isUnavailable = (name: string) => /^\s*\//.test(name || "");

/**
 * Menghapus tanda "/" di depan nama untuk ditampilkan.
 * Contoh: "/FIFA 25" => "FIFA 25".
 */
export const displayName = (name: string) =>
  (name || "").replace(/^\s*\//, "").trim();

/**
 * Comparator untuk sorting alfabetis, mengabaikan tanda "/".
 * Jadi "/FIFA 25" tetap sejajar dengan "FIFA 25" secara alfabet.
 */
export const alphaCompareIgnoringSlash = (a: string, b: string) =>
  displayName(a).localeCompare(displayName(b), "id", { sensitivity: "base" });
