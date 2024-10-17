1. 상품 관리

- 상품
  id: 제품 id
  name: 제품 이름
  val: 가격
  q: 재고

- 재고
  재고가 없거나 부족하면 상품 비활설화

2. 장바구니

- 제품 추가
  재고가 있으면 장바구니에 추가

- 제품 삭제
  제품을 장바구니에서 제거

- 수량 조절
  장바구니에 있는 제품의 +,-버튼 수량 조절, **1이하면 장바구니에서 제거**

3. 프로모션

- 번개 세일
  랜덤 제품에 대해 일정 시간 간격으로 **20%** 할인
  **=> 사용자에게 알림**
  **=> 랜덤 시간으로 시작(10초 이후) => 30초 간격 실행**

- 추천 상품 할인
  마지막으로 선택한 제품 이외의 랜덤 제품에 대해 **5%** 추가 할인 프로모션
  **=> 사용자에게 알림**
  **=> 랜덤 시간으로 시작(20초 이후) => 60초 간격 실행**

1. 10개 이상 구매
   제품에 따른 할인율 적용
   **대량 구매와 중복 할인 없음**

2. 대량 구매 할인
   30개 이상 구매 시, 25% 대량 구매 할인 적용
   **25% 할인된 가격이 이전 할인된 가격보다 싸면 적용**
   **10개 이상 구매와 중복 할인 없음**

- 요일 할인
  화요일에는 전체 구매 금액에 **10%** 할인이 **추가** 적용

4. 결제 금액

- 총액
  장바구니에 담긴 제품들의 **_총 금액_**+**_할인 적용율_**+**_구매금액에 따른 적립포인트_** 표시

└ basic
│ ├ components
│ │ ├ button.ts
│ │ ├ cart.ts
│ │ └ productSelect.ts
│ │
│ ├ data
│ │ └ productSelect.js
│ │
│ ├ style
│ │ └ index.js
│ │
│ ├ utils
│ │ ├ cart.ts
│ │ ├ discount.ts
│ │ ├ dom.ts
│ │ └ eventManager.ts
│ │
│ └ main.basic.js
