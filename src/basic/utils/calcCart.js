// import { store } from "../store/cart";

// export function calcCart(totalAmt, itemCnt, bonusPts) {
//   totalAmt = 0;
//   itemCnt = 0;
//   const cartDisp = document.getElementById("cart-items");
//   const { products } = store.getState();
//   var cartItems = cartDisp.children;

//   var subTot = 0;
//   for (var i = 0; i < cartItems.length; i++) {
//     (function () {
//       var curItem;
//       for (var j = 0; j < products.length; j++) {
//         if (products[j].id === cartItems[i].id) {
//           curItem = products[j];
//           break;
//         }
//       }

//       var q = parseInt(cartItems[i].querySelector("span").textContent.split("x ")[1]);
//       var itemTot = curItem.val * q;
//       var disc = 0;
//       itemCnt += q;
//       subTot += itemTot;
//       if (q >= 10) {
//         if (curItem.id === "p1") disc = 0.1;
//         else if (curItem.id === "p2") disc = 0.15;
//         else if (curItem.id === "p3") disc = 0.2;
//         else if (curItem.id === "p4") disc = 0.05;
//         else if (curItem.id === "p5") disc = 0.25;
//       }
//       totalAmt += itemTot * (1 - disc);
//     })();
//   }
//   let discRate = 0;
//   if (itemCnt >= 30) {
//     var bulkDisc = totalAmt * 0.25;
//     var itemDisc = subTot - totalAmt;
//     if (bulkDisc > itemDisc) {
//       totalAmt = subTot * (1 - 0.25);
//       discRate = 0.25;
//     } else {
//       discRate = (subTot - totalAmt) / subTot;
//     }
//   } else {
//     discRate = (subTot - totalAmt) / subTot;
//   }

//   if (new Date().getDay() === 2) {
//     totalAmt *= 1 - 0.1;
//     discRate = Math.max(discRate, 0.1);
//   }
//   const sum = document.getElementById("cart-total");
//   sum.textContent = "총액: " + Math.round(totalAmt) + "원";
//   if (discRate > 0) {
//     var span = document.createElement("span");
//     span.className = "text-green-500 ml-2";
//     span.textContent = "(" + (discRate * 100).toFixed(1) + "% 할인 적용)";
//     sum.appendChild(span);
//   }
//   updateStockInfo();
//   renderBonusPts(totalAmt, bonusPts);
// }
// const renderBonusPts = (totalAmt, bonusPts) => {
//   bonusPts += Math.floor(totalAmt / 1000);
//   let ptsTag = document.getElementById("loyalty-points");
//   const sum = document.getElementById("cart-total");
//   if (!ptsTag) {
//     ptsTag = document.createElement("span");
//     ptsTag.id = "loyalty-points";
//     ptsTag.className = "text-blue-500 ml-2";
//     sum.appendChild(ptsTag);
//   }
//   ptsTag.textContent = "(포인트: " + bonusPts + ")";
// };

// function updateStockInfo() {
//   var infoMsg = "";
//   const { products } = store.getState();
//   products.forEach(function (item) {
//     if (item.q < 5) {
//       infoMsg +=
//         item.name + ": " + (item.q > 0 ? "재고 부족 (" + item.q + "개 남음)" : "품절") + "\n";
//     }
//   });
//   const stockInfo = document.getElementById("stock-status");
//   stockInfo.textContent = infoMsg;
// }
