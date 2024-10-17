const BonusPoints = (bonusPoints) => {
  return /* HTML */ `
    <span id="loyalty-points" class="text-blue-500 ml-2"
    >(포인트: ${bonusPoints})</span>
    `.trim();
};

export default BonusPoints;
