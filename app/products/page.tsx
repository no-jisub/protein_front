import Image from "next/image";
import Link from "next/link";

import { products } from "@/src/data/products";

type SortKey = "valueForMoney" | "priceAsc" | "proteinDesc" | "caloriesAsc";

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

type ProductsPageProps = {
  searchParams?: {
    category?: string;
    sort?: SortKey;
    query?: string;
  };
};

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams?.category ?? "chicken";
  const sortKey = searchParams?.sort ?? "valueForMoney";
  const query = searchParams?.query?.trim() ?? "";
  const loweredQuery = query.toLowerCase();

  const filtered = products.filter((product) => {
    if (category !== product.category) {
      return false;
    }
    if (!query) {
      return true;
    }
    return (
      product.name.toLowerCase().includes(loweredQuery) ||
      product.brand.toLowerCase().includes(loweredQuery)
    );
  });

  const sorted = sortProducts(filtered, sortKey);
  const categoryTitle = categoryLabels[category] ?? "상품";

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#1f1b16]">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
              Products
            </p>
            <h1 className="mt-2 text-3xl font-semibold">{categoryTitle} 검색 결과</h1>
            <p className="mt-2 text-sm text-black/60">
              {query ? `"${query}"` : categoryTitle} 기준 {sorted.length}개
            </p>
          </div>
          <form method="get" className="flex flex-wrap items-center gap-2 text-sm">
            <input type="hidden" name="category" value={category} />
            {query ? <input type="hidden" name="query" value={query} /> : null}
            <select
              name="sort"
              defaultValue={sortKey}
              className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black/70"
              aria-label="정렬 기준"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="h-10 rounded-full border border-black/20 px-4 font-semibold transition hover:border-black/50"
            >
              정렬 적용
            </button>
          </form>
        </div>

        {sorted.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-black/20 bg-white p-8 text-center text-sm text-black/60">
            조건에 맞는 상품이 없습니다.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      </section>
    </main>
  );
}
