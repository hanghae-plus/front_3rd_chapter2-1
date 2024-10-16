- [기본과제](#기본과제)
  - [리팩토링 체크리스트](#리팩토링-체크리스트)
  - [개선된 점](#개선된-점)
  - [추가 고려사항](#추가-고려사항)
- [심화과제](#심화과제)
  - [리팩토링 체크리스트](#리팩토링-체크리스트-1)
  - [개선된 점](#개선된-점-1)
  - [추가 고려사항](#추가-고려사항-1)

## 기본과제

- 구현 기록

1. 함수들이 여러개 선언되어있고 함수들이 실행되는 형태. 전역변수로 선언된 것들도 있음.
2. 함수 분리 -> 함수 명 -> 변수명 -> 그룹핑 순으로 진행할 예정.
3. 함수 main 안에 여러 기능을 가진 로직(createElement, element의 attribute를 정해주는 로직 등)들이 섞여 있었고 기능에 맞게 함수들을 분리해주는 것이 좋겠다.
4. 먼저 main함수를 분리해보기로 결정. main 함수안에는 prodList와 root, cont 등 element들을 생성하고 attribute들을 설정하는 로직, 부모요소에 자식 요소들을 붙여주는 로직, setTimeout이 2개가 있음.
5. 먼저 createElement하는 로직 분리. -> 함수명은 createElement로 지음(이 함수의 역할은 element들을 새로 만들어 내는 것이기 때문).
6. 전역변수가 아닌 root, cont, wrap, hTxt는 return해 줌. 지역변수이기 때문에 var를 쓸 필요가 없고 그 안에서 재할당 해주는 곳이 없기 때문에 const로 변경함.
7. 속성들을 정하는 함수의 이름은 setElementAttribute로 지음. 직관적으로 정하다 + element + 속성을 합침.
8. 그 다음에는 appendChild를 통해 DOM을 만드는 기능을 가진 함수로 addElement라는 이름으로 만들었다(더하다 + element)
9. setTimeout 안에 있는 callback을 따로 분리하여 선언해주기로 했다(setTimeout안에 callback이 복잡하게 되어있어 가독성이 떨어짐)
10. callback은 중복적으로 쓰이는 곳이 없어 main 함수 안에 작성. callback 함수의 이름은 handle + 번개세일(surprise sale). 구매 제안하는 callback 함수는 handle+suggest.
11. addEventListner들의 callback 함수들을 바깥에 선언해줘 가독성을 높임.
12. 추가하기 버튼을 누르면 callback함수의 실행되기 때문에 handle + add button, handle+cart item
13. 함수들을 분리하고 나니 실행순서가 눈에 보이기 시작했다. main 실행 후 요소들에 클릭 이벤트를 걸어 놓은걸로 크게 나눌 수 있고, main 함수 안에서 createElement, setElementAttribute, updateSelOpts, addElement, calcCart, setTimeout이 실행된다. 함수 선언부들을 위에 위치시키고 실행부는 밑으로 옮겼다.
14. 변수명들을 정리하기 전 전역변수들이 이렇게 많이 필요한지 살펴봄(전역 변수를 많이 선언할 경우 메모리를 많이 잡아 먹음. 지역변수일 경우 함수가 실행될 때만 선언됨).
15. 함수 안에서만 사용하는 변수들을 할당 이후 값이 바뀐다면 let, 아니면 const로 변경
16. 함수 내에서 비슷한 일을 하는 코드들끼리 그룹핑.
17. 화살표 함수로 만들 수 있는건 화살표 함수로 만들기
18. 변수들의 변수명 변경. 직관적이고 어떤 값인지 알 수 있도록 지향. 변수는 명사로 짓기.(cont -> container, hTxt -> cart(장바구니를 나타내기 때문), sum -> totalAmount) 변수명이 너무 길지 않다면(15글자 이하 -> 여기에 대한 근거는? 아직 없다) 축약형을 쓰지 말자(addBtn -> addButton, prodList -> productList). element 요소들에게는 이름뒤에 element를 붙여줌(다른 변수값들과 쉽게 구분하기 위해)
19. 수량은 quantity, 합산한 금액은 amount, 물건의 가격은 price로 이름지음.
20. createUI안에서 createElement, setElementAttribute, addElement의 중복들을 피하기 위해 하나의 함수로 변경.
21. if문 안에 early return을 할 수 있는 것들은 early return 할 수 있도록 수정.
22. UI를 업데이트하는 로직과 비지니스 로직 분리.

<!-- 왜 화살표 함수 안썼는지도 적기 -->

### 리팩토링 체크리스트

- [x] 코드가 Prettier를 통해 일관된 포맷팅이 적용되어 있는가?
- [ ] 적절한 줄바꿈과 주석을 사용하여 코드의 논리적 단위를 명확히 구분했는가?
- [ ] 변수명과 함수명이 그 역할을 명확히 나타내며, 일관된 네이밍 규칙을 따르는가?
- [ ] 매직 넘버와 문자열을 의미 있는 상수로 추출했는가?
- [ ] 중복 코드를 제거하고 재사용 가능한 형태로 리팩토링했는가?
- [ ] 함수가 단일 책임 원칙을 따르며, 한 가지 작업만 수행하는가?
- [ ] 조건문과 반복문이 간결하고 명확한가? 복잡한 조건을 함수로 추출했는가?
- [ ] 코드의 배치가 의존성과 실행 흐름에 따라 논리적으로 구성되어 있는가?
- [ ] 연관된 코드를 의미 있는 함수나 모듈로 그룹화했는가?
- [ ] ES6+ 문법을 활용하여 코드를 더 간결하고 명확하게 작성했는가?
- [ ] 전역 상태와 부수 효과(side effects)를 최소화했는가?
- [ ] 에러 처리와 예외 상황을 명확히 고려하고 처리했는가?
- [ ] 코드 자체가 자기 문서화되어 있어, 주석 없이도 의도를 파악할 수 있는가?
- [ ] 비즈니스 로직과 UI 로직이 적절히 분리되어 있는가?
- [ ] 객체지향 또는 함수형 프로그래밍 원칙을 적절히 적용했는가?
- [ ] 코드의 각 부분이 테스트 가능하도록 구조화되어 있는가?
- [ ] 성능 개선을 위해 불필요한 연산이나 렌더링을 제거했는가?
- [ ] 새로운 기능 추가나 변경이 기존 코드에 미치는 영향을 최소화했는가?
- [ ] 리팩토링 시 기존 기능을 그대로 유지하면서 점진적으로 개선했는가?
- [ ] 코드 리뷰를 통해 다른 개발자들의 피드백을 반영하고 개선했는가?

### 개선된 점

### 추가 고려사항

## 심화과제

- 구현과정

1. react, typescript와 관련된 패키지들을 설치(react, react-dom, @vite/react,@babel/plugin-transform-react-jsx, typescript)
2. tailwind.config.json을 만들고 config 설정, vite.config.js에 js에서 jsx도 읽을 수 있도록 플러그인 설정
3. main.advanced.js에 App(root component)를 연결시킴.
4. basic 과제에서 리팩토링한 코드를 보고 UI부터 구성하기 시작.
5.

### 리팩토링 체크리스트

- [ ] 코드가 Prettier를 통해 일관된 포맷팅이 적용되어 있는가?
- [ ] 적절한 줄바꿈과 주석을 사용하여 코드의 논리적 단위를 명확히 구분했는가?
- [ ] 변수명과 함수명이 그 역할을 명확히 나타내며, 일관된 네이밍 규칙을 따르는가?
- [ ] 매직 넘버와 문자열을 의미 있는 상수로 추출했는가?
- [ ] 중복 코드를 제거하고 재사용 가능한 형태로 리팩토링했는가?
- [ ] 함수가 단일 책임 원칙을 따르며, 한 가지 작업만 수행하는가?
- [ ] 조건문과 반복문이 간결하고 명확한가? 복잡한 조건을 함수로 추출했는가?
- [ ] 코드의 배치가 의존성과 실행 흐름에 따라 논리적으로 구성되어 있는가?
- [ ] 연관된 코드를 의미 있는 함수나 모듈로 그룹화했는가?
- [ ] ES6+ 문법을 활용하여 코드를 더 간결하고 명확하게 작성했는가?
- [ ] 전역 상태와 부수 효과(side effects)를 최소화했는가?
- [ ] 에러 처리와 예외 상황을 명확히 고려하고 처리했는가?
- [ ] 코드 자체가 자기 문서화되어 있어, 주석 없이도 의도를 파악할 수 있는가?
- [ ] 비즈니스 로직과 UI 로직이 적절히 분리되어 있는가?
- [ ] 객체지향 또는 함수형 프로그래밍 원칙을 적절히 적용했는가?
- [ ] 코드의 각 부분이 테스트 가능하도록 구조화되어 있는가?
- [ ] 성능 개선을 위해 불필요한 연산이나 렌더링을 제거했는가?
- [ ] 새로운 기능 추가나 변경이 기존 코드에 미치는 영향을 최소화했는가?
- [ ] 리팩토링 시 기존 기능을 그대로 유지하면서 점진적으로 개선했는가?
- [ ] 코드 리뷰를 통해 다른 개발자들의 피드백을 반영하고 개선했는가?

### 개선된 점

### 추가 고려사항
