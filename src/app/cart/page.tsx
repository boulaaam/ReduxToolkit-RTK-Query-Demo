import { CartShowcase } from "@/features/cart/ui/CartShowcase";

export default function CartPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold text-emerald-100">Cart with persistent caching</h1>
        <p className="mt-2 text-sm text-slate-300">
          Catalog data illustrates how RTK Query endpoints can swap between IndexedDB, sessionStorage, and
          memory-backed caches while the cart uses classic reducers and async thunks.
        </p>
      </div>
      <CartShowcase />
    </div>
  );
}
