interface OperationButtonProps {
  children: React.ReactNode;
  value: number;
}

const OperationButton = ({ children, value }: OperationButtonProps) => {
  return (
    <button
      className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
      data-product-id="p1"
      data-change={value}
    >
      {children}
    </button>
  );
};

export default OperationButton;
