// UserData - data: 자료(들)
// 이론을 세우는 데 기초가 되는 사실·자료.
// UserInfo - information: 정보
// 상황, 사람, 사건 등에 대한 사실

import { UserType } from './type';
import { IUser } from './type';
import { user } from './';

// User(x), UserInfo(x) - 컴포넌트명과 겹치는 상황이 발생할 수 있다.
// UserData(o) - 범용적이어서 컨벤션을 맞추기 좋고, Component로 작성할 일이 없을 듯하다. I, Type - 해결법 중 일부
// UserType - IUser에 비해서 가독성이 좋다. (타입이라는 것을 알 수 있음 - 특히 import)
// UserDataType - IUser에 비해서 가독성이 좋다. (타입이라는 것을 알 수 있음 - 특히 import)
// UserStatusType
// UserHobbyType Array는 -List - 가독성

const userType: <Pick, <UserType, 'type'>> = '';
// 데이터의 일부를 가져다 쓰는 경우, Pick을 사용. - 확실하다

type UserTypeType = 'admin' | 'customer'

UserType.type

const user: UserType = {
  type: 'admin'
}


// UserDetailData
interface UserType {
  userName: string; // username의 경우, 붙여 쓰는 경우도 있지만, customerName 등, 다른 이름과 일치하는 컨벤션을 추구.
  // fullName: string;
  // name이 하나인데 굳이 full을 사용할 이유가 없다고 생각. 오히려 어떤 이름인지 적는 게 낫다고 생각.
  age: number;
  isActive: boolean;
  // activeStatusFlag : boolean;

  value: string;
  detail: string;
  // detailsString: string;
  // 배열이 아니면, 단수형. - 배열이면 단수형 + List
  // => s로 끝나는 단어의 경우에 애매해짐.
  // 복수형에 s만 붙어 있을 경우, 못 보고 지나칠 경우 발생 가능.
}
const user: UserType = {
  userName: '메리디우스',
  age: 83,
  isActive: false,
  value: '글래디에이터',
  detail: '검투사'
}

// I ex) IUserData
// Type ex) UserDataType
// UserData

// getUserValue
// getAdmin - 어드민 데이터 또는 어드민 리스트를 가져올 것 같은데, 실제로 반환되는 값은 permissions와 role 뿐이다.
// getAdminPermissionList - getter
// getAdminAuth
// const getAdminPermissionList = (input: string | number) => {
const getRolePermissionList = (input: string | number) => { // - 확장의 경우 - 예시
  // switch 문 - 하나의 값의 비교처리는 switch문 사용
    // default 처리 ? - 최대한 case 조건 명시 후, default는 생략 가능한 경우 생략 - 반드시 필요한 경우에만 작성
  // 삼항연산자는, if else 만 사용되는 경우, 즉시 return이 필요한 경우
  // if 문 - 두 개 이상의 값의 조건 처리, 두 개 이상의 조건문 사용 필요 시 (한 줄 리턴 없이, 중괄호 사용)

  user.type: 'admin', 'consumer'

  // if문 안에서, return이 존재할 때, else if문을 쓸 것인지, if문을 쓸 것인지. - 굳이 적을 필요 없음 + 가독성 (들여 쓰기 및 조건문 확인)
  // else if문이 반드시 필요한 경우에만 else if를 사용.
  // depth - 2depth까지만, 조건이 복잡해지면 관심사에 따라 함수로 처리
  // 조건문 falsy: null/undefined 명시, boolean 생략 if(user !== undefined)(o) if(!user) (x)
    // [] => length를 숫자 비교로 판단 (내부 값의 유무 등.)
    if (userList.length === 0) { }

  // 객체키값 유무판단
    if(user.hasOwn('key') && user.hasOwn('key2'))
    if ('a' in user && 'key2' in user)
      if (user['a'] !== undefined)
      
  const keys = Object.keys(user)
            ['key', 'key2', 'key3'].includes(keys) 
  
  // 키 확인할 게 많으면, 유틸 함수로 분리할 듯.
  export const notInclduesnames = () => {
    if (!['alpha', 'beta', 'chalie'].includes(user.name)) {
    }
  }

  // 인간이 받아 들이는 게, Positive - 흐름(당연한 얘가 먼저 올 거다), '얘가 Negative 구나'
  // 부정형을 쓰는 것을 지양하라
  // 긍정형을 쓰는 것을 지향하라
  const isIncludesAllNames = () => {
    조직 대형 프로젝트 문서화 - 무조건 맞춰야 돼요 - 한 사람이 작성한 것처럼 보이는 게 BEST - 보통은 한 사람이 작성해도 여러 명이 작성한 것처럼 보일 수 있어욬ㅋ
    머기업 갈수록 심해집니다
    
  }
let isActive = true
let count = 0;

if (isActive) return // - 함수 실행 방지, falsy case 처리

  count--
if (!isActive) {
  count--;
  return;
} else if (isActive && -1 < count < 3) else {

}


const arr = []
const userA = 'Ken'


  if (isActive) {
    count--;
    return
  }
  aksdfhkjsdafh();

//

  if (isActive) {
    count--;
  }
  aksdfhkjsdafh();

//  


  if (isActive) {
    count--;
  } else {
    aksdfhkjsdafh();
  }


  // if (isFair) {
    // arr.push(userA)
  // }
  // aksdfhkjsdafh;

// BASE CODE
  if (user.isLoggedIn) {
    if (user.hasPermission) {
      if (eventTriggered) {
        executeAction();
      } else {
        showNotification("Action cannot be executed.");
      }
    } else {
      showNotification("You do not have permission.");
    }
  } else {
    redirectToLogin();
  }

  // 1.
  if (!user.isLoggedIn) {
    redirectToLogin();
    return;
  }
  
  if (!user.hasPermission) {
    showNotification("You do not have permission.");
    return;
  }
  
  if (!eventTriggered) {
    showNotification("Action cannot be executed.");
    return;
  }
  
  executeAction();

  // 2.
  if (user.isLoggedIn) {
    if (user.hasPermission) {
      if (eventTriggered) {
        executeAction();
      } else {
        showNotification("Action cannot be executed.");
      }
    } else {
      showNotification("You do not have permission.");
    }
  } else {
    redirectToLogin();
  }
  // 3.
  if (!user.isLoggedIn) {
    redirectToLogin();
  } else if (!user.hasPermission) {
    showNotification("You do not have permission.");
  } else if (!eventTriggered) {
    showNotification("Action cannot be executed.");
  } else {
    executeAction();
  }

// 이게 얼리리턴이 좋은 부분이 있는데.... 그 부분이 이 부분은 아닐 거라 생각합니다
// 얼리 리턴은 보통 컴포넌트에서, 값이 없을 때 처리하는 등...
// 
// 요런 느낌...?

// 그리고 조건문에서도,
// 특정 연산을 하다 보면 if 나열이 좋은데 보통 switch를 쓰기도 하고 return을 반드시 쓰는 경우가 대상이 되는 듯합니다.
// 근데 사실 또, 성능적으로 보면 else if가 더 좋습니다 return이 반드시 들어가지 않으면요. - 조건을 덜 돌아요 - else if 이전에 해당하는 값이 이미 제외 처리 돼서

// const fruits = ['사과', '바나나', '키위']

// function () {
//   if (fruits.length > 0) {
//     fruits.pop()
//     return
//   }
//   if (fruits.length > 1) {
//     console.log('아직 과일 많다.')
//   }
//   console.log('남은 과일 -> ', fruits)
// }
'!!!팀이 제출하는 과제의 코드가 일치해야 해요!!!'
// 컨벤션 가이드 문서




const fruit = {
  banana: 'banana'
  apple: 'apple'
} as const

interface Fruit {
  [key: keyof typeof fruit]: keyof typeof fruit
}
// type Fruit = {
//   banana: 'string',
//   apple: 'string'
// }

// https://inpa.tistory.com/entry/TS-%F0%9F%93%98-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-keyof-typeof-%EC%82%AC%EC%9A%A9%EB%B2%95


switch (input) {
  case 'admin':
    return;
}
if(input === 'admin') 
  return input === "admin" ? { role: "admin", permissionList: ["read", "write"] } : null;
if(input === 'consumer') 
  return input === "consumer" ? { role: "consumer", permissionList: ["read", "write"] } : null;
  return input === "vendor" ? { role: "vendor", permissionList: ["read", "write"] } : null;


  const logUserStatus = (user: UserType): void => {
    console.log(`User: ${user.userName}, Status: ${user.isActive ? "Active" : "Inactive"}`);
  };

// handleUserInfo
const logUserInfo = (userData: UserType): void => {
  console.log(`User: ${userData.userName}, Status: ${userData.isActive ? "Active" : "Inactive"}`);
};
  
  
  그럴 수 있는데
  사용하는 것을 전제로 두어야 합니다.
  그래서, 저희는 사용되는 함수를 보고, 코드를 까보지 않아도 되게끔 해야 하는데
  만약, logUserInfo라고 한 함수에서, loging이 뜨는데, username 과 status 밖에 안 뜨면,
  새로 투입된 사람은, 아 userInfo가 이름과 상태(activity)밖에 없나보다~ 할 수 있습니다.
  
  fit 하게 가져갈수록, 확장성을 열어 둘수록, 좋습니다.
  확장성은, 기존 함수뿐만이 아니라, 새로운 함수를 작성할 때도 포함이 될 수 있습니다. - ex) fit한 네이밍
  
  <button onClick={() => logUserStatus(user)}>status</button>
  <button onClick={() => logUserAge(user)}>age</button>
  
  
  그건 저희가 함수를 수정하는 거고. 이게 만들어진 함수이라는 거라고 보시면 됩니다.
  
  // const logUserInfo = (user: UserType): void => {
  //   console.log(`User: ${user.userName},  age, value, detail`);
  // };
  
  예시를 드는 이유가, 기존에 있던 함수는 기존의 함수 -> 이미 사용되는 부분들이 있음  - ex) 타인이 짠 코드 유지보수.
  그러나 다른 부분이 필요한 새로운 함수가 필요. 근데 비슷한 기능을 하는데 
  근데 추가로 userData의 일부가 필요해요. - 그럴 때 함수를 새로 작성할 텐데, 기존 네임과 충돌할 수도 있고.
  실제로 함수를 사용만 한다는 가정을 해야 해요. 우리가 함수를 보고 있는 게 아니라, 함수가 사용된 것에서 확인한다고 생각을 해야 합니다 - 적절한 추상화와 알맞은 네이밍

  // UserDetailData
interface UserType {
  userName: string; // username의 경우, 붙여 쓰는 경우도 있지만, customerName 등, 다른 이름과 일치하는 컨벤션을 추구.
  // fullName: string;
  // name이 하나인데 굳이 full을 사용할 이유가 없다고 생각. 오히려 어떤 이름인지 적는 게 낫다고 생각.
  age: number;
  isActive: boolean;
  // activeStatusFlag : boolean;

  value: string;
  detail: string;
  // detailsString: string;
  // 배열이 아니면, 단수형. - 배열이면 단수형 + List
  // => s로 끝나는 단어의 경우에 애매해짐.
  // 복수형에 s만 붙어 있을 경우, 못 보고 지나칠 경우 발생 가능.
}

const user: UserType = {
  userName: "메리디우스",
  age: 83,
  isActive: false,
  value: "글래디에이터",
  detail: "검투사",
};

// handleUserInfo
// logUserStatus
// logUserActive

// transformUserData
// 이게 뭐하는 용도일까? 복사? 이동?
// updateUserData()
// addTimestamp
// transformUserData
const updateUserData = (userData: Partial<UserType>): object => {
  return { transformedData: userData, timestamp: new Date() };
};
// 이거 보자 마자 감이 오는 게,

// patchUserData
// data는 어차피 parameter
// req body의 key일 뿐입니다.

// Product 관련 코드
interface ProductType {
  productName: string;
  productCost: number; // Cost: 생산적 비용, // Price: 판매가격
  isInStock: boolean;
  configData: Record<string, string>;
  productId: number | string;
  basePrice?: number;
}

const logProductInfo = (product: ProductType) => {
  console.log("Product producturation:", product);
};

// mapProductData
const formatProductCost = (product: ProductType): string => {
  return `Product: ${product.productName} - Cost: ${product.productCost}`;
};

// basePrice가 어디서 나온거지? 1.1은 어디서나온거지..
// calculatePricing
// calculateTotalPrice
// 매직넘버를 피하고, 상수를 사용하는.
const MARGIN_RATE = 1.1;

// calcMarginWithProductPrice
const calcMarginProductPrice = (product: ProductType): number => {
  if (!product.basePrice) {
    return 0;
  }

  return product.basePrice * MARGIN_RATE;
};





/* ****
*************
(월)부터 시작
******
*****************
*/

interface OrderType {
  orderId: string;
  totalAmount: number;
  isCompleted: boolean;
  misc: string;
  // orderDataArray: OrderType[]; 이게 왜 필요하지?
}

// processOrderItems
const logOrderList = (orderList: OrderType[]) => {
  orderList.forEach(order => console.log(`Processing order: ${order}`));
};

// verifyOrderCompletion
const isOrderComplete = (order: OrderType): boolean => {
  const hasOrder = order.totalAmount > 0;

  return order.isCompleted && hasOrder;
};

const logOrder = (order: OrderType): void => {
  console.log("Order Data:", order);
};

const UserProfileCard = ({ userProfile }: { userProfile: UserType }) => {
  return (
    <div className="userProfileCard">
      <h3>{userProfile.fullName}</h3>
      <p>{userProfile.activeStatusFlag ? "Active" : "Inactive"}</p>
      <span>Additional Info: {userProfile.value}</span>
    </div>
  );
};

const ProductInfo = ({ product }: { product: ProductType }) => {(
  <div className="productInfo">
    <h3>{product.productName}</h3>
    <p>Price: ${product.productCost}</p>
    <p>Config: {JSON.stringify(product.configData)}</p>
    <span>ID: {product.identifier}</span>
  </div>
)};

const OrderSummary = ({ orderData }: { orderData: OrderType }) => (
  <div className="orderSummary">
    <h3>Order ID: {orderData.orderId}</h3>
    <p>Total Amount: ${orderData.totalAmount}</p>
    <p>Status: {orderData.isCompleted ? "Completed" : "Pending"}</p>
    <span>Miscellaneous: {JSON.stringify(orderData.misc)}</span>
  </div>
);

// 컴포넌트는 항상 return을 쓴다.

const user =  {
  userName
  userType
}


array => object (가변)
object

- 객체, 배열 무조건 const
- user.userName = 할당 정상입니다. 원래 이렇게 씁니다.

참조하는 주소를 바꿀 수 있다. ( 가변 = 참조 타입 )

- const를 썼는데 값이 바뀌면 가변: 객체, 배열 (참조 타입)
- const를 썼는데 값이 안 바뀌면 불변: number, string, symbol, undefined, ()

CS의 기초. 자료구조.
cs50 

const a = 123;

const 에 집중하는 게 아닙니다.
'자료구조'
문자열, 넘버, 배열, 객체, 불리언 - 자료구조
자료구조가 가지는 불변성, 가변성

obj.a = 7을 하면,
obj.a = a3002의 메모리 주소를 가집니다.
'안 바뀌어서, 새로 메모리를 할당하는 거예요' - 불변성

그러나 obj는 여전히 a8001을 가지죠.
'바뀌니까, 메모리가 그대로입니다' - 가변성

그래서 가변인 겁니다. obj는

불변성 가변성이 아니에요!
// 다만, const를 이용해서, 불변성과 가변성을 체크할 수는 있습니다!
자료구조의 특성이어서,
const에서 변하냐 안 변하냐를 가지고 가변과 불변을 생각하실 수 있습니다.

const의 특성 - 메모리 주소를 변경할 수 없다.
let은 - 메모리 주소가 변경이 가능하다.


불변은 let으로 쓰죠. 값을 바꿔야 하는 경우면.


let a: string = {
  
}
const obj, arr = 주소값은 동일, 내부의 값이 변한다 - 가변
const a = 1
const a = 'apple'
원시타입 - 불변성이 있습니다.

const a = {
  b: 123
}
아뇨 원래 그렇게 쓰는 겁니다.
  
const a.b = 23 (o)
const a = {} (x)
interface UserType {

}