export interface IStockSummaryProps {
  message: string;
}

export const StockSummary = ({ message }: IStockSummaryProps) => {
  return <div className="text-sm text-gray-500 mt-2">{message}</div>;
};
