import { renderBonusPts } from './calcBonusPts'
import { updateStockInfo } from './updateStock'

export const calcCart = () => {
  let totalAmt = 0
  let itemCnt = 0
  const cartItems = cartDisp.children
  let subTot = 0

  Array.from(cartItems).forEach((cartItem) => {
    const curItem = prodList.find((prod) => prod.id === cartItem.id)
    if (!curItem) return

    const q = parseInt(
      cartItem.querySelector('span').textContent.split('x ')[1],
    )
    const itemTot = curItem.val * q

    let disc = 0
    if (q >= 10) {
      const discRates = { p1: 0.1, p2: 0.15, p3: 0.2, p4: 0.05, p5: 0.25 }
      disc = discRates[curItem.id] || 0
    }

    itemCnt += q
    subTot += itemTot
    totalAmt += itemTot * (1 - disc)
  })

  let discRate = 0
  if (itemCnt >= 30) {
    const bulkDisc = totalAmt * 0.25
    const itemDisc = subTot - totalAmt
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * 0.75
      discRate = 0.25
    } else {
      discRate = (subTot - totalAmt) / subTot
    }
  } else {
    discRate = (subTot - totalAmt) / subTot
  }

  if (new Date().getDay() === 2) {
    totalAmt *= 0.9
    discRate = Math.max(discRate, 0.1)
  }

  updateSumDisplay(totalAmt, discRate)
  updateStockInfo()
  renderBonusPts()
}

function updateSumDisplay(totalAmt, discRate) {
  sum.textContent = '총액: ' + Math.round(totalAmt) + '원'
  if (discRate > 0) {
    const span = document.createElement('span')
    span.className = 'text-green-500 ml-2'
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)'
    sum.appendChild(span)
  }
}
