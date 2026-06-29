import { describe, expect, it } from "vitest";

import { addItem } from "@/features/cart/model/cartSlice";
import { store } from "./index";

describe("app store", () => {
  it("includes configured feature reducers", () => {
    const state = store.getState();
    expect(state.preferences).toBeDefined();
    expect(state.cart).toBeDefined();
    expect(state.tasks).toBeDefined();
  });

  it("dispatches slice actions", () => {
    store.dispatch(addItem({ id: "x", name: "Sample", price: 5 }, 1));
    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
  });
});
