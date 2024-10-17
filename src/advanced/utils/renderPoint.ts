let point = 0;

export function renderPoint(totalPrice: number, cartTotal: HTMLElement): void {
  let ptsTag = document.getElementById('loyalty-points') as HTMLSpanElement | null;
  point += Math.floor(totalPrice / 1000);

  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    cartTotal.appendChild(ptsTag);
  }

  ptsTag.textContent = `(포인트: ${point})`;
}