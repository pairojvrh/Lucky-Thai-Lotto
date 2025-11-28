import React, { useState, useCallback, useEffect } from 'react';
import { Dices, RefreshCw } from 'lucide-react';
import NumberBall from './NumberBall';
import { LuckyResult } from '../types';

interface RandomTabProps {
  onSaveResult: (result: LuckyResult) => void;
}

const RandomTab: React.FC<RandomTabProps> = ({ onSaveResult }) => {
  const [current2, setCurrent2] = useState<string>('00');
  const [current3, setCurrent3] = useState<string>('000');
  const [isRolling, setIsRolling] = useState(false);

  // Helper to generate random string of digits
  const getRandomDigits = (length: number) => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };

  const handleRoll = useCallback(() => {
    if (isRolling) return;
    setIsRolling(true);

    const duration = 1500; // ms
    const intervalTime = 50;
    const startTime = Date.now();

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      setCurrent2(getRandomDigits(2));
      setCurrent3(getRandomDigits(3));

      if (elapsed >= duration) {
        clearInterval(intervalId);
        // Finalize numbers
        const final2 = getRandomDigits(2);
        const final3 = getRandomDigits(3);
        setCurrent2(final2);
        setCurrent3(final3);
        setIsRolling(false);

        onSaveResult({
          twoDigits: [final2],
          threeDigits: [final3],
          source: 'random',
          timestamp: Date.now()
        });
      }
    }, intervalTime);
  }, [isRolling, onSaveResult]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">สุ่มเลขนำโชค</h2>
        <p className="text-slate-500">กดปุ่มด้านล่างเพื่อสุ่มเลข 2 ตัว และ 3 ตัว</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
        {/* 3 Digits Section */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center w-full max-w-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-red-500"></div>
            <span className="text-slate-400 font-semibold mb-4 uppercase tracking-wider text-sm">รางวัล 3 ตัว</span>
            <div className="flex gap-2">
               {current3.split('').map((digit, i) => (
                 <NumberBall key={`3d-${i}`} number={digit} size="lg" color="gold" />
               ))}
            </div>
        </div>

        {/* 2 Digits Section */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center w-full max-w-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <span className="text-slate-400 font-semibold mb-4 uppercase tracking-wider text-sm">รางวัล 2 ตัว</span>
            <div className="flex gap-2">
              {current2.split('').map((digit, i) => (
                 <NumberBall key={`2d-${i}`} number={digit} size="lg" color="red" />
               ))}
            </div>
        </div>
      </div>

      <button
        onClick={handleRoll}
        disabled={isRolling}
        className={`
          group relative flex items-center gap-3 px-8 py-4 rounded-full text-xl font-bold text-white shadow-lg transition-all
          ${isRolling ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-red-500/30 hover:-translate-y-1 active:scale-95'}
        `}
      >
        <Dices className={`w-6 h-6 ${isRolling ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
        <span>{isRolling ? 'กำลังหมุน...' : 'สุ่มเลขเลย!'}</span>
      </button>
    </div>
  );
};

export default RandomTab;