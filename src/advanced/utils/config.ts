export const formatNumber = (price: string | number) => {
  const numberPrice = typeof price === 'string' ? parseFloat(price) : price
  return numberPrice.toLocaleString()
}
