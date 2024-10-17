interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
  }
  
  interface StockStatusProps {
    productList: Product[];
    stockStatus: HTMLElement;
  }
  
  export function updateProductStock(productList: Product[], stockStatus: HTMLElement) {
    let infoMsg = '';
    
    productList.forEach((product) => {
      if (product.stock < 5) {
        infoMsg += `${product.name}: ${product.stock > 0 ? `재고 부족 (${product.stock}개 남음)` : '품절'}\n`;
      }
    });
  
    stockStatus.textContent = infoMsg;
  }
  