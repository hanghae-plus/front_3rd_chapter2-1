# 클린코드 2-1 과제 리팩터링 과정 요약

주요 개선 사항 위주 정리

## 1. 코드 스타일 및 품질 개선

### 1.1 Prettier 적용
- 일관된 코드 스타일을 위해 Prettier 적용
- 기존에 17팀에서 미리 맞춰둔 prettier과 ignore 규칙으로 적용

### 1.2 변수 선언 방식 변경
- `var` 대신 `const`와 `let`을 사용하여 변수 스코프를 명확히 하고 의도치 않은 재할당을 방지

### 1.3 ESLint 규칙 점진적 적용
- 리팩터링을 진행하면서 ESLint 규칙을 하나씩 추가
- flat config 사용
- import 순서 정렬을 위해 `eslint-plugin-import`를 추가
- import 순서에 대한 세부 규칙을 추가
- React와 TypeScript를 위한 설정    
  - 주요 설정 내용:
    - TypeScript-ESLint 설정 적용
    - import 모듈 해결을 위한 설정 추가

### 1.4 함수 선언 방식 통일
- 일반 함수를 화살표 함수로 통일
- 이유:
  - 호이스팅 방지로 개발자가 코드 흐름을 더 잘 제어할 수 있음
  - 콜백 함수에서 더 간결한 문법을 제공
  - 중복 파라미터 방지 등 추가적인 이점이 있음

## 2. 코드 구조 개선

### 2.1 주요 함수 분리
- `main` 함수를 다음과 같이 분리
  - UI 렌더링 파트
  - 랜덤 프로모션 적용 파트

### 2.2 함수 이름 및 역할 개선
- `calcCart`를 `updateCartInfos`로 변경하고, 할인 종류별로 함수를 분리

### 2.3 함수 역할 단일화
- 각 함수가 하나의 역할만 수행하도록 개선
- 새로 추가된 함수들:
  - `calculateDiscountedPrice`: 할인된 가격 계산
  - `calculateDiscountRate`: 할인률 계산
  - `createBonusPointsTag`: 포인트 element 생성
  - `formatLowStocksInfo`: 재고 부족/품절 텍스트 포맷
  - `renderCartItemInfo`: 총액 텍스트 업데이트
  - `getTargetItemElementQuantity`: 카트에 특정 상품 담긴 수량 조회

### 2.4 폴더 구조 개선
- 관심사별로 함수를 그룹화하여 파일을 분리
- `utils` 폴더명을 `services`로 변경하여 비즈니스 로직을 담당하는 폴더임을 명시

### 2.5 네이밍 컨벤션 정립
함수/변수 접두사의 의미 지정
- `update`: 상태 업데이트
- `render`: UI 렌더링
- `schedule`: 스케줄링 관련
- `change`: 값 변경
- `handle`: 이벤트 핸들러
- `is`: 불리언 반환
- `$`: DOM 요소를 참조하는 변수

## 3. 타입스크립트 및 리액트 관련 개선

### 3.1 타입 정의 개선
- `interface` 대신 `type`을 사용
  - 기존 의견 :
    - interface는 데이터의 구조를 명시하고 type은 특정 데이터가 몇 가지 literal로 구분되는 경우에만 사용
    - extends를 사용하여 확장성을 높임
  - 팀원 의견 :
    - interface를 사용할 경우 개발할 때 마우스 오버 시 구조가 바로 보이지 않음
    - extends의 경우 intersection type으로 대체 가능
  - 채택 :
    - type으로 사용할 때만의 편리함이 있는 지 느껴보고자 type 채택
- 타입 이름에 접두사나 접미사를 사용하지 않음
- 타입 import 시 `import type {}` 구문을 사용

### 3.2 Props 네이밍
- props 타입은 `Props`로 통일
  - 기존 : 컴포넌트명 + Props로 이름지음
  - 채택 : Props로만 이름짓기 => export 하지 않기 때문에!
- 어쩔 수 없이 props를 export 해야하고 다른 컴포넌트에서 사용해야 하는 경우, 중복 방지를 위해 `as`를 사용하여 props import

### 3.3 폴더 구조
- 2개 이상의 파일이 있는 폴더에 `index.ts`를 추가
- 팀원 피드백에 따라 `addCart` 함수를 productSelect 부분에서 operations 파일로 이동

## 4. 성능 및 버그 개선

### 4.1 이벤트 중복 발생 방지
- `clearTimeout`과 `clearInterval`을 추가하여 이벤트 중복 발생을 방지

## 5. 동료 개발자 피드백 반영

- constants 파일 분리 : 기존에 특정 함수 안에서만 한번 쓰이고 말 상수라 같은 곳에 위치했는데, 어차피 상수명이 의미있는 이름으로 되어있다면 외부에 빼고 어떤 숫자인지는 몰라도 되겠다는 의견에 따라 분리
- 텍스트 포맷팅 함수를 별도의 utils로 분리
- 함수 export 방식 개선: 필요한 함수만 파일 하단에서 일괄 export
- view/비즈니스 로직 부분 구분
  - render, create, remove 관련된 함수는 view로 분리