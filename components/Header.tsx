"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { label: "비교하기", href: "/products" },
  { label: "🔥 오늘의 가성비", href: "/ranking" },
  { label: "계산기", href: "/calculator" },
];

const categories = [
  { id: "chicken", label: "닭가슴살", href: "/products?category=chicken" },
  { id: "protein_powder", label: "단백질 보충제", href: "/products?category=protein_powder" },
  { id: "protein_snack", label: "단백질 간식", href: "/products?category=protein_snack" },
  { id: "zero", label: "제로 식품", href: "/products?category=zero" },
];

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      return;
    }
    router.push(`/products?query=${encodeURIComponent(trimmed)}`);
    setIsMobileSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-black/10 bg-[#f7f5f0] text-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.18em]">
          Protein Compare
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[#e16b4b]">
              {link.label}
            </Link>
          ))}
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 transition hover:text-[#e16b4b]"
              aria-haspopup="true"
              aria-expanded="false"
            >
              카테고리
              <span className="text-xs">▾</span>
            </button>
            <div className="absolute left-1/2 top-full z-20 mt-3 w-48 -translate-x-1/2 rounded-2xl border border-black/10 bg-white p-2 text-sm font-semibold text-black/70 opacity-0 shadow-lg transition group-hover:opacity-100">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={category.href}
                  className="block rounded-xl px-3 py-2 transition hover:bg-black/5 hover:text-[#e16b4b]"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="hidden items-center md:flex">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="제품명/브랜드 검색"
              className="h-9 w-44 rounded-full border border-black/15 bg-white px-4 text-xs font-semibold text-black/70 transition focus:border-black/40 focus:outline-none"
              aria-label="제품명 또는 브랜드 검색"
            />
          </form>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/20 text-sm font-semibold transition hover:border-black/50 md:hidden"
            onClick={() => setIsMobileSearchOpen((prev) => !prev)}
            aria-label="검색 열기"
            aria-expanded={isMobileSearchOpen}
          >
            🔍
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/20 text-sm font-semibold transition hover:border-black/50 md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="메뉴 열기"
            aria-expanded={isMobileMenuOpen}
          >
            ☰
          </button>
          <Link
            href="/products"
            className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold transition hover:border-black/50 hover:bg-black/5"
          >
            비교 시작
          </Link>
        </div>
      </div>

      {isMobileSearchOpen ? (
        <form
          onSubmit={handleSearchSubmit}
          className="mx-auto flex max-w-7xl items-center gap-2 px-6 pb-4 md:hidden"
          aria-label="모바일 제품 검색"
        >
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="제품명/브랜드 검색"
            className="h-9 w-full rounded-full border border-black/15 bg-white px-4 text-xs font-semibold text-black/70 transition focus:border-black/40 focus:outline-none"
            aria-label="제품명 또는 브랜드 검색"
          />
          <button
            type="submit"
            className="h-9 rounded-full border border-black/20 px-4 text-xs font-semibold transition hover:border-black/50"
            aria-label="검색 실행"
          >
            검색
          </button>
        </form>
      ) : null}

      {isMobileMenuOpen ? (
        <div className="border-t border-black/10 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4 text-sm font-semibold text-black/70">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 transition hover:bg-black/5 hover:text-[#e16b4b]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
                카테고리
              </p>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={category.href}
                  className="block rounded-xl px-3 py-2 transition hover:bg-black/5 hover:text-[#e16b4b]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
