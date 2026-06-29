import {
  createAsyncThunk,
  createSlice,
  nanoid,
  type ActionReducerMapBuilder,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { RootState } from "@/app/store";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  checkoutRequestId: string | null;
  status: "idle" | "processing" | "completed" | "failed";
  error?: string;
}

const initialState: CartState = {
  items: [],
  checkoutRequestId: null,
  status: "idle",
};

export const submitCheckout = createAsyncThunk<{ orderId: string }, void, { state: RootState }>(
  "cart/submitCheckout",
  async (_: void, thunkApi: { getState: () => RootState; signal: AbortSignal }) => {
    const state = thunkApi.getState();
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: state.cart.items }),
      signal: thunkApi.signal,
    });

    if (!response.ok) {
      throw new Error("Checkout failed");
    }

    const payload = await response.json();
    return payload as { orderId: string };
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: {
      reducer(state: CartState, action: PayloadAction<CartItem>) {
        const existing = state.items.find((item) => item.id === action.payload.id);
        if (existing) {
          existing.quantity += action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      },
      prepare(item: Omit<CartItem, "quantity">, quantity = 1) {
        return {
          payload: {
            ...item,
            quantity,
          },
        };
      },
    },
    updateQuantity(state: CartState, action: PayloadAction<{ id: string; quantity: number }>) {
      const entry = state.items.find((item) => item.id === action.payload.id);
      if (entry) {
        entry.quantity = action.payload.quantity;
      }
    },
    removeItem(state: CartState, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    beginCheckout(state: CartState) {
      state.checkoutRequestId = nanoid();
      state.status = "processing";
    },
    completeCheckout(state: CartState) {
      state.items = [];
      state.checkoutRequestId = null;
      state.status = "completed";
      state.error = undefined;
    },
    clearCart(state: CartState) {
      state.items = [];
      state.status = "idle";
      state.error = undefined;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<CartState>) => {
    builder
      .addCase(submitCheckout.pending, (state: CartState) => {
        state.status = "processing";
        state.error = undefined;
      })
      .addCase(submitCheckout.fulfilled, (state: CartState, action: PayloadAction<{ orderId: string }>) => {
        state.status = "completed";
        state.checkoutRequestId = action.payload.orderId;
        state.items = [];
      })
      .addCase(
        submitCheckout.rejected,
        (
          state: CartState,
          action: { error: { message?: string } },
        ) => {
        state.status = "failed";
        state.error = action.error.message;
        },
      );
  },
});

export const { addItem, updateQuantity, removeItem, clearCart, beginCheckout, completeCheckout } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;
