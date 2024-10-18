import { useEffect, useState } from "react";
import { ProductList } from "../types/product";
import { deleteCartItem } from "../service/cartService";

interface CartItemProps {
  items: ProductList[]; // items prop 추가
  onQuantityChange: (id: string, quantity: number) => void;
}

export const CartItem = ({ items, onQuantityChange }: CartItemProps) => {
  const [itemList, setItemList] = useState<ProductList[]>(items);
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    setItemList(items);

    const initialQuantities = items.reduce((acc, item) => {
      acc[item.id] = item.quantity; // 각 아이템의 초기 수량을 1 또는 주어진 수량으로 설정
      return acc;
    }, {} as { [key: string]: number });

    setSelectedQuantities(initialQuantities);
  }, [items]);

  const updateCartItem = (updateId: string, changeQuantity: number) => {
    const newSelectedQuantity = (selectedQuantities[updateId] || 0) + changeQuantity;

    if (newSelectedQuantity < 1) {
      // 수량이 0 이하로 떨어지면 제거하고 부모에게 전달
      onQuantityChange(updateId, 0);
      return; // 더 이상의 처리를 하지 않음
    }

    if (selectedQuantities[updateId] !== newSelectedQuantity) {
      setSelectedQuantities((prevQuantities) => ({
        ...prevQuantities,
        [updateId]: newSelectedQuantity,
      }));
    }

    // 부모에게 변경된 수량을 전달
    onQuantityChange(updateId, newSelectedQuantity);
  };

  const handlerDeleteCartItem = (deleteId: string) => {
    setItemList(deleteCartItem(deleteId, itemList));
    onQuantityChange(deleteId, 0);
  };

  return (
    <div id="cart-items">
      {itemList.length > 0
        ? itemList.map(({ id, price, name }) => (
            <div key={id} className="flex justify-between items-center mb-2">
              <span>
                {name} - {price}원 x {selectedQuantities[id]}
              </span>
              <div>
                <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id={id} data-change="-1" onClick={() => updateCartItem(id, -1)}>
                  -
                </button>
                <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id={id} data-change="1" onClick={() => updateCartItem(id, 1)}>
                  +
                </button>
                <button className="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id={id} onClick={() => handlerDeleteCartItem(id)}>
                  삭제
                </button>
              </div>
            </div>
          ))
        : ""}
    </div>
  );
};
