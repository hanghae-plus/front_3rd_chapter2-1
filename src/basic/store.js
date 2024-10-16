export let bonusPoints = 0;
export let lastAddedItem;

export function setBonusPoints(point) {
  bonusPoints += point;
}

export function setLastAddedItem(item) {
  lastAddedItem = item;
}
