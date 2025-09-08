import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate?: string;
  targetTime?: string;
  labels?: {
    days?: string;
    hours?: string;
    minutes?: string;
    seconds?: string;
  };
  style?: {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
  };
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = ({ 
  targetDate = "Mon Jul 29 2024", 
  targetTime = "05:09:31 PM",
  labels = {
    days: "Days",
    hours: "Hrs", 
    minutes: "Mins",
    seconds: "Secs"
  },
  style = {}
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const calculateTimeLeft = (): TimeLeft => {
    // Parse the target date and time
    const targetDateTime = new Date(`${targetDate} ${targetTime}`);
    const now = new Date();
    const difference = targetDateTime.getTime() - now.getTime();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    // Calculate initial time left
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      gap: "8px" 
    }}>
      {/* Timer display */}
      <div style={{ 
        display: "flex", 
        gap: "8px", 
        fontSize: `${(style.fontSize || 16) + 2}px`,
        fontWeight: style.fontWeight || "bold",
        color: style.color || "inherit"
      }}>
        <span>{formatNumber(timeLeft.days)} : {formatNumber(timeLeft.hours)} : {formatNumber(timeLeft.minutes)} : {formatNumber(timeLeft.seconds)}</span>
      </div>
      
      {/* Labels */}
      <div style={{
        display: "flex",
        gap: "20px",
        fontSize: `${Math.max(10, (style.fontSize || 16) - 4)}px`,
        opacity: 0.8,
        color: style.color || "inherit"
      }}>
        <span>{labels.days}</span>
        <span>{labels.hours}</span>
        <span>{labels.minutes}</span>
        <span>{labels.seconds}</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
