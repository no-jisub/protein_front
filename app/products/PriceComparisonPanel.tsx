import Link from "next/link";

type MarketPriceStatus = "ready" | "loading" | "empty";

type MarketPrice = {
  id: string;
  store: string;
  logoText: string;
  price: number | null;
  status: MarketPriceStatus;
  shippingLabel?: string;
  updatedAt: string;
  url: string;
};

const mockMarketPrices: MarketPrice[] = [
  {
    id: "coupang",
    store: "쿠팡",
    logoText: "CP",
    price: 17800,
    status: "ready",
    shippingLabel: "로켓배송",
    updatedAt: "5분 전",
    url: "https://www.coupang.com/",
  },
  {
    id: "naver",
    store: "네이버 쇼핑",
    logoText: "N",
    price: null,
    status: "loading",
    shippingLabel: "",
    updatedAt: "방금",
    url: "https://shopping.naver.com/",
  },
  {
    id: "kurly",
    store: "마켓 컬리",
    logoText: "K",
    price: 18200,
    status: "ready",
    shippingLabel: "무료배송",
    updatedAt: "10분 전",
    url: "https://www.kurly.com/",
  },
  {
    id: "ssg",
    store: "SSG",
    logoText: "S",
    price: 18500,
    status: "ready",
    shippingLabel: "",
    updatedAt: "30분 전",
    url: "https://www.ssg.com/",
  },
];

const formatPrice = (price: number | null, status: MarketPriceStatus) => {
  if (status === "loading") {
    return "불러오는 중";
  }
  if (price === null) {
    return "정보 없음";
  }
  return `${price.toLocaleString()}원`;
};

export default function PriceComparisonPanel({ productId }: { productId: string }) {
  // TODO: Replace mock data with fetch(`/api/prices?productId=${productId}`).
  const prices = mockMarketPrices;

  return (
    <div className="mt-6 rounded-2xl border border-black/10 bg-white/80 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">스토어별 가격 비교</h3>
        <span className="text-xs text-black/50">최근 업데이트</span>
      </div>
      <div className="mt-4 space-y-3">
        {prices.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-xs font-semibold">
                {item.logoText}
              </div>
              <div>
                <p className="text-sm font-semibold">{item.store}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-black/50">
                  {item.shippingLabel ? (
                    <span className="rounded-full border border-black/10 px-2 py-0.5">
                      {item.shippingLabel}
                    </span>
                  ) : null}
                  <span>{item.updatedAt}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-black">
                {formatPrice(item.price, item.status)}
              </span>
              <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-black/20 px-3 py-1 text-xs font-semibold transition hover:border-black/50 hover:text-[#e16b4b]"
              >
                구매하기
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
