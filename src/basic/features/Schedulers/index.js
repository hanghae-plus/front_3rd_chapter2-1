import { recommendation } from "./recommendation";
import { randomDiscount } from "./randomDiscount";

export function schedulers() {
  recommendation();
  randomDiscount();
}
