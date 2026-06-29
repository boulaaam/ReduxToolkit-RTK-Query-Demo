import type { RootState } from "@/app/store";

export const selectCart = (state: RootState) => state.cart;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectCartTotals = (state: RootState) =>
  state.cart.items.reduce<{ count: number; total: number }>(
    (acc, item: RootState["cart"]["items"][number]) => {
      acc.count += item.quantity;
      acc.total += item.quantity * item.price;
      return acc;
    },
    { count: 0, total: 0 },
  );
