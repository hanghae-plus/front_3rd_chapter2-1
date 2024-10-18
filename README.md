# JavaScript 및 React 코딩 컨벤션

## 1. 명명 규칙

- **변수와 함수**: camelCase를 사용합니다.

  ```javascript
  const userAge = 25;
  function calculateTotalAmount() { ... }
  ```

- **상수**: 대문자와 snake_case를 사용합니다.

  ```javascript
  const MAX_ITEMS = 100
  const FLASH_SALE_CHANCE = 0.5
  ```

- **컴포넌트**: PascalCase를 사용합니다.

  ```javascript
  function UserProfile() { ... }
  const ProductItem = () => { ... }
  ```

- **파일 이름**: 컴포넌트 파일은 PascalCase, 그 외는 kebab-case를 사용합니다.
  ```
  UserProfile.js
  cart-utils.js
  ```

## 2. 코드 포매팅

- 들여쓰기는 2칸 공백을 사용합니다.
- 중괄호는 같은 줄에서 시작합니다.
  ```javascript
  function example() {
    if (condition) {
      // code
    } else {
      // code
    }
  }
  ```

## 3. React 관련

- 함수형 컴포넌트와 훅을 사용합니다.
- props는 구조 분해 할당을 사용합니다.
  ```javascript
  function Component({ prop1, prop2 }) { ... }
  ```
- 조건부 렌더링에는 삼항 연산자나 &&를 사용합니다.
  ```javascript
  {
    isLoggedIn ? <UserInfo /> : <LoginButton />
  }
  {
    isLoading && <Spinner />
  }
  ```

## 4. 상태 관리

- 상태 업데이트 시 불변성을 유지합니다.
  ```javascript
  setProducts([...products, newProduct])
  ```
- 복잡한 상태 로직은 useReducer를 사용합니다.

## 5. 함수

- 가능한 한 순수 함수를 사용합니다.
- 함수는 한 가지 작업만 수행하도록 합니다.
- 부수 효과가 있는 함수는 이름에 반영합니다. (예: updateUserProfile)

## 6. imports

- imports는 그룹화하고 알파벳 순으로 정렬합니다.

  ```javascript
  import React from 'react'
  import { useEffect, useState } from 'react'

  // 내부 모듈
  import { ProductItem } from './ProductItem'
  import { CONSTANTS } from '../constants'
  ```
