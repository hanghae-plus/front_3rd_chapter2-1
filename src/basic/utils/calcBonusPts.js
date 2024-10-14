export const renderBonusPts = () => {
  bonusPts += Math.floor(totalAmt / 1000)
  var ptsTag = document.getElementById('loyalty-points')
  if (!ptsTag) {
    ptsTag = document.createElement('span')
    ptsTag.id = 'loyalty-points'
    ptsTag.className = 'text-blue-500 ml-2'
    sum.appendChild(ptsTag)
  }
  ptsTag.textContent = '(포인트: ' + bonusPts + ')'
}
