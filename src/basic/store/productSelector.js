const productSelector = (() => {
  let selectedId = null;

  return {
    set: (id) => {
      selectedId = id;
    },
    get: () => selectedId,
    clear: () => {
      selectedId = null;
    },
  };
})();

export default productSelector;
