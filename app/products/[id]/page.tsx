import Image from "next/image";
import Link from "next/link";

import { products } from "@/src/data/products";
import PriceComparisonPanel from "../PriceComparisonPanel";

// TODO: Remove mock detail data once backend integration is ready.
const mockDetail = {
  nutrition: {
    sodiumMg: 320,
    sugarG: 1,
  },
  reviews: {
    rating: "4.7 / 5",
    count: "1,284",
    keywords: "촉촉함, 담백함",
  },
  purchaseLinks: [
    { id: "coupang", label: "쿠팡에서 보기", href: "https://www.coupang.com/" },
    { id: "naver", label: "네이버 쇼핑", href: "https://shopping.naver.com/" },
    { id: "kurly", label: "마켓 컬리", href: "https://www.kurly.com/" },
  ],
};

type ProductDetailPageProps = {
  params: {
    id: string;
  };
};

const fallbackProduct = (id: string) =>
  ({
    id,
    name: "임시 제품",
    brand: "샘플 브랜드",
    price: 0,
    image: "/images/webp/chicken_breast.webp",
    protein_g: 0,
    calories: 0,
    serving_size: "-",
    tags: ["임시 데이터"],
    shortDescription: "백엔드 연동 전 임시 데이터입니다.",
    category: "chicken",
    cookingMethod: "grilled",
    form: "slice",
    taste: "plain",
    lowSodium: false,
  } as const);

const getProductById = (id: string) => products.find((item) => item.id === id) ?? fallbackProduct(id);

const calcValuePerGram = (price: number, protein: number) => {
  if (!Number.isFinite(price) || !Number.isFinite(protein) || protein <= 0) {
    return null;
  }
  return Math.round(price / protein);
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // TODO: Replace product lookup with backend data.
  const product = getProductById(params.id);
  const valuePerGram = calcValuePerGram(product.price, product.protein_g);
  const valuePerGramFallback = valuePerGram ?? "-";

  const sameCategory = products.filter(
    (item) => item.category === product.category && item.id !== product.id,
  );
  const similarProducts = valuePerGram
    ? sameCategory
        .map((item) => ({
          item,
          vpg: calcValuePerGram(item.price, item.protein_g),
        }))
        .filter((entry) => entry.vpg !== null)
        .sort(
          (a, b) =>
            Math.abs((a.vpg ?? 0) - valuePerGram) - Math.abs((b.vpg ?? 0) - valuePerGram),
        )
        .slice(0, 3)
        .map((entry) => entry.item)
    : sameCategory.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#1f1b16]">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link
          href={`/products?category=${product.category}`}
          className="text-xs font-semibold text-black/60"
        >
          ← 목록으로 돌아가기
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black/5">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </div>
            {product.tags?.length ? (
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-black/60">
                {product.tags.map((tag, index) => (
                  <span
                    key={`${product.id}-${tag}-${index}`}
                    className="rounded-full border border-black/10 px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            <PriceComparisonPanel productId={product.id} />
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                {product.brand}
              </p>
              <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                <h1 className="text-3xl font-semibold">{product.name}</h1>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
                    가격
                  </p>
                  <p className="text-2xl font-semibold text-black">
                    {product.price.toLocaleString()}원
                  </p>
                  <p className="mt-1 text-xs text-black/60">
                    단백질 1g당 {valuePerGramFallback}원
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-black/60">{product.shortDescription}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="rounded-full bg-[#e16b4b] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  비교 담기
                </button>
                <Link
                  href={`/products?category=${product.category}`}
                  className="rounded-full border border-black/20 px-5 py-2 text-sm font-semibold transition hover:border-black/50"
                >
                  리스트 더 보기
                </Link>
              </div>
              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 px-4 py-3 text-black/70">
                  단백질 <span className="font-semibold text-black">{product.protein_g}g</span>
                </div>
                <div className="rounded-2xl border border-black/10 px-4 py-3 text-black/70">
                  칼로리 <span className="font-semibold text-black">{product.calories}kcal</span>
                </div>
                <div className="rounded-2xl border border-black/10 px-4 py-3 text-black/70">
                  1회 제공량 <span className="font-semibold text-black">{product.serving_size}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/80 p-6">
              <h2 className="text-sm font-semibold">제품 요약</h2>
              <div className="mt-4 grid gap-3 text-sm text-black/70">
                <div className="flex items-center justify-between">
                  <span className="text-black/60">가성비 지표</span>
                  <span className="font-semibold">{valuePerGramFallback}원/g</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">단백질 밀도</span>
                  <span className="font-semibold">{product.protein_g}g</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">칼로리</span>
                  <span className="font-semibold">{product.calories}kcal</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/80 p-6">
              <h2 className="text-sm font-semibold">영양 정보</h2>
              <div className="mt-4 grid gap-3 text-sm text-black/70 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3">
                  <span className="text-black/60">단백질</span>
                  <span className="font-semibold">{product.protein_g}g</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3">
                  <span className="text-black/60">칼로리</span>
                  <span className="font-semibold">{product.calories}kcal</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3">
                  <span className="text-black/60">나트륨</span>
                  <span className="font-semibold">{mockDetail.nutrition.sodiumMg}mg</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3">
                  <span className="text-black/60">당류</span>
                  <span className="font-semibold">{mockDetail.nutrition.sugarG}g</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-black/50">* 샘플 데이터이며 실제와 다를 수 있어요.</p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/80 p-6">
              <h2 className="text-sm font-semibold">후기 요약</h2>
              <div className="mt-4 grid gap-3 text-sm text-black/70">
                <div className="flex items-center justify-between">
                  <span className="text-black/60">평점</span>
                  <span className="font-semibold">{mockDetail.reviews.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">후기 수</span>
                  <span className="font-semibold">{mockDetail.reviews.count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">긍정 키워드</span>
                  <span className="font-semibold">{mockDetail.reviews.keywords}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/80 p-6">
              <h2 className="text-sm font-semibold">구매 링크</h2>
              <p className="mt-2 text-sm text-black/60">
                즐겨찾는 쇼핑몰에서 빠르게 구매하세요.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {mockDetail.purchaseLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-black/20 px-4 py-2 text-xs font-semibold transition hover:border-black/50 hover:text-[#e16b4b]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {similarProducts.length ? (
          <div className="mt-10">
            <h2 className="text-xl font-semibold">비슷한 가성비의 닭가슴살</h2>
            <p className="mt-2 text-sm text-black/60">
              단백질 함량과 g당 가격이 비슷한 제품을 골랐어요.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similarProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="rounded-2xl border border-black/10 bg-white p-4 transition hover:border-black/40"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black/5">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                      {item.brand}
                    </p>
                    <p className="mt-2 text-sm font-semibold">{item.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
