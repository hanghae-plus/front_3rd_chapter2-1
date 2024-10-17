interface RenderElementType {
  renderCart: JSX.Element;
  productSum: string;
  productSelectDropDown: JSX.Element;
  addCartBtn: JSX.Element;
  stockInfo: string;
  lastSelectedProductId: string;
  discountSpan: string;
  cartProductList: IProduct[];
  bonusPointsSpan: string;
  productList: IProduct[];
  setRenderCart: React.Dispatch<React.SetStateAction<JSX.Element>>;
  setProductSum: React.Dispatch<React.SetStateAction<string>>;
  setProductSelectDropDown: React.Dispatch<React.SetStateAction<JSX.Element>>;
  setAddCartBtn: React.Dispatch<React.SetStateAction<JSX.Element>>;
  setStockInfo: React.Dispatch<React.SetStateAction<string>>;
  setLastSelectedProductId: React.Dispatch<React.SetStateAction<string>>;
  setDiscountSpan: React.Dispatch<React.SetStateAction<string>>;
  setCartProductList: React.Dispatch<React.SetStateAction<IProduct[]>>;
  setBonusPointsSpan: React.Dispatch<React.SetStateAction<string>>;
  setProductList: React.Dispatch<React.SetStateAction<IProduct[]>>;
}

interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ICartProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ICartContextType {
  cartItems: ICartProduct[];
  addItemToCart: (item: ICartProduct) => void;
  removeItemFromCart: (itemId: string) => void;
}

export { RenderElementType, IProduct, ICartProduct, ICartContextType };
