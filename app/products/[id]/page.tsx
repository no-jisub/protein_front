export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <main style={{ padding: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700 }}>상품 상세</h2>
      <p style={{ marginTop: 8 }}>상품 ID: {params.id}</p>

      <a href="/products" style={{ display: "inline-block", marginTop: 16 }}>
        ← 목록으로
      </a>
    </main>
  );
}
