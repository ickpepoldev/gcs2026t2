import { useState, useEffect, useRef } from 'react';

export const useTimer = (isActive: boolean) => {
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const reset = () => setTime(0);

  return { time, reset };
};

export const calculateScore = (stepsCompleted: number, timeInSeconds: number): number => {
  const basePoints = stepsCompleted * 100;
  const maxTimeBonus = 50;
  const timeBonus = Math.max(0, maxTimeBonus - Math.floor(timeInSeconds / 10));
  return basePoints + timeBonus;
};
