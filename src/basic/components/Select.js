export function Select({ wrap, prodList }) {
  const sel = document.createElement('select');
  sel.id = 'product-select';
  sel.className = 'border rounded p-2 mr-2';
  wrap.appendChild(sel);

  this.$element = sel;

  this.updateSelOpts = () => {
    sel.innerHTML = '';
    prodList.forEach(function (item) {
      const opt = document.createElement('option');
      opt.value = item.id;

      opt.textContent = item.name + ' - ' + item.val + '원';
      if (item.q === 0) opt.disabled = true;
      sel.appendChild(opt);
    });
  };

  this.updateSelOpts();
}
