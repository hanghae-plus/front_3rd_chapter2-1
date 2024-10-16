let pointSystem = 0;

export function renderPointSystem(totalPrice, cartTotal) {
    pointSystem += Math.floor(totalPrice / 1000);
    let ptsTag = document.getElementById('loyalty-points');
    
    if (!ptsTag) {
      ptsTag = document.createElement('span');
      ptsTag.id = 'loyalty-points';
      ptsTag.className = 'text-blue-500 ml-2';
      cartTotal.appendChild(ptsTag);
    }
  
    ptsTag.textContent = `(포인트: ${pointSystem})`;
  }