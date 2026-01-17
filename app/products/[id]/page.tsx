import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { products } from "@/src/data/products";

type ProductDetailPageProps = {
  params: {
    id: string;
  };
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = products.find((item) => item.id === params.id);

  if (!product) {
    notFound();
  }

  const similarProducts = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#1f1b16]">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link href="/products?category=chicken" className="text-xs font-semibold text-black/60">
          ← 목록으로 돌아가기
        </Link>

        <div className="mt-6 grid gap-8 rounded-2xl border border-black/10 bg-white p-6 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black/5">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
              {product.brand}
            </p>
            <h1 className="text-3xl font-semibold">{product.name}</h1>
            <p className="text-sm text-black/60">{product.shortDescription}</p>
            <div className="grid gap-3 text-sm text-black/70 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 px-4 py-3">
                가격 <span className="font-semibold">{product.price.toLocaleString()}원</span>
              </div>
              <div className="rounded-2xl border border-black/10 px-4 py-3">
                단백질 <span className="font-semibold">{product.protein_g}g</span>
              </div>
              <div className="rounded-2xl border border-black/10 px-4 py-3">
                칼로리 <span className="font-semibold">{product.calories}kcal</span>
              </div>
              <div className="rounded-2xl border border-black/10 px-4 py-3">
                1회 제공량 <span className="font-semibold">{product.serving_size}</span>
              </div>
            </div>
            {product.tags?.length ? (
              <div className="flex flex-wrap gap-2 text-xs text-black/60">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-black/10 px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                className="rounded-full bg-[#e16b4b] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                비교 담기
              </button>
              <Link
                href="/products?category=chicken"
                className="rounded-full border border-black/20 px-5 py-2 text-sm font-semibold transition hover:border-black/50"
              >
                리스트 더 보기
              </Link>
            </div>
          </div>
        </div>

        {similarProducts.length ? (
          <div className="mt-10">
            <h2 className="text-xl font-semibold">비슷한 제품</h2>
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
