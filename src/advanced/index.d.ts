type ItemType = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
};

type SelectPropsType = {
  productList: any[];
};

type IntervalContextType = {
  startLightningInterval: () => void;
  startSuggestionInterval: () => void;
  clearLightningInterval: () => void;
  clearSuggestionInterval: () => void;
};
