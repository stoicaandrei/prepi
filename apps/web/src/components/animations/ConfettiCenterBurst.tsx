import { useWindowSize } from "@/hooks/useWindowSize";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

type Props = {
  onComplete?: () => void;
};

export const ConfettiCenterBurst = ({ onComplete }: Props) => {
  const { width, height } = useWindowSize();

  return (
    <Confetti
      width={width}
      height={height}
      confettiSource={{ x: width / 2, y: height * 0.2, w: 0, h: 0 }}
      recycle={false}
      initialVelocityX={15}
      numberOfPieces={50}
      gravity={0.3}
      onConfettiComplete={onComplete}
    />
  );
};
