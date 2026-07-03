import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { toast } from "sonner";

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stock: number;
  dimensions: string;
  material: string;
  posterId: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
};

const loadCartFromStorage = (): CartState => {
  if (typeof window === "undefined") return initialState;

  try {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    toast.error(`Failed to load cart from localStorage: ${error}`);
  }
  return initialState;
};

// Save cart to localStorage
const saveCartToStorage = (state: CartState) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch (error) {
    toast.error(`Failed to save cart to localStorage: ${error}`);
  }
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { totalItems, subtotal };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.posterId === action.payload.posterId
      );

      if (existingItem) {
        // Check if adding more would exceed stock
        if (
          existingItem.quantity + action.payload.quantity >
          existingItem.stock
        ) {
          existingItem.quantity = existingItem.stock;
        } else {
          existingItem.quantity += action.payload.quantity;
        }
      } else {
        state.items.push(action.payload);
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
      saveCartToStorage(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.posterId !== action.payload
      );
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
      saveCartToStorage(state);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ posterId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.posterId === action.payload.posterId
      );
      if (item) {
        // Ensure quantity doesn't exceed stock
        item.quantity = Math.min(
          Math.max(1, action.payload.quantity),
          item.stock
        );
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.subtotal = totals.subtotal;
        saveCartToStorage(state);
      }
    },

    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.posterId === action.payload);
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.subtotal = totals.subtotal;
        saveCartToStorage(state);
      }
    },

    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.posterId === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.subtotal = totals.subtotal;
        saveCartToStorage(state);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.subtotal = 0;
      saveCartToStorage(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotalItems = (state: RootState) => state.cart.totalItems;
export const selectCartSubtotal = (state: RootState) => state.cart.subtotal;

export default cartSlice.reducer;
