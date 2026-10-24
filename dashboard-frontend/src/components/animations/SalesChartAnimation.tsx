import React, { useState, useEffect } from "react";

const AnimatedDigit: React.FC<{ digit: string; delay: number }> = ({
  digit,
  delay,
}) => {
  const [currentDigit, setCurrentDigit] = useState("0");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!/[0-9]/.test(digit)) {
        setCurrentDigit(digit);
        return;
      }

      let current = 0;
      const target = parseInt(digit);
      const interval = setInterval(() => {
        if (current >= target) {
          setCurrentDigit(target.toString());
          clearInterval(interval);
        } else {
          current++;
          setCurrentDigit(current.toString());
        }
      }, 50);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [digit, delay]);

  return (
    <span className="inline-block min-w-[0.6em] text-center">
      {currentDigit}
    </span>
  );
};

const SalesChartAnimation: React.FC = () => {
  const [currentValue, setCurrentValue] = useState("29,924.95");
  const [barHeights, setBarHeights] = useState<number[]>(
    Array.from({ length: 15 }, () => Math.random() * 50 + 20)
  );

  // Gera um novo valor aleatório próximo ao atual
  const generateNewValue = (current: string) => {
    const numValue = parseFloat(current.replace(/,/g, ""));
    const variation = (Math.random() - 0.5) * 2000; // Varia ±1000
    const newValue = Math.max(20000, Math.min(40000, numValue + variation));
    return newValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Anima os números continuamente
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentValue((prev) => generateNewValue(prev));
    }, 3000); // Troca a cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  // Anima as barras
  useEffect(() => {
    const interval = setInterval(() => {
      setBarHeights((prev) =>
        prev.map((h) =>
          Math.max(15, Math.min(85, h + (Math.random() - 0.5) * 20))
        )
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full w-full justify-between px-12 pt-12">
      <div>
        <p className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
          Live Revenue
        </p>
        <div className="text-white text-4xl lg:text-5xl font-bold tracking-tighter flex items-baseline font-mono">
          <span className="text-purple-400 mr-1 opacity-70 text-3xl">$</span>
          {currentValue.split("").map((char, i) => (
            <AnimatedDigit
              key={`${char}-${i}-${currentValue}`}
              digit={char}
              delay={i * 30}
            />
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between h-40 gap-1.5 my-8">
        {barHeights.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-full bg-linear-to-t from-purple-600/10 to-purple-500 shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all duration-[1.5s] ease-in-out"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <div className="flex gap-4">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold">
              Growth
            </p>
            <p className="text-green-400 text-sm font-semibold">+42.5%</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold">
              Status
            </p>
            <p className="text-white text-sm font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChartAnimation;
