'use client';

import { useState, useEffect } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      
      const difference = nextHour.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor(difference / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex space-x-4 text-center">
      <div className="bg-secondary rounded-lg p-4 min-w-[80px]">
        <div className="text-2xl font-bold text-primary">{timeLeft.hours.toString().padStart(2, '0')}</div>
        <div className="text-xs text-gray-400">Hours</div>
      </div>
      <div className="bg-secondary rounded-lg p-4 min-w-[80px]">
        <div className="text-2xl font-bold text-primary">{timeLeft.minutes.toString().padStart(2, '0')}</div>
        <div className="text-xs text-gray-400">Minutes</div>
      </div>
      <div className="bg-secondary rounded-lg p-4 min-w-[80px]">
        <div className="text-2xl font-bold text-primary">{timeLeft.seconds.toString().padStart(2, '0')}</div>
        <div className="text-xs text-gray-400">Seconds</div>
      </div>
    </div>
  );
} 