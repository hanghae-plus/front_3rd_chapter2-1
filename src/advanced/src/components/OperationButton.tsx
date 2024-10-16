type Props = {
  children: React.ReactNode;
  value: number;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const OperationButton = ({ children, value, onClick }: Props) => {
  return (
    <button
      className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
      data-product-id="p1"
      data-change={value}
      onClick={onClick}
      value={value}
    >
      {children}
    </button>
  );
};

export default OperationButton;
