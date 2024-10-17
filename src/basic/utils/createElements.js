const NULL_TITLE = '';
export const createTitle = (text) => {
  const h1 = document.createElement('h1');
  h1.className = 'text-2xl font-bold mb-4';
  h1.textContent = text || NULL_TITLE;

  return h1;
};

const NULL_DIV_PROPS = { id: '', className: '' };
export const createDiv = (props) => {
  const { id, className } = props || (props = NULL_DIV_PROPS);
  const div = document.createElement('div');
  if (id) div.id = id;
  if (className) div.className = className;

  return div;
};

const NULL_SELECT_PROPS = { id: '', className: '' };
export const createSelect = (props) => {
  const { id, className } = props || (props = NULL_SELECT_PROPS);
  const select = document.createElement('select');
  if (id) select.id = id;
  if (className) select.className = className;

  return select;
};

const NULL_OPTION_PROPS = { val: '', text: '', disabled: false };
export const createOption = (props) => {
  const { val, text, disabled } = props || (props = NULL_OPTION_PROPS);
  const opt = document.createElement('option');
  if (val) opt.value = val;
  if (text) opt.textContent = text;
  if (disabled) opt.disabled = disabled;

  return opt;
};

const NULL_BUTTON_PROPS = { id: '', className: '', text: '' };
export const createBtn = (props) => {
  const { id, className, text } = props || (props = NULL_BUTTON_PROPS);
  const button = document.createElement('button');
  if (id) button.id = id;
  if (className) button.className = className;
  else button.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  if (text) button.textContent = text;

  return button;
};

const NULL_QUANTITY_CHANGE_PROPS = { id: '', text: '', changeValue: '' };
export const createQuantityChangeBtn = (props) => {
  const { id, text, changeValue } =
    props || (props = NULL_QUANTITY_CHANGE_PROPS);
  const button = createBtn({
    className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
    text,
  });
  button.dataset.productId = id;
  button.dataset.change = changeValue;

  return button;
};

const NULL_REMOVE_PROPS = { id: '', text: '' };
export const createRemoveBtn = (props) => {
  const { id, text } = props || (props = NULL_REMOVE_PROPS);
  const button = createBtn({
    className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
    text,
  });
  button.dataset.productId = id;

  return button;
};

const NULL_SPAN_PROPS = { id: '', className: '', text: '' };
export const createSpan = (props) => {
  const { id, className, text } = props || (props = NULL_SPAN_PROPS);
  const span = document.createElement('span');
  if (id) span.id = id;
  if (className) span.className = className;
  if (text) span.textContent = text;

  return span;
};
