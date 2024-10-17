import { IProductList } from '../models/Product'

export function initializeTimedEvents(
  products: IProductList[],
  updateProductStock: (id: string, change: number) => void,
) {
  startLightningSale(products, updateProductStock)
  startProductSuggestions(products, updateProductStock)
}

function startLightningSale(
  products: IProductList[],
  updateProductStock: (id: string, change: number) => void,
) {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = products[Math.floor(Math.random() * products.length)]
      if (Math.random() < 0.3 && luckyItem.stock > 0) {
        updateProductStock(luckyItem.id, 0)
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`)
      }
    }, 30000)
  }, Math.random() * 10000)
}

function startProductSuggestions(
  products: IProductList[],
  updateProductStock: (id: string, change: number) => void,
) {
  let lastSelected = null
  setTimeout(() => {
    setInterval(() => {
      if (lastSelected) {
        const suggestion = products.find(
          (item) => item.id !== lastSelected && item.stock > 0,
        )
        if (suggestion) {
          updateProductStock(suggestion.id, 0)
          alert(
            `${suggestion.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
          )
        }
      }
    }, 60000)
  }, Math.random() * 20000)
}
