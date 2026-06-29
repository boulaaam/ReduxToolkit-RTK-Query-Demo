import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";

import { addItem, cartReducer, submitCheckout } from "./cartSlice";

describe("cartSlice", () => {
  it("aggregates quantities when the same item is added twice", () => {
    const state = cartReducer(undefined, { type: "unknown" });
    const next = cartReducer(state, addItem({ id: "a", name: "Sample", price: 10 }, 1));
    const final = cartReducer(next, addItem({ id: "a", name: "Sample", price: 10 }, 2));

    expect(final.items).toHaveLength(1);
    expect(final.items[0]?.quantity).toBe(3);
  });

  it("submits checkout and clears the cart", async () => {
    const store = configureStore({ reducer: { cart: cartReducer } });

    store.dispatch(addItem({ id: "a", name: "Sample", price: 10 }, 1));
    const result = await store.dispatch(submitCheckout());

    expect(result.meta.requestStatus).toBe("fulfilled");
    expect(store.getState().cart.items).toHaveLength(0);
    expect(store.getState().cart.status).toBe("completed");
  });
});
