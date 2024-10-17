import { selector } from "recoil";
import { totalPriceState } from "./totalPriceAtom";

export const totalPriceSelector = selector({
  key: "totalPriceSelector",
  get: ({ get }) => {
    const cart = get(totalPriceState);
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },
});
