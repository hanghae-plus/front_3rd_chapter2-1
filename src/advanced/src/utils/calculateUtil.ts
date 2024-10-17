import {
  QUANTITY_FOR_DISCOUNT,
  TOTAL_DISCOUNT_RATE,
  TOTAL_QUANTITY_FOR_DISCOUNT,
  TUESDAY_DISCOUNT_RATE,
} from '../constants';
import { isTuesday } from './dateUtil';
import { Item, Product } from './interfaceUtil';

function calculateTotalDiscountRate(
  totalAmountWithoutDiscount: number,
  totalAmount: number,
  totalQuantity: number,
): number {
  let totalDiscountRate = 0;
  const itemDiscount = totalAmountWithoutDiscount - totalAmount;
  if (totalQuantity >= TOTAL_QUANTITY_FOR_DISCOUNT) {
    const bulkDiscount = totalAmount * TOTAL_DISCOUNT_RATE;
    if (bulkDiscount > itemDiscount) {
      totalAmount = totalAmountWithoutDiscount * (1 - TOTAL_DISCOUNT_RATE);
      totalDiscountRate = TOTAL_DISCOUNT_RATE;
    } else {
      totalDiscountRate = itemDiscount / (totalAmountWithoutDiscount || 1);
    }
  } else {
    totalDiscountRate = itemDiscount / (totalAmountWithoutDiscount || 1);
  }
  if (isTuesday()) {
    totalDiscountRate = Math.max(totalDiscountRate, TUESDAY_DISCOUNT_RATE);
  }
  return totalDiscountRate;
}

function calculateTotalAmount(
  totalAmountWithoutDiscount: number,
  totalAmount: number,
  totalQuantity: number,
): number {
  const itemDiscount = totalAmountWithoutDiscount - totalAmount;
  if (totalQuantity < TOTAL_QUANTITY_FOR_DISCOUNT) return totalAmount;
  const bulkDiscount = totalAmount * TOTAL_DISCOUNT_RATE;
  if (bulkDiscount <= itemDiscount) return totalAmount;
  return totalAmountWithoutDiscount * (1 - TOTAL_DISCOUNT_RATE);
}

function calculateInitTotalAmount(
  itemList: Item[],
  productList: Product[],
): number {
  return itemList.reduce((acc, cur) => {
    const currentItem = productList.find(
      (product) => product.id === cur.id,
    ) as Product;
    const quantity = cur.quantity;
    const itemAmount = currentItem.price * quantity;
    const discountRate =
      quantity >= QUANTITY_FOR_DISCOUNT ? currentItem.discountRate : 0;
    return acc + itemAmount * (1 - discountRate);
  }, 0);
}

function calculateTotalAmountWithoutDiscount(
  itemList: Item[],
  productList: Product[],
): number {
  return itemList.reduce((acc, cur) => {
    const currentItem = productList.find(
      (product) => product.id === cur.id,
    ) as Product;
    const quantity = cur.quantity;
    return acc + currentItem.price * quantity;
  }, 0);
}

export function calculateCartTotalAmount(
  itemList: Item[],
  productList: Product[],
): number {
  const initTotalAmount = calculateInitTotalAmount(itemList, productList);
  const totalAmountWithoutDiscount = calculateTotalAmountWithoutDiscount(
    itemList,
    productList,
  );
  const totalQuantity = itemList.reduce((acc, cur) => acc + cur.quantity, 0);

  let _totalAmount = calculateTotalAmount(
    totalAmountWithoutDiscount,
    initTotalAmount,
    totalQuantity,
  );

  return isTuesday() ? 1 - TUESDAY_DISCOUNT_RATE : _totalAmount;
}

export function calculateCartTotalDiscountRate(
  itemList: Item[],
  productList: Product[],
): number {
  const initTotalAmount = calculateInitTotalAmount(itemList, productList);
  const totalAmountWithoutDiscount = calculateTotalAmountWithoutDiscount(
    itemList,
    productList,
  );
  const totalQuantity = itemList.reduce((acc, cur) => acc + cur.quantity, 0);

  return calculateTotalDiscountRate(
    totalAmountWithoutDiscount,
    initTotalAmount,
    totalQuantity,
  );
}
