export function Sum({ wrap }) {
  const sum = document.createElement('div');
  sum.id = 'cart-total';
  sum.className = 'text-xl font-bold my-4';
  wrap.appendChild(sum);

  this.$element = sum;
}
