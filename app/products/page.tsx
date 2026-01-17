"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState, type FormEvent } from "react";
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
  { value: "20", label: "20g+" },
  { value: "23", label: "23g+" },
  { value: "25", label: "25g+" },
  { value: "30", label: "30g+" },
];

const caloriesOptions: Option[] = [
  { value: "all", label: "칼로리 전체" },
  { value: "120", label: "120kcal-" },
  { value: "150", label: "150kcal-" },
  { value: "180", label: "180kcal-" },
];

const cookingOptions: Option[] = [
  { value: "grilled", label: "Grilled" },
  { value: "smoked", label: "Smoked" },
  { value: "sous-vide", label: "Sous-vide" },
  { value: "steamed", label: "Steamed" },
];

const formOptions: Option[] = [
  { value: "slice", label: "Slice" },
  { value: "steak", label: "Steak" },
  { value: "cube", label: "Cube" },
  { value: "sausage", label: "Sausage" },
];

const tasteOptions: Option[] = [
  { value: "all", label: "Taste 전체" },
  { value: "plain", label: "Plain" },
  { value: "spicy", label: "Spicy" },
  { value: "smoky", label: "Smoky" },
  { value: "herb", label: "Herb" },
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

const MAX_MULTI_SELECT = 2;

function parseMultiParam(value: string | null) {
  if (!value) {
    return [];
  }
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function buildMultiParam(values: string[]) {
  return values.length ? values.join(",") : null;
}

function toggleMultiValue(values: string[], value: string, maxCount: number) {
  if (values.includes(value)) {
    return values.filter((item) => item !== value);
  }
  if (values.length >= maxCount) {
    return values;
  }
  return [...values, value];
}

function arraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((value, index) => value === b[index]);
}

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`flex items-center justify-between gap-3 rounded-full border px-3 py-2 text-xs font-semibold transition ${
        checked ? "border-[#e16b4b] bg-[#fff3ee] text-[#c2543c]" : "border-black/20 text-black/70"
      }`}
    >
      <span>{label}</span>
      <span
        className={`relative h-4 w-8 rounded-full transition ${
          checked ? "bg-[#e16b4b]" : "bg-black/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition ${
            checked ? "left-4" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialParamsRef = useRef<{
    query: string;
    sortKey: SortKey;
    price: string;
    protein: string;
    calories: string;
    taste: string;
    cooking: string[];
    form: string[];
    valueTop: boolean;
    lowSodium: boolean;
  } | null>(null);

  if (!initialParamsRef.current) {
    initialParamsRef.current = {
      query: searchParams.get("query")?.trim() ?? "",
      sortKey: (searchParams.get("sort") as SortKey) ?? "valueForMoney",
      price: searchParams.get("price") ?? "all",
      protein: searchParams.get("protein") ?? "all",
      calories: searchParams.get("calories") ?? "all",
      taste: searchParams.get("taste") ?? "all",
      cooking: parseMultiParam(searchParams.get("cooking")),
      form: parseMultiParam(searchParams.get("form")),
      valueTop: searchParams.get("valueTop") === "true",
      lowSodium: searchParams.get("lowSodium") === "true",
    };
  }

  const initialParams = initialParamsRef.current!;
  const category = searchParams.get("category") ?? "chicken";
  const sortKey = (searchParams.get("sort") as SortKey) ?? "valueForMoney";
  const query = searchParams.get("query")?.trim() ?? "";
  const priceFilter = searchParams.get("price") ?? "all";
  const proteinFilter = searchParams.get("protein") ?? "all";
  const caloriesFilter = searchParams.get("calories") ?? "all";
  const tasteFilter = searchParams.get("taste") ?? "all";
  const cookingFilter = parseMultiParam(searchParams.get("cooking"));
  const formFilter = parseMultiParam(searchParams.get("form"));
  const valueTopOnly = searchParams.get("valueTop") === "true";
  const lowSodiumOnly = searchParams.get("lowSodium") === "true";

  const [searchInput, setSearchInput] = useState(initialParams.query);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState(initialParams.query);
  const [mobileSort, setMobileSort] = useState<SortKey>(initialParams.sortKey);
  const [mobilePrice, setMobilePrice] = useState(initialParams.price);
  const [mobileProtein, setMobileProtein] = useState(initialParams.protein);
  const [mobileCalories, setMobileCalories] = useState(initialParams.calories);
  const [mobileTaste, setMobileTaste] = useState(initialParams.taste);
  const [mobileCooking, setMobileCooking] = useState(initialParams.cooking);
  const [mobileForm, setMobileForm] = useState(initialParams.form);
  const [mobileValueTop, setMobileValueTop] = useState(initialParams.valueTop);
  const [mobileLowSodium, setMobileLowSodium] = useState(initialParams.lowSodium);

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

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateParams({ query: searchInput.trim() || null });
  };

  const handleMobileApply = () => {
    const trimmedQuery = mobileQuery.trim();
    if (searchInput !== trimmedQuery) {
      setSearchInput(trimmedQuery);
    }
    updateParams({
      query: trimmedQuery || null,
      sort: mobileSort,
      price: mobilePrice,
      protein: mobileProtein,
      calories: mobileCalories,
      taste: mobileTaste,
      cooking: buildMultiParam(mobileCooking),
      form: buildMultiParam(mobileForm),
      valueTop: mobileValueTop ? "true" : null,
      lowSodium: mobileLowSodium ? "true" : null,
    });
    setIsMobileFiltersOpen(false);
  };

  const handleMobileReset = () => {
    if (mobileQuery) {
      setMobileQuery("");
    }
    if (mobileSort !== "valueForMoney") {
      setMobileSort("valueForMoney");
    }
    if (mobilePrice !== "all") {
      setMobilePrice("all");
    }
    if (mobileProtein !== "all") {
      setMobileProtein("all");
    }
    if (mobileCalories !== "all") {
      setMobileCalories("all");
    }
    if (mobileTaste !== "all") {
      setMobileTaste("all");
    }
    if (mobileCooking.length) {
      setMobileCooking([]);
    }
    if (mobileForm.length) {
      setMobileForm([]);
    }
    if (mobileValueTop) {
      setMobileValueTop(false);
    }
    if (mobileLowSodium) {
      setMobileLowSodium(false);
    }
  };

  const openMobileFilters = () => {
    if (mobileQuery !== query) {
      setMobileQuery(query);
    }
    if (mobileSort !== sortKey) {
      setMobileSort(sortKey);
    }
    if (mobilePrice !== priceFilter) {
      setMobilePrice(priceFilter);
    }
    if (mobileProtein !== proteinFilter) {
      setMobileProtein(proteinFilter);
    }
    if (mobileCalories !== caloriesFilter) {
      setMobileCalories(caloriesFilter);
    }
    if (mobileTaste !== tasteFilter) {
      setMobileTaste(tasteFilter);
    }
    if (!arraysEqual(mobileCooking, cookingFilter)) {
      setMobileCooking(cookingFilter);
    }
    if (!arraysEqual(mobileForm, formFilter)) {
      setMobileForm(formFilter);
    }
    if (mobileValueTop !== valueTopOnly) {
      setMobileValueTop(valueTopOnly);
    }
    if (mobileLowSodium !== lowSodiumOnly) {
      setMobileLowSodium(lowSodiumOnly);
    }
    setIsMobileFiltersOpen(true);
  };

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
      if (caloriesFilter !== "all" && product.calories > Number(caloriesFilter)) {
        return false;
      }
      if (tasteFilter !== "all" && product.taste !== tasteFilter) {
        return false;
      }
      if (cookingFilter.length && !cookingFilter.includes(product.cookingMethod)) {
        return false;
      }
      if (formFilter.length && !formFilter.includes(product.form)) {
        return false;
      }
      if (valueTopOnly && product.protein_g / product.price < valueTopThreshold) {
        return false;
      }
      if (lowSodiumOnly && !product.lowSodium) {
        return false;
      }
      return true;
    });
  }, [
    caloriesFilter,
    category,
    cookingFilter,
    formFilter,
    lowSodiumOnly,
    loweredQuery,
    priceFilter,
    proteinFilter,
    query,
    tasteFilter,
    valueTopOnly,
    valueTopThreshold,
  ]);

  const sorted = useMemo(() => sortProducts(filtered, sortKey), [filtered, sortKey]);
  const categoryTitle = categoryLabels[category] ?? "상품";
  const cookingLimitReached = cookingFilter.length >= MAX_MULTI_SELECT;
  const formLimitReached = formFilter.length >= MAX_MULTI_SELECT;

  const handleCookingToggle = (value: string) => {
    const next = toggleMultiValue(cookingFilter, value, MAX_MULTI_SELECT);
    updateParams({ cooking: buildMultiParam(next) });
  };

  const handleFormToggle = (value: string) => {
    const next = toggleMultiValue(formFilter, value, MAX_MULTI_SELECT);
    updateParams({ form: buildMultiParam(next) });
  };
  const activeChips = [
    query ? `검색: ${query}` : null,
    sortKey !== "valueForMoney" ? `정렬: ${sortLabels[sortKey]}` : null,
    priceFilter !== "all" ? `가격: ${getOptionLabel(priceOptions, priceFilter)}` : null,
    proteinFilter !== "all" ? `단백질: ${getOptionLabel(proteinOptions, proteinFilter)}` : null,
    caloriesFilter !== "all" ? `칼로리: ${getOptionLabel(caloriesOptions, caloriesFilter)}` : null,
    tasteFilter !== "all" ? `Taste: ${getOptionLabel(tasteOptions, tasteFilter)}` : null,
    cookingFilter.length
      ? `조리: ${cookingFilter
          .map((value) => getOptionLabel(cookingOptions, value))
          .join(", ")}`
      : null,
    formFilter.length
      ? `형태: ${formFilter.map((value) => getOptionLabel(formOptions, value)).join(", ")}`
      : null,
    valueTopOnly ? "가성비 TOP" : null,
    lowSodiumOnly ? "저나트륨" : null,
  ].filter(Boolean) as string[];

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#1f1b16]">
      <section className="mx-auto max-w-7xl px-6 pb-10 py-5">
        <div className="grid gap-8 lg:grid-cols-[minmax(240px,1fr)_minmax(0,64rem)_minmax(240px,1fr)]">
          <div className="w-full max-w-none justify-self-stretch lg:col-span-2 lg:col-start-2">
            <div>
              <h1 className="text-3xl font-semibold">{categoryTitle} 검색 결과</h1>
              <p className="mt-2 text-sm text-black/60">
                {query ? `"${query}"` : categoryTitle} 기준 {sorted.length}개
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="hidden items-start lg:flex">
            <aside className="w-[240px]">
              <div className="sticky top-6 rounded-2xl border border-black/10 bg-white p-4 text-sm">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                    필터
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      updateParams({
                        query: null,
                        sort: null,
                        price: null,
                        protein: null,
                        calories: null,
                        taste: null,
                        cooking: null,
                        form: null,
                        valueTop: null,
                        lowSodium: null,
                      });
                    }}
                    className="text-xs font-semibold text-black/60 transition hover:text-[#e16b4b]"
                  >
                    초기화
                  </button>
                </div>
                <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3">
                  <input type="hidden" name="category" value={category} />
                  <div className="flex flex-col gap-1.5">
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
                      className="h-9 rounded-full border border-black/20 px-4 text-xs font-semibold transition hover:border-black/50"
                    >
                      검색
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
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
                  <div className="flex flex-col gap-1.5">
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
                  <div className="flex flex-col gap-1.5">
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
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                      칼로리
                    </label>
                    <select
                      value={caloriesFilter}
                      onChange={(event) => updateParams({ calories: event.target.value })}
                      className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
                      aria-label="칼로리 필터"
                    >
                      {caloriesOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                      Taste
                    </label>
                    <select
                      value={tasteFilter}
                      onChange={(event) => updateParams({ taste: event.target.value })}
                      className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
                      aria-label="Taste 필터"
                    >
                      {tasteOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                      조리 방식
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-black/70">
                      {cookingOptions.map((option) => {
                        const checked = cookingFilter.includes(option.value);
                        const disabled = !checked && cookingLimitReached;
                        return (
                          <label
                            key={option.value}
                            className={`flex items-center gap-2 rounded-full border px-3 py-2 transition ${
                              checked ? "border-[#e16b4b] bg-[#fff3ee] text-[#c2543c]" : "border-black/15"
                            } ${disabled ? "opacity-50" : "cursor-pointer"}`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleCookingToggle(option.value)}
                              disabled={disabled}
                              className="h-3.5 w-3.5 rounded border-black/30"
                            />
                            <span>{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-black/40">Up to {MAX_MULTI_SELECT}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                      제품 형태
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-black/70">
                      {formOptions.map((option) => {
                        const checked = formFilter.includes(option.value);
                        const disabled = !checked && formLimitReached;
                        return (
                          <label
                            key={option.value}
                            className={`flex items-center gap-2 rounded-full border px-3 py-2 transition ${
                              checked ? "border-[#e16b4b] bg-[#fff3ee] text-[#c2543c]" : "border-black/15"
                            } ${disabled ? "opacity-50" : "cursor-pointer"}`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleFormToggle(option.value)}
                              disabled={disabled}
                              className="h-3.5 w-3.5 rounded border-black/30"
                            />
                            <span>{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-black/40">Up to {MAX_MULTI_SELECT}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                      비교 필터
                    </label>
                    <div className="grid gap-2">
                      <Toggle
                        label="가성비 TOP"
                        checked={valueTopOnly}
                        onChange={() => updateParams({ valueTop: valueTopOnly ? null : "true" })}
                      />
                      <Toggle
                        label="저나트륨"
                        checked={lowSodiumOnly}
                        onChange={() => updateParams({ lowSodium: lowSodiumOnly ? null : "true" })}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </aside>
          </div>

          <div className="w-full max-w-none min-w-0 justify-self-stretch">
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
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
              칼로리
            </label>
            <select
              value={mobileCalories}
              onChange={(event) => setMobileCalories(event.target.value)}
              className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
              aria-label="칼로리 필터"
            >
              {caloriesOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
              Taste
            </label>
            <select
              value={mobileTaste}
              onChange={(event) => setMobileTaste(event.target.value)}
              className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
              aria-label="Taste 필터"
            >
              {tasteOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
              조리 방식
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-black/70">
              {cookingOptions.map((option) => {
                const checked = mobileCooking.includes(option.value);
                const disabled = !checked && mobileCooking.length >= MAX_MULTI_SELECT;
                return (
                  <label
                    key={option.value}
                    className={`flex items-center gap-2 rounded-full border px-3 py-2 transition ${
                      checked ? "border-[#e16b4b] bg-[#fff3ee] text-[#c2543c]" : "border-black/15"
                    } ${disabled ? "opacity-50" : "cursor-pointer"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setMobileCooking((prev) => toggleMultiValue(prev, option.value, MAX_MULTI_SELECT))
                      }
                      disabled={disabled}
                      className="h-3.5 w-3.5 rounded border-black/30"
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
            <p className="text-[11px] text-black/40">Up to {MAX_MULTI_SELECT}</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
              제품 형태
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-black/70">
              {formOptions.map((option) => {
                const checked = mobileForm.includes(option.value);
                const disabled = !checked && mobileForm.length >= MAX_MULTI_SELECT;
                return (
                  <label
                    key={option.value}
                    className={`flex items-center gap-2 rounded-full border px-3 py-2 transition ${
                      checked ? "border-[#e16b4b] bg-[#fff3ee] text-[#c2543c]" : "border-black/15"
                    } ${disabled ? "opacity-50" : "cursor-pointer"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setMobileForm((prev) => toggleMultiValue(prev, option.value, MAX_MULTI_SELECT))
                      }
                      disabled={disabled}
                      className="h-3.5 w-3.5 rounded border-black/30"
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
            <p className="text-[11px] text-black/40">Up to {MAX_MULTI_SELECT}</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
              비교 필터
            </label>
            <div className="grid gap-2">
              <Toggle
                label="가성비 TOP"
                checked={mobileValueTop}
                onChange={() => setMobileValueTop((prev) => !prev)}
              />
              <Toggle
                label="저나트륨"
                checked={mobileLowSodium}
                onChange={() => setMobileLowSodium((prev) => !prev)}
              />
            </div>
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
