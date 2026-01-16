import Link from "next/link";

const products = [
  { id: "c1", name: "닭가슴살 100g", protein: 23, kcal: 110, price: 2500 },
  { id: "c2", name: "닭가슴살 스테이크 120g", protein: 26, kcal: 160, price: 3200 },
];

export default function ProductsPage() {
  return (
    <main style={{ padding: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700 }}>상품 목록</h2>

      <ul style={{ marginTop: 12 }}>
        {products.map((p) => (
          <li key={p.id} style={{ marginBottom: 10 }}>
            <Link href={`/products/${p.id}`}>
              {p.name} - {p.price.toLocaleString()}원
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/">← 홈</Link>
    </main>
  );
}
