const TotalPrice = () => {
  return `
    <div id="cart-total" class="text-xl font-bold my-4">
      총액: 243000원
      <span class="text-green-500 ml-2">(10.0% 할인 적용)</span>
      <span id="loyalty-points" class="text-blue-500 ml-2">(포인트: 1858)</span>
    </div>
  `;
};

export default TotalPrice;
