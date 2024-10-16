const Container = (children) => {
  return `
      <div class="bg-gray-100 p-8">
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          ${children}
        <div>
      </div>
    `;
};

export default Container;
