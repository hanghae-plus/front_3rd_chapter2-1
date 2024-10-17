import { atom } from "recoil";

export const totalPriceState = atom({
  key: "cartState",
  default: [{ totalAmount: 0, bonusPoint: 0 }],
});
