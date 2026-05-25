'use client';

import { useEffect, useState } from 'react';

interface Props {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculate(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CountdownTimer({ targetDate }: Props) {
  const [time, setTime] = useState<TimeLeft>(calculate(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTime(calculate(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: 'Μέρες', value: time.days },
    { label: 'Ώρες', value: time.hours },
    { label: 'Λεπτά', value: time.minutes },
    { label: 'Δευτερόλεπτα', value: time.seconds },
  ];

  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {units.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-4 min-w-[80px] border border-white/30"
        >
          <span className="font-serif text-4xl font-bold text-white tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-white/80 text-xs mt-1 tracking-widest uppercase">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
