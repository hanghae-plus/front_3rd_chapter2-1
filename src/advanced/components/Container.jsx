import React from 'react';

const Container = ({ children }) => {
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        {children}
      </div>
    </div>
  );
};

export default Container;
