import { memo } from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Page = ({ children }: LayoutProps) => {
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">{children}</div>
    </div>
  );
};

type TitleProps = {
  children: React.ReactNode;
};

const Title = ({ children }: TitleProps) => {
  return <h1 className="text-2xl font-bold mb-4">{children}</h1>;
};

const Layout = {
  Page: memo(Page),
  Title: memo(Title),
};

export default Layout;
