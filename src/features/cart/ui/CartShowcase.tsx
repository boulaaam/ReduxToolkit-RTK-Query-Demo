"use client";

import { useMemo } from "react";

import { selectCatalogStorage } from "@/entities/preferences/model/selectors";
import { setCatalogStorage } from "@/entities/preferences/model/preferencesSlice";
import { addItem, submitCheckout, type CartItem } from "@/features/cart/model/cartSlice";
import {
  selectCartError,
  selectCartItems,
  selectCartStatus,
  selectCartTotals,
} from "@/features/cart/model/selectors";
import { useListCatalogQuery } from "@/features/catalog/api/catalogApi";
import type { CatalogItem } from "@/features/catalog/api/catalogApi";
import type { CacheStrategy } from "@/shared/api/storage/storageAdapters";
import { useAppDispatch, useAppSelector } from "@/shared/lib/reduxHooks";

const statusCopy: Record<string, string> = {
  idle: "Cart ready",
  processing: "Submitting order…",
  completed: "Order completed",
  failed: "Checkout failed",
};

export const CartShowcase = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const totals = useAppSelector(selectCartTotals);
  const status = useAppSelector(selectCartStatus);
  const error = useAppSelector(selectCartError);
  const storageStrategy = useAppSelector(selectCatalogStorage);

  const { data, isLoading, isFetching, refetch } = useListCatalogQuery();

  const handleAdd = (item: CatalogItem) => {
    dispatch(addItem({ id: item.id, name: item.name, price: item.price }, 1));
  };

  const handleCheckout = () => {
    dispatch(submitCheckout());
  };

  const summaryCopy = useMemo(
    () =>
      `Catalog served from ${storageStrategy} cache with IndexedDB fallback for persistence. Middleware clears previous caches when you switch strategies.`,
    [storageStrategy],
  );

  return (
    <section className="flex flex-col gap-6 rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-900/40">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-emerald-200">Cart & Catalog</h2>
        <p className="text-sm text-slate-300">
          Persistent caching backed by IndexedDB keeps product data around between sessions.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-emerald-100">Catalog</h3>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{isFetching ? "Refreshing…" : "Cache warm"}</span>
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-md border border-emerald-400 px-3 py-1 text-emerald-200 hover:bg-emerald-400/10"
              >
                Refresh
              </button>
            </div>
          </div>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-200">Cache Strategy</span>
            <select
              value={storageStrategy}
              onChange={(event) => dispatch(setCatalogStorage(event.target.value as CacheStrategy))}
              className="rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100"
            >
              <option value="persistent">Persistent (IndexedDB/localForage)</option>
              <option value="session">Session storage</option>
              <option value="memory">In-memory only</option>
            </select>
            <span className="text-xs text-slate-400">{summaryCopy}</span>
          </label>

          <ul className="grid gap-3">
            {isLoading && <li className="text-sm text-slate-400">Loading catalog…</li>}
            {data?.map((item: CatalogItem) => (
              <li
                key={item.id}
                className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/80 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h4 className="text-base font-semibold text-slate-100">{item.name}</h4>
                  <p className="text-xs text-slate-400">{item.description}</p>
                  <p className="text-sm text-emerald-300">${item.price.toFixed(2)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAdd(item)}
                  className="rounded-md bg-emerald-400 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-300"
                >
                  Add to cart
                </button>
              </li>
            ))}
          </ul>
        </div>

        <aside className="flex h-full flex-col gap-4 rounded-lg border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-emerald-100">Cart</h3>
            <span className="text-xs text-slate-400">{statusCopy[status]}</span>
          </div>

          <ul className="flex-1 space-y-2 text-sm">
            {cartItems.length === 0 && <li className="text-slate-400">Your cart is empty.</li>}
            {cartItems.map((item: CartItem) => (
              <li key={item.id} className="flex items-center justify-between text-slate-100">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <dl className="grid grid-cols-2 gap-2 border-t border-slate-800 pt-4 text-sm">
            <dt className="text-slate-400">Items</dt>
            <dd>{totals.count}</dd>
            <dt className="text-slate-400">Total</dt>
            <dd className="text-base font-semibold text-slate-100">${totals.total.toFixed(2)}</dd>
          </dl>

          {error && <p className="text-xs text-rose-300">{error}</p>}

          <button
            type="button"
            onClick={handleCheckout}
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            disabled={cartItems.length === 0 || status === "processing"}
          >
            {status === "processing" ? "Processing…" : "Checkout"}
          </button>
        </aside>
      </div>
    </section>
  );
};
