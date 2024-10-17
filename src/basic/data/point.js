let bonusPoints = 0;

export function increaseBonusPoints(totalPrice) {
  bonusPoints += Math.floor(totalPrice / 1000);
}

export function getBonusPoints() {
  return bonusPoints;
}
