import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { CartItem } from "@/models/cart-item.model";

type CartState = CartItem[];

const initialState: CartState = Cookies.getJSON("cart") || [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addOrUpdateCart: (state, action: PayloadAction<CartItem>) => {
      const newCartItem = action.payload;

      const existingCartItem = state.find(
        (cartItem) => cartItem.id === newCartItem.id,
      );

      if (!newCartItem.discountPrice || newCartItem.discountPrice <= 0) {
        newCartItem.discountPrice = newCartItem.price;
      }

      if (existingCartItem) {
        existingCartItem.quantity += newCartItem.quantity;
      } else {
        newCartItem.vat =
          newCartItem.price -
          newCartItem.price / (1 + newCartItem.tvaPercent / 100);

        const hasDiscount =
          newCartItem.discountPrice &&
          newCartItem.discountPrice > 0 &&
          newCartItem.discountPrice < newCartItem.price;

        // The .toFixed(2) has been removed from the discount calculation.
        newCartItem.discount = hasDiscount
          ? ((newCartItem.price - newCartItem.discountPrice) /
              newCartItem.price) *
            100
          : 0;

        newCartItem.vatDiscount =
          newCartItem.discountPrice -
          newCartItem.discountPrice / (1 + newCartItem.tvaPercent / 100);

        state.push(newCartItem);
      }

      Cookies.set("cart", JSON.stringify(state));
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;
      const cartItem = state.find((item) => item.id === id);

      if (cartItem) {
        // Update the quantity and stock directly on the draft
        cartItem.quantity = quantity;
        cartItem.currentStock = cartItem.stock - quantity;

        // If quantity is 0, remove the item from the draft
        if (quantity === 0) {
          const index = state.findIndex((item) => item.id === id);
          if (index !== -1) {
            state.splice(index, 1); // Removes the item in place
          }
        }
      }

      // Cookies.set will save the updated state after the mutation
      Cookies.set("cart", JSON.stringify(state));
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      const cartItemId = Number(action.payload);
      const newState = state.filter((cartItem) => cartItem.id !== cartItemId);

      Cookies.set("cart", JSON.stringify(newState));
      return newState;
    },

    clearCart: () => {
      Cookies.remove("cart");
      return [];
    },
  },
});

export const { addOrUpdateCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
