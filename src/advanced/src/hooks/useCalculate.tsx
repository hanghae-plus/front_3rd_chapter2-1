import { useMemo } from "react";

import { WEEKDAY } from "@/constants";
import DiscountController from "@/models/DiscountController";
import { DiscountType, ProductOption } from "@/types";

const useCalculate = (propsData: ProductOption[]) => {
  const calculateTotalPrice = useMemo(() => {
    const totalQuantity = propsData.reduce((acc, item) => acc + item.q, 0);
    const discountController = new DiscountController(propsData);

    const discountType = {
      noItem: propsData.length === 0,
      bulk: totalQuantity >= discountController.getBulkSize(),
      weekday: new Date().getDay() === WEEKDAY.TUESDAY,
      default: true,
    };

    const typeKey = Object.entries(discountType).find(({ 1: value }) => !!value)?.[0];
    return discountController.calculate(typeKey as DiscountType);
  }, [propsData]);

  return calculateTotalPrice;
};

export default useCalculate;
