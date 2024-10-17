let point = 0;

export function renderPoint(totalPrice, cartTotal) {
  let ptsTag = document.getElementById('loyalty-points');
  point += Math.floor(totalPrice / 1000);
  
  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    cartTotal.appendChild(ptsTag);
  }
  
  ptsTag.textContent = `(포인트: ${point})`;
  
  }