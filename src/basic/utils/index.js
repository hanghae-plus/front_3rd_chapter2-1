const Utils = {
  calcDisc(item, quantity) {
    if (quantity < 10) return 0
    const discounts = {
      p1: 0.1,
      p2: 0.15,
      p3: 0.2,
      p4: 0.05,
      p5: 0.25,
    }
    return discounts[item.id] || 0
  },

  calcTotAmt(cart, products) {
    let subTot = 0
    let totAmt = 0
    let itemCnt = 0

    cart.forEach(({ id, quantity }) => {
      const item = products.find((p) => p.id === id)
      const itemTot = item.val * quantity
      const disc = this.calcDisc(item, quantity)

      subTot += itemTot
      totAmt += itemTot * (1 - disc)
      itemCnt += quantity
    })

    if (itemCnt >= 30) {
      const bulkDisc = totAmt * 0.25
      const itemDisc = subTot - totAmt
      if (bulkDisc > itemDisc) {
        totAmt = subTot * (1 - 0.25)
      }
    }
    const day = new Date().getDay()
    if (day === 5) {
      totAmt = subTot * 0.9
    }
    return Math.round(totAmt)
  },
}
