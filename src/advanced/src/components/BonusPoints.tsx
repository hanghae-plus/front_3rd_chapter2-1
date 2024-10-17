import React from "react";

interface BonusPointsProps {
  points: number;
}

const BonusPoints: React.FC<BonusPointsProps> = ({ points }) => {
  return <span className="text-blue-500 ml-2">(포인트: {points})</span>;
};

export default BonusPoints;
