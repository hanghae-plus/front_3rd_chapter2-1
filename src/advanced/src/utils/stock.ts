export function remainingStock<T extends { id: string; q: number }>(
  itemId: string,
  quantity: number,
  compareOptions: T[],
) {
  const originalItem = compareOptions.find((option) => option.id === itemId);
  if (!originalItem) return 0;
  const stock = originalItem.q - quantity;
  return stock;
}
