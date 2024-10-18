import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <section className="bg-gray-100 p-8">
      <section className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        {children}
      </section>
    </section>
  );
};

export default DefaultLayout;
