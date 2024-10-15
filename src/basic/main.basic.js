import { AMOUNT_PER_LOYALTY_POINT, BULK_DISCOUNT_MINIMUM_ITEM_COUNT, BULK_DISCOUNT_RATE, FLASH_SALE_INTERVAL, LOW_STOCK_THRESHOLD, PRODUCT_SUGGESTION_INTERVAL, TUESDAY_DISCOUNT_RATE } from "./constants";
import { ADD_CART_BUTTON_TEXT, CART_TITLE_TEXT } from "./constants/testContent";

let productInventory, productDropdown, addCartButton, cartItemsContainer, cartTotalAmountContainer, productStockStatus;

let lastSelectedProductId,
    bonusPoint = 0,
    cartTotalAmount = 0,
    cartItemCount = 0;

function main() {
    productInventory = [
        { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
        { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
        { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
        { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
        { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
    ];

    let root = document.getElementById('app');
    let componentContainer = document.createElement('div');
    let cartSection = document.createElement('div');
    let cartTitle = document.createElement('h1');

    cartItemsContainer = document.createElement('div');
    cartTotalAmountContainer = document.createElement('div');
    productDropdown = document.createElement('select');
    addCartButton = document.createElement('button');
    productStockStatus = document.createElement('div');

    cartItemsContainer.id = 'cart-items';
    cartTotalAmountContainer.id = 'cart-total';
    productDropdown.id = 'product-select';
    addCartButton.id = 'add-to-cart';
    productStockStatus.id = 'stock-status';

    componentContainer.className = 'bg-gray-100 p-8';
    cartSection.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
    cartTitle.className = 'text-2xl font-bold mb-4';
    cartTotalAmountContainer.className = 'text-xl font-bold my-4';
    productDropdown.className = 'border rounded p-2 mr-2';
    addCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
    productStockStatus.className = 'text-sm text-gray-500 mt-2';

    cartTitle.textContent = CART_TITLE_TEXT
    addCartButton.textContent = ADD_CART_BUTTON_TEXT

    updateProductOptions();

    cartSection.appendChild(cartTitle);
    cartSection.appendChild(cartItemsContainer);
    cartSection.appendChild(cartTotalAmountContainer);
    cartSection.appendChild(productDropdown);
    cartSection.appendChild(addCartButton);
    cartSection.appendChild(productStockStatus);
    componentContainer.appendChild(cartSection);
    root.appendChild(componentContainer);
    updateCartTotalAndApplyDiscounts();

    setTimeout(function () {
        setInterval(function () {
            const luckyItem = productInventory[Math.floor(Math.random() * productInventory.length)];
            if (Math.random() < 0.3 && luckyItem.quantity > 0) {
                luckyItem.price = Math.round(luckyItem.price * 0.8);
                console.log(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
                updateProductOptions();
            }
        }, 30000);
    }, Math.random() * FLASH_SALE_INTERVAL);

    setTimeout(function () {
        setInterval(function () {
            if (lastSelectedProductId) {
                const suggest = productInventory.find(function (item) {
                    return item.id !== lastSelectedProductId && item.quantity > 0;
                });
                if (suggest) {
                    console.log(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
                    suggest.price = Math.round(suggest.price * 0.95);
                    updateProductOptions();
                }
            }
        }, 60000);
    }, Math.random() * PRODUCT_SUGGESTION_INTERVAL);
}

function updateProductOptions() {
    productDropdown.innerHTML = '';
    productInventory.forEach(function (item) {
        const opt = document.createElement('option');
        opt.value = item.id;

        opt.textContent = `${item.name} - ${item.price}원`;
        if (item.quantity === 0) opt.disabled = true;
        productDropdown.appendChild(opt);
    });
}

function updateCartTotalAndApplyDiscounts() {
    cartTotalAmount = 0;
    cartItemCount = 0;
    const cartItems = cartItemsContainer.children;
    console.log(`cartItems: ${cartItems}`);
    console.log(cartItems);
    let subTot = 0;

    for (let i = 0; i < cartItems.length; i++) {
        (function () {
            let curItem;

            for (let j = 0; j < productInventory.length; j++) {
                if (productInventory[j].id === cartItems[i].id) {
                    curItem = productInventory[j];
                    break;
                }
            }

            const quantity = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
            const itemTot = curItem.price * quantity;
            let disc = 0;

            cartItemCount += quantity;
            subTot += itemTot;

            if (quantity >= 10) {
                if (curItem.id === 'p1') disc = 0.1;
                else if (curItem.id === 'p2') disc = 0.15;
                else if (curItem.id === 'p3') disc = 0.2;
                else if (curItem.id === 'p4') disc = 0.05;
                else if (curItem.id === 'p5') disc = 0.25;
            }
            cartTotalAmount += itemTot * (1 - disc);
        })();
    }

    let discRate = 0;

    if (cartItemCount >= BULK_DISCOUNT_MINIMUM_ITEM_COUNT) {
        const bulkDisc = cartTotalAmount * BULK_DISCOUNT_RATE;
        const itemDisc = subTot - cartTotalAmount;

        if (bulkDisc > itemDisc) {
            cartTotalAmount = subTot * (1 - BULK_DISCOUNT_RATE);
            discRate = BULK_DISCOUNT_RATE;
        } else {
            discRate = (subTot - cartTotalAmount) / subTot;
        }
    } else {
        discRate = (subTot - cartTotalAmount) / subTot;
    }

    if (new Date().getDay() === 2) {
        cartTotalAmount *= 1 - TUESDAY_DISCOUNT_RATE;
        discRate = Math.max(discRate, TUESDAY_DISCOUNT_RATE);
    }

    cartTotalAmountContainer.textContent = `총액: ${Math.round(cartTotalAmount)}원`;

    if (discRate > 0) {
        const span = document.createElement('span');
        span.className = 'text-green-500 ml-2';
        span.textContent = `(${(discRate * 100).toFixed(1)}% 할인 적용)`;
        cartTotalAmountContainer.appendChild(span);
    }

    displayStockShortage();
    updateAndDisplayLoyaltyPoints();
}

const updateAndDisplayLoyaltyPoints = () => {
    bonusPoint += Math.floor(cartTotalAmount / AMOUNT_PER_LOYALTY_POINT);

    console.log(`bonusPoint: ${bonusPoint}`);

    let ptsTag = document.getElementById('loyalty-points');

    if (!ptsTag) {
        ptsTag = document.createElement('span');
        ptsTag.id = 'loyalty-points';
        ptsTag.className = 'text-blue-500 ml-2';
        cartTotalAmountContainer.appendChild(ptsTag);
    }

    ptsTag.textContent = `(포인트: ${bonusPoint})`;
};

function displayStockShortage() {
    let infoMsg = '';

    productInventory.forEach(function (item) {
        if (item.quantity < LOW_STOCK_THRESHOLD) {
            infoMsg += `${item.name}: ${item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : '품절'}\n`;
        }
    });

    productStockStatus.textContent = infoMsg;
}

main();

addCartButton.addEventListener('click', function () {
    const selItem = productDropdown.value;
    const itemToAdd = productInventory.find(function (p) {
        return p.id === selItem;
    });

    if (itemToAdd && itemToAdd.quantity > 0) {
        const item = document.getElementById(itemToAdd.id);
        if (item) {
            const newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
            if (newQty <= itemToAdd.quantity) {
                item.querySelector('span').textContent = itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
                itemToAdd.quantity--;
            } else {
                alert('재고가 부족합니다.');
            }
        } else {
            const newItem = document.createElement('div');
            newItem.id = itemToAdd.id;
            newItem.className = 'flex justify-between items-center mb-2';
            newItem.innerHTML = `
                <span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span>
                <div>
                    <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
                    <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
                    <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
                </div>`;
            cartItemsContainer.appendChild(newItem);
            itemToAdd.quantity--;
        }

        updateCartTotalAndApplyDiscounts();
        lastSelectedProductId = selItem;
    }
});

cartItemsContainer.addEventListener('click', function (event) {
    const tgt = event.target;

    if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
        const prodId = tgt.dataset.productId;
        const itemElem = document.getElementById(prodId);
        const prod = productInventory.find(function (p) {
            return p.id === prodId;
        });

        if (tgt.classList.contains('quantity-change')) {
            const qtyChange = parseInt(tgt.dataset.change);
            const newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;

            console.log(`newQty: ${newQty}`);

            if (newQty > 0 && newQty <= prod.quantity + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])) {
                itemElem.querySelector('span').textContent = `${itemElem.querySelector('span').textContent.split('x ')[0]}x ${newQty}`;
                prod.quantity -= qtyChange;
            } else if (newQty <= 0) {
                itemElem.remove();
                prod.quantity -= qtyChange;
            } else {
                alert('재고가 부족합니다.');
            }
        } else if (tgt.classList.contains('remove-item')) {
            const remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
            prod.quantity += remQty;
            itemElem.remove();
        }

        updateCartTotalAndApplyDiscounts();
    }
});
