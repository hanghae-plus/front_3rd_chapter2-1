export class ProductManager { 
    constructor(products){
        this.products = [...products];
    }

    getProduct(id){
        return this.products.find(product => product.id === id);
    }

    updateProductQuantity(id,change){
        const product = this.getProduct(id);
        if(product) {
            product.quantity += change;
        }
    }
    // 깜짝 세일 기능 추가
    applyLightningSale(){
        const luckyItem = this.products[Math.floor(Math.random() * this.products.length)];
        if(Math.random() < 0.3 && luckyItem.quantity > 0){
            luckyItem.price = Math.round(luckyItem.price * 0.8);
            return luckyItem;
        }
        return null;
    }

    getSuggestion(lastSelectedId){
        return this.products.find(item => item.id !== lastSelectedId && item.quantity > 0);
    }



}