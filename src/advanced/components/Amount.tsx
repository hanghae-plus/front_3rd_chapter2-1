// components/Amount.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useFlashSale } from '../hooks/useFlashSale';

const Amount: React.FC = () => {
  const { cart } = useCart();
  const [bonusPoints, setBonusPoints] = useState(0);
  const [events, setEvents] = useState<any>(null);
  const flashSaleItem = useFlashSale();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/src/advanced/events/events.json');
        const data = await response.json();
        console.log(data);

        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 60000); // 1분마다 이벤트 정보 갱신

    return () => clearInterval(interval);
  }, []);

  const { discountRate, finalAmount } = useMemo(() => {
    const total = cart.reduce((sum, item) => {
      console.log('sum', sum);
      console.log('item.price', item.price);

      return sum + item.price * item.quantity;
    }, 0);

    console.log('total', total);

    if (!events) {
      return {
        totalAmount: total,
        discountRate: 0,
        finalAmount: total,
      };
    }

    let discount = 0;
    console.log('1', discount);

    // 각 상품별 할인 계산
    cart.forEach((item) => {
      const productDiscount = events.productDiscounts.find(
        (pd: any) => pd.id === item.id
      );
      if (productDiscount && item.quantity >= productDiscount.minQuantity) {
        discount += item.price * item.quantity * productDiscount.rate;
      }
    });
    console.log('2', discount);

    // 총 구매 개수에 따른 할인
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity >= events.bulkDiscount.minQuantity) {
      const bulkDiscount = total * events.bulkDiscount.rate;
      if (bulkDiscount > discount) {
        discount = bulkDiscount;
      }
    }
    console.log('3', discount);

    // 요일 할인
    const today = new Date().getDay();
    if (today === events.TuesdayDiscount.day) {
      discount += total * events.TuesdayDiscount.rate;
    }
    console.log('4', discount);

    // 추천세일
    // if (Math.random() < events.recommendedSale.probability) {
    //   discount += total * events.recommendedSale.rate;
    // }
    // console.log('5', discount);

    // 번개세일은 이미 상품 가격에 반영되어 있으므로 여기서는 추가 계산하지 않습니다.
    const discountRate = total > 0 ? discount / total : 0;
    const finalAmount = total - discount;
    console.log(discountRate);

    return {
      totalAmount: total,
      discountAmount: discount,
      discountRate,
      finalAmount,
    };
  }, [cart, events, flashSaleItem]);

  useEffect(() => {
    // 포인트 누적 로직
    const newPoints = Math.floor(finalAmount / 1000);
    setBonusPoints((prevPoints) => prevPoints + newPoints);
  }, [finalAmount]);

  return (
    <div className='text-xl font-bold my-4' id='cart-total'>
      총액: {Math.round(finalAmount)}원
      {discountRate > 0 && (
        <span className='text-green-500 ml-2'>
          ({(discountRate * 100).toFixed(1)}% 할인 적용)
        </span>
      )}
      <span className='text-blue-500 ml-2' id='loyalty-points'>
        (포인트: {bonusPoints})
      </span>
    </div>
  );
};

export default Amount;
