"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import ProductsFilter from "./ProductsFilter";
import { useProductsFilter } from "./useProductsFilter";
import {
  categoryLabels,
  caloriesOptions,
  cookingOptions,
  formOptions,
  getOptionLabel,
  priceOptions,
  proteinOptions,
  sortLabels,
  tasteOptions,
  type SortKey,
} from "./productsFilterOptions";

import { products } from "@/src/data/products";

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

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const {
    filters,
    searchInput,
    setSearchInput,
    applySearch,
    updateFilters,
    toggleCooking,
    toggleForm,
    resetFilters,
    isMobileOpen,
    openMobile,
    closeMobile,
    draftFilters,
    updateDraftFilters,
    toggleDraftCooking,
    toggleDraftForm,
    resetDraftFilters,
    applyDraftFilters,
  } = useProductsFilter();

  const category = searchParams.get("category") ?? "chicken";
  const loweredQuery = filters.query.toLowerCase();

  const valueTopThreshold = useMemo(() => {
    const categoryProducts = products.filter((product) => product.category === category);
    const ratios = categoryProducts
      .map((product) => product.protein_g / product.price)
      .sort((a, b) => b - a);
    const cutoffIndex = Math.min(3, ratios.length) - 1;
    return cutoffIndex >= 0 ? ratios[cutoffIndex] : -Infinity;
  }, [category]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      if (category !== product.category) {
        return false;
      }
      if (filters.query) {
        const match =
          product.name.toLowerCase().includes(loweredQuery) ||
          product.brand.toLowerCase().includes(loweredQuery);
        if (!match) {
          return false;
        }
      }
      if (filters.price === "under20000" && product.price >= 20000) {
        return false;
      }
      if (filters.price === "20000-30000" && (product.price < 20000 || product.price > 30000)) {
        return false;
      }
      if (filters.price === "over30000" && product.price < 30000) {
        return false;
      }
      if (filters.protein !== "all" && product.protein_g < Number(filters.protein)) {
        return false;
      }
      if (filters.calories !== "all" && product.calories > Number(filters.calories)) {
        return false;
      }
      if (filters.taste !== "all" && product.taste !== filters.taste) {
        return false;
      }
      if (filters.cooking.length && !filters.cooking.includes(product.cookingMethod)) {
        return false;
      }
      if (filters.form.length && !filters.form.includes(product.form)) {
        return false;
      }
      if (filters.valueTop && product.protein_g / product.price < valueTopThreshold) {
        return false;
      }
      if (filters.lowSodium && !product.lowSodium) {
        return false;
      }
      return true;
    });
  }, [
    category,
    filters,
    loweredQuery,
    valueTopThreshold,
  ]);

  const sorted = useMemo(() => sortProducts(filtered, filters.sortKey), [filtered, filters.sortKey]);
  const categoryTitle = categoryLabels[category] ?? "상품";
  const activeChips = [
    filters.query ? `검색: ${filters.query}` : null,
    filters.sortKey !== "valueForMoney" ? `정렬: ${sortLabels[filters.sortKey]}` : null,
    filters.price !== "all" ? `가격: ${getOptionLabel(priceOptions, filters.price)}` : null,
    filters.protein !== "all" ? `단백질: ${getOptionLabel(proteinOptions, filters.protein)}` : null,
    filters.calories !== "all"
      ? `칼로리: ${getOptionLabel(caloriesOptions, filters.calories)}`
      : null,
    filters.taste !== "all" ? `Taste: ${getOptionLabel(tasteOptions, filters.taste)}` : null,
    filters.cooking.length
      ? `조리: ${filters.cooking
          .map((value) => getOptionLabel(cookingOptions, value))
          .join(", ")}`
      : null,
    filters.form.length
      ? `형태: ${filters.form.map((value) => getOptionLabel(formOptions, value)).join(", ")}`
      : null,
    filters.valueTop ? "가성비 TOP" : null,
    filters.lowSodium ? "저나트륨" : null,
  ].filter(Boolean) as string[];

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#1f1b16]">
      <section className="mx-auto max-w-7xl px-6 pb-10 py-5">
        <div className="grid gap-8 lg:grid-cols-[minmax(240px,1fr)_minmax(0,64rem)_minmax(240px,1fr)]">
          <div className="w-full max-w-none justify-self-stretch lg:col-span-2 lg:col-start-2">
            <div>
              <h1 className="text-3xl font-semibold">{categoryTitle} 검색 결과</h1>
              <p className="mt-2 text-sm text-black/60">
                {filters.query ? `"${filters.query}"` : categoryTitle} 기준 {sorted.length}개
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <ProductsFilter
            filters={filters}
            searchInput={searchInput}
            resultsCount={sorted.length}
            isMobileOpen={isMobileOpen}
            draftFilters={draftFilters}
            onSearchInputChange={setSearchInput}
            onSearchSubmit={applySearch}
            onChange={updateFilters}
            onToggleCooking={toggleCooking}
            onToggleForm={toggleForm}
            onReset={resetFilters}
            onOpenMobile={openMobile}
            onCloseMobile={closeMobile}
            onDraftChange={updateDraftFilters}
            onDraftToggleCooking={toggleDraftCooking}
            onDraftToggleForm={toggleDraftForm}
            onDraftReset={resetDraftFilters}
            onApply={applyDraftFilters}
          />

          <div className="w-full max-w-none min-w-0 justify-self-stretch">

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
              <div className="mt-0 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sorted.map((product) => (
                  <div
                    key={product.id}
                    className="flex h-full flex-row gap-3 rounded-2xl border border-black/10 bg-white p-4 sm:flex-col sm:gap-4"
                  >
                    <div className="relative aspect-[4/3] basis-2/5 overflow-hidden rounded-2xl bg-black/5 sm:w-full sm:basis-auto sm:aspect-[4/3]">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="flex basis-3/5 flex-col justify-between gap-3 sm:basis-auto sm:flex-1 sm:gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                          {product.brand}
                        </p>
                        <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
                        <p className="mt-2 text-sm text-black/60">{product.shortDescription}</p>
                        {product.tags?.length ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {product.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-black/60"
                              >
                                {tag}
                              </span>
                            ))}
                            {product.tags.length > 2 ? (
                              <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-black/60">
                                +{product.tags.length - 2}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-3 text-sm">
                        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs text-black/60">
                          <span>가격</span>
                          <span className="text-sm font-semibold text-black">
                            {product.price.toLocaleString()}원
                          </span>
                          <span>단백질</span>
                          <span className="text-sm font-semibold text-black">
                            {product.protein_g}g
                          </span>
                          <span>칼로리</span>
                          <span className="text-sm font-semibold text-black">
                            {product.calories}kcal
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
