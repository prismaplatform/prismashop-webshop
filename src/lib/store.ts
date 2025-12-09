import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "@/lib/slices/cartSlice";
import orderDetailSlice from "@/lib/slices/orderDetailSlice";

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    orderDetails: orderDetailSlice,
  },
});

// Infer the types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
