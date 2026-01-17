"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { products } from "@/src/data/products";

type SortKey = "valueForMoney" | "priceAsc" | "proteinDesc" | "caloriesAsc";

type Option = {
  value: string;
  label: string;
};

const sortLabels: Record<SortKey, string> = {
  valueForMoney: "가성비 높은순",
  priceAsc: "가격 낮은순",
  proteinDesc: "단백질 높은순",
  caloriesAsc: "칼로리 낮은순",
};

const categoryLabels: Record<string, string> = {
  chicken: "닭가슴살",
  protein: "단백질",
  zero: "제로 식품",
};

const priceOptions: Option[] = [
  { value: "all", label: "가격 전체" },
  { value: "under20000", label: "2만원 미만" },
  { value: "20000-30000", label: "2~3만원" },
  { value: "over30000", label: "3만원 이상" },
];

const proteinOptions: Option[] = [
  { value: "all", label: "단백질 전체" },
  { value: "20", label: "20g 이상" },
  { value: "25", label: "25g 이상" },
  { value: "30", label: "30g 이상" },
];

function sortProducts(list: typeof products, sortKey: SortKey) {
  const sorted = [...list];
  switch (sortKey) {
    case "priceAsc":
      return sorted.sort((a, b) => a.price - b.price);
    case "proteinDesc":
      return sorted.sort((a, b) => b.protein_g - a.protein_g);
    case "caloriesAsc":
      return sorted.sort((a, b) => a.calories - b.calories);
    case "valueForMoney":
    default:
      return sorted.sort((a, b) => a.price / a.protein_g - b.price / b.protein_g);
  }
}

function getOptionLabel(options: Option[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "chicken";
  const sortKey = (searchParams.get("sort") as SortKey) ?? "valueForMoney";
  const query = searchParams.get("query")?.trim() ?? "";
  const priceFilter = searchParams.get("price") ?? "all";
  const proteinFilter = searchParams.get("protein") ?? "all";

  const [searchInput, setSearchInput] = useState(query);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState(query);
  const [mobileSort, setMobileSort] = useState<SortKey>(sortKey);
  const [mobilePrice, setMobilePrice] = useState(priceFilter);
  const [mobileProtein, setMobileProtein] = useState(proteinFilter);

  const loweredQuery = query.toLowerCase();

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const queryString = params.toString();
    router.replace(queryString ? `/products?${queryString}` : "/products");
  };

  useEffect(() => {
    setSearchInput(query);
    if (!isMobileFiltersOpen) {
      setMobileQuery(query);
      setMobileSort(sortKey);
      setMobilePrice(priceFilter);
      setMobileProtein(proteinFilter);
    }
  }, [isMobileFiltersOpen, priceFilter, proteinFilter, query, sortKey]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateParams({ query: searchInput.trim() || null });
  };

  const handleMobileApply = () => {
    const trimmedQuery = mobileQuery.trim();
    setSearchInput(trimmedQuery);
    updateParams({
      query: trimmedQuery || null,
      sort: mobileSort,
      price: mobilePrice,
      protein: mobileProtein,
    });
    setIsMobileFiltersOpen(false);
  };

  const handleMobileReset = () => {
    setMobileQuery("");
    setMobileSort("valueForMoney");
    setMobilePrice("all");
    setMobileProtein("all");
  };

  const openMobileFilters = () => {
    setMobileQuery(query);
    setMobileSort(sortKey);
    setMobilePrice(priceFilter);
    setMobileProtein(proteinFilter);
    setIsMobileFiltersOpen(true);
  };

  const filtered = useMemo(() => {
    return products.filter((product) => {
      if (category !== product.category) {
        return false;
      }
      if (query) {
        const match =
          product.name.toLowerCase().includes(loweredQuery) ||
          product.brand.toLowerCase().includes(loweredQuery);
        if (!match) {
          return false;
        }
      }
      if (priceFilter === "under20000" && product.price >= 20000) {
        return false;
      }
      if (priceFilter === "20000-30000" && (product.price < 20000 || product.price > 30000)) {
        return false;
      }
      if (priceFilter === "over30000" && product.price < 30000) {
        return false;
      }
      if (proteinFilter !== "all" && product.protein_g < Number(proteinFilter)) {
        return false;
      }
      return true;
    });
  }, [category, loweredQuery, priceFilter, proteinFilter, query]);

  const sorted = useMemo(() => sortProducts(filtered, sortKey), [filtered, sortKey]);
  const categoryTitle = categoryLabels[category] ?? "상품";
  const activeChips = [
    query ? `검색: ${query}` : null,
    sortKey !== "valueForMoney" ? `정렬: ${sortLabels[sortKey]}` : null,
    priceFilter !== "all" ? `가격: ${getOptionLabel(priceOptions, priceFilter)}` : null,
    proteinFilter !== "all" ? `단백질: ${getOptionLabel(proteinOptions, proteinFilter)}` : null,
  ].filter(Boolean) as string[];

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#1f1b16]">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <nav className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
            <Link href="/" className="transition hover:text-[#e16b4b]">
              Home
            </Link>
            <span className="mx-2 text-black/30">→</span>
            <Link href="/products" className="transition hover:text-[#e16b4b]">
              Products
            </Link>
            <span className="mx-2 text-black/30">→</span>
            <span className="text-black/70">{categoryTitle}</span>
          </nav>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
              Products
            </p>
            <h1 className="mt-2 text-3xl font-semibold">{categoryTitle} 검색 결과</h1>
            <p className="mt-2 text-sm text-black/60">
              {query ? `"${query}"` : categoryTitle} 기준 {sorted.length}개
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,64rem)_minmax(0,1fr)]">
          <div className="hidden justify-end lg:flex">
            <aside className="w-[240px]">
              <div className="sticky top-6 rounded-2xl border border-black/10 bg-white p-4 text-sm">
                <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">
                  <input type="hidden" name="category" value={category} />
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                      검색
                    </label>
                    <input
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                      placeholder="제품명/브랜드 검색"
                      className="h-10 w-full rounded-full border border-black/15 bg-white px-4 text-sm font-semibold text-black/70 focus:border-black/40 focus:outline-none"
                      aria-label="제품명 또는 브랜드 검색"
                    />
                    <button
                      type="submit"
                      className="h-10 rounded-full border border-black/20 px-4 font-semibold transition hover:border-black/50"
                    >
                      검색
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                      정렬
                    </label>
                    <select
                      value={sortKey}
                      onChange={(event) => updateParams({ sort: event.target.value })}
                      className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
                      aria-label="정렬 기준"
                    >
                      {Object.entries(sortLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                      가격
                    </label>
                    <select
                      value={priceFilter}
                      onChange={(event) => updateParams({ price: event.target.value })}
                      className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
                      aria-label="가격 필터"
                    >
                      {priceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                      단백질
                    </label>
                    <select
                      value={proteinFilter}
                      onChange={(event) => updateParams({ protein: event.target.value })}
                      className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
                      aria-label="단백질 필터"
                    >
                      {proteinOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      updateParams({ query: null, sort: null, price: null, protein: null });
                    }}
                    className="h-10 rounded-full border border-black/20 px-4 font-semibold transition hover:border-black/50"
                  >
                    초기화
                  </button>
                </form>
              </div>
            </aside>
          </div>

          <div className="w-full max-w-5xl min-w-0 justify-self-center">
            <div className="flex items-center justify-between lg:hidden">
              <button
                type="button"
                onClick={openMobileFilters}
                className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold transition hover:border-black/50"
                aria-label="필터 열기"
              >
                필터
              </button>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                {sorted.length} items
              </span>
            </div>

            {activeChips.length ? (
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-black/60 lg:hidden">
                {activeChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-black/10 bg-white px-3 py-1"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}

            {sorted.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-black/20 bg-white p-8 text-center text-sm text-black/60">
                조건에 맞는 상품이 없습니다.
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sorted.map((product) => (
                  <div
                    key={product.id}
                    className="flex h-full flex-col gap-4 rounded-2xl border border-black/10 bg-white p-4"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black/5">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                          {product.brand}
                        </p>
                        <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
                        <p className="mt-2 text-sm text-black/60">{product.shortDescription}</p>
                        {product.tags?.length ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {product.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-black/60"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-3 text-sm">
                        <div className="flex flex-wrap gap-4 text-black/70">
                          <span>가격 {product.price.toLocaleString()}원</span>
                          <span>단백질 {product.protein_g}g</span>
                          <span>칼로리 {product.calories}kcal</span>
                        </div>
                        <Link
                          href={`/products/${product.id}`}
                          className="self-start rounded-full border border-black/20 px-4 py-2 text-xs font-semibold transition hover:border-black/50 hover:text-[#e16b4b]"
                        >
                          상세보기
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="hidden lg:block" />
        </div>
      </section>

      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          isMobileFiltersOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMobileFiltersOpen(false)}
        aria-hidden={!isMobileFiltersOpen}
      />
      <div
        className={`fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white p-5 shadow-2xl transition-transform duration-300 lg:hidden ${
          isMobileFiltersOpen ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">필터</p>
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(false)}
            className="rounded-full border border-black/20 px-3 py-1 text-xs font-semibold"
            aria-label="필터 닫기"
          >
            닫기
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-4 text-sm">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
              검색
            </label>
            <input
              value={mobileQuery}
              onChange={(event) => setMobileQuery(event.target.value)}
              placeholder="제품명/브랜드 검색"
              className="h-10 w-full rounded-full border border-black/15 bg-white px-4 text-sm font-semibold text-black/70 focus:border-black/40 focus:outline-none"
              aria-label="제품명 또는 브랜드 검색"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
              정렬
            </label>
            <select
              value={mobileSort}
              onChange={(event) => setMobileSort(event.target.value as SortKey)}
              className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
              aria-label="정렬 기준"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
              가격
            </label>
            <select
              value={mobilePrice}
              onChange={(event) => setMobilePrice(event.target.value)}
              className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
              aria-label="가격 필터"
            >
              {priceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
              단백질
            </label>
            <select
              value={mobileProtein}
              onChange={(event) => setMobileProtein(event.target.value)}
              className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
              aria-label="단백질 필터"
            >
              {proteinOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleMobileReset}
              className="h-10 flex-1 rounded-full border border-black/20 px-4 font-semibold transition hover:border-black/50"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={handleMobileApply}
              className="h-10 flex-1 rounded-full bg-[#e16b4b] px-4 font-semibold text-white transition hover:opacity-90"
            >
              적용
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
