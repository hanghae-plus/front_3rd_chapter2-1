import React from 'react';

import {
  LUCKY_DELAY_TIME,
  LUCKY_DISCOUNT_RATE,
  LUCKY_INTERVAL_TIME,
  LUCKY_RANDOM_RATE,
  SUGGEST_DELAY_TIME,
  SUGGEST_DISCOUNT_RATE,
  SUGGEST_INTERVAL_TIME,
} from '../constants';
import { Product } from './interfaceUtil';

type Callback = () => void;

export function createDelayedIntervalFunction(
  callback: Callback,
  delay: number,
  interval: number,
) {
  return function (): void {
    setTimeout(function () {
      setInterval(callback, interval);
    }, delay);
  };
}

function applyLuckySale(
  productList: Product[],
  setProductList: React.Dispatch<React.SetStateAction<Product[]>>,
): void {
  const _productList = [...productList];
  const luckyItem =
    _productList[Math.floor(Math.random() * _productList.length)];

  if (Math.random() < LUCKY_RANDOM_RATE && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(luckyItem.price * (1 - LUCKY_DISCOUNT_RATE));
    alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
    setProductList(_productList);
  }
}

function applySuggestItem(
  lastAddedProduct: null | string,
  productList: Product[],
  setProductList: React.Dispatch<React.SetStateAction<Product[]>>,
): void {
  if (!lastAddedProduct) return;
  const _productList = [...productList];
  const suggest = _productList.find(
    (_product) => _product.id !== lastAddedProduct && _product.quantity > 0,
  );

  if (suggest) {
    alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
    suggest.price = Math.round(suggest.price * (1 - SUGGEST_DISCOUNT_RATE));
    setProductList(_productList);
  }
}

export function setLuckyTimer(
  productList: Product[],
  setProductList: React.Dispatch<React.SetStateAction<Product[]>>,
): void {
  createDelayedIntervalFunction(
    () => applyLuckySale(productList, setProductList),
    LUCKY_DELAY_TIME,
    LUCKY_INTERVAL_TIME,
  )();
}

export function setSuggestTimer(
  lastAddedProduct: null | string,
  productList: Product[],
  setProductList: React.Dispatch<React.SetStateAction<Product[]>>,
): void {
  createDelayedIntervalFunction(
    () => applySuggestItem(lastAddedProduct, productList, setProductList),
    SUGGEST_DELAY_TIME,
    SUGGEST_INTERVAL_TIME,
  )();
}
