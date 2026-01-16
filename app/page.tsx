"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fraunces, Space_Grotesk } from "next/font/google";
import { useState } from "react";

const fraunces = Fraunces({
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

const categoryConfig = {
  protein: {
    headline: "단백질 식품, 가성비로 한 번에 비교",
    description: [
      "같은 돈으로 더 많은 단백질, 가격·단백질·칼로리로 한눈에 비교하세요",
    ],
    cards: [
      {
        id: "chicken",
        label: "닭가슴살",
        image: "/images/chicken_breast.png",
        alt: "닭가슴살",
      },
      {
        id: "powder",
        label: "단백질 보충제",
        image: "/images/protein_powder.png",
        alt: "단백질 보충제",
      },
      {
        id: "snack",
        label: "단백질 간식",
        image: "/images/protein_snack.png",
        alt: "단백질 간식",
      },
    ],
  },
  zero: {
    headline: "제로 식품, 가성비로 한 번에 비교",
    description: ["먹어도 덜 부담되는 선택, 당·지방·칼로리 기준으로 바로 비교하세요"],
    cards: [
      { id: "zero-drink", label: "제로 음료" },
      { id: "zero-food", label: "제로 식품" },
      { id: "zero-snack", label: "제로 간식" },
    ],
  },
} as const;

type CategoryKey = keyof typeof categoryConfig;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("protein");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const router = useRouter();
  const categoryData = categoryConfig[activeCategory];
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      return;
    }
    router.push(`/products?query=${encodeURIComponent(trimmedQuery)}`);
    setIsMobileSearchOpen(false);
  };

  return (
    <main className={`${spaceGrotesk.className} min-h-screen bg-[#f7f5f0] text-[#1f1b16]`}>
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.18em]">
            Protein Compare
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <Link href="/ranking?tab=today" className="transition hover:text-[#e16b4b]">
              🔥 오늘의 TOP
            </Link>
            <Link href="/products" className="transition hover:text-[#e16b4b]">
              비교하기
            </Link>
            <Link href="/calculator" className="transition hover:text-[#e16b4b]">
              계산기
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <form
              onSubmit={handleSearchSubmit}
              className="hidden items-center sm:flex"
              aria-label="제품 검색"
            >
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/20 text-sm font-semibold transition hover:border-black/50 sm:hidden"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              aria-label="검색 입력 열기"
              aria-expanded={isMobileSearchOpen}
            >
              🔍
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
            className="mx-auto flex max-w-6xl items-center gap-2 px-6 pb-4 sm:hidden"
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
      </header>

      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6 md:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
          Protein Compare
        </p>
        <h1 className={`${fraunces.className} text-4xl font-semibold leading-tight md:text-5xl`}>
          {categoryData.headline}
        </h1>
        <p className="max-w-2xl text-base text-black/60 md:text-lg">
          {categoryData.description.map((line, index) => (
            <span key={line}>
              {line}
              {index < categoryData.description.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveCategory("protein")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeCategory === "protein"
                ? "bg-[#e16b4b] text-white"
                : "border border-black/20 text-black/70 hover:border-black/50"
            }`}
            aria-pressed={activeCategory === "protein"}
            aria-label="카테고리: 단백질"
          >
            단백질
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("zero")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeCategory === "zero"
                ? "bg-[#e16b4b] text-white"
                : "border border-black/20 text-black/70 hover:border-black/50"
            }`}
            aria-pressed={activeCategory === "zero"}
            aria-label="카테고리: 제로 식품"
          >
            제로 식품
          </button>
        </div>

        <div className="grid w-full gap-3 text-sm font-semibold sm:grid-cols-3">
          {categoryData.cards.map((card) => {
            const hasImage = "image" in card && Boolean(card.image);
            const cardClassName =
              "group relative flex w-full aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-black/15 bg-white text-white transition hover:border-black/40";

            return (
              <Link
                key={card.id}
                href={`/products?category=${activeCategory}`}
                className={cardClassName}
                aria-label={`${card.label} 카테고리 보기`}
              >
                {hasImage ? (
                  <>
                    <Image
                      src={card.image}
                      alt={card.alt}
                      width={240}
                      height={180}
                      className="h-full w-full rounded-xl object-cover transition-transform duration-700 ease-out group-hover:scale-[1.2]"
                    />
                    <span className="absolute inset-0 bg-white/40 transition group-hover:bg-white/0" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold transition group-hover:bg-black/25">
                      <span className="transition-transform duration-700 ease-out group-hover:scale-[1.4]">
                        {card.label}
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/5 to-transparent" />
                    <span className="absolute inset-0 bg-white/40 transition group-hover:bg-white/0" />
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-sm font-semibold transition group-hover:bg-black/25">
                      <span className="transition-transform duration-700 ease-out group-hover:scale-[1.4]">
                        {card.label}
                      </span>
                      <span className="rounded-full border border-white/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                        Coming soon
                      </span>
                    </span>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-6 py-3 text-xs text-black/60">
          공부용 프로젝트이며 가격은 변동될 수 있습니다.
        </div>
      </footer>
    </main>
  );
}
