# 개선순서
prettier 적용
var -> const/let
- 

리팩터링 진행하면서 lint 규칙 하나씩 추가
import 순서 정렬
- pnpm add eslint-plugin-import

https://www.youtube.com/watch?v=eeDbljgvCxg
function 함수 -> arrow function으로 통일
- var => const/let을 사용하는 이유와도 비슷할 듯
- 호이스팅이 안되는 게 더 개발자가 컨트롤하기 좋을 것이라 생각했음
- function의 쓰임이 많다보니 일반적인 함수를 사용할 때는 const로 통일하고 function을 사용해야 하는 경우에만 function을 사용할 수 있도록!
- 콜백 함수 안에서 사용하기에는 화살표 함수가 더 간결함
- arrow function은 중복 파라미터 방지 가능 : 하위 function 함수 브라우저에서 돌리면 3이 아니라 4로 나옴, const는 에러 뜸
```
function sum(a, a) {
  console.log(a + a);
}
sum(1,2);
```
- 함수 중복이슈 - 실제 브라우저에서 에러 못 잡음
```
function a() {
    console.log(1);
}
function a() {
    console.log(2);
}

console.log(a())
```

main 함수 함수 분리
- UI 렌더링 파트
- 랜덤 프로모션 적용 파트

calcCart => updateCartInfos
- 할인별 함수 분리

폴더구조
- const 상수 파일 추가 => 다시 삭제함 : 여러 곳에서 사용되는 것이 아닌데 파일을 넘나들면서 봐야하는 게 불편

함수/변수 접두사 의미
- update : 
- render : 
- schedule : 
- change : 
- handle :
- is :
- $ : element 앞에 추가. 구분짓기 위함


[] 함수 하나의 역할만 하고 있는 지 점검
추가 생성 함수
- calculateDiscountedPrice : 할인된 가격 계산 로직
- calculateDiscountRate : 할인률 계산 로직
- createBonusPointsTag : 포인트 element 생성
- formatLowStocksInfo : 재고 부족/품절 텍스트 포맷
- renderCartItemInfo : 총액 텍스트 업데이트
- getTargetItemElementQuantity : 카트에 특정 상품 담긴 수량

[] 노션에 있는 내용 보고 하나씩 점검하기
[] 변수명 논리 정리하기
[] 구조에 대한 논리 정리하기

[] 필요한 로직만 남겨두고 나머지는 utils나 다른 폴더로 옮기기

[] item, product 이름 이상한 부분이 있지는 않은 지 확인

- 폴더 분리
관심사가 한 눈에 들어오지 않아 비슷한 역할을 하는 함수끼리 묶어 파일 분리

======================

## 동료 개발자 피드백
- const 분리
- 텍스트 포맷팅 같은 함수는 아예 따로 utils로 구분 (이 경우 기존 utils에 있는 것들은 폴더명 수정 필요)
  - 추가 utils 분리함수 추천 :  suggest.price = Math.round(suggest.price * SUGGEST_DISCOUNT_RATE); 
- 함수의 경우 export 바로 하는 게 아니라 필요한 함수만 마지막에 몰아서 작성하기
- 애매해보이긴 하지만 view 가공하는 부분이랑 비즈니스 로직 다루는 부분이 구분되면 좋을 것 같다

=> 기존 utils 폴더명 services로 변경 : 비즈니스 로직을 담당하고 있기 때문에


## react typescript eslint
```
// eslint flat config 적용
// https://typescript-eslint.io/packages/typescript-eslint/
// https://brunch.co.kr/@hongjyoun/118

// import module 읽지 못하는 이슈
"import/resolver": {
          "node": {
            "paths": ["src"]
          }
        }
```