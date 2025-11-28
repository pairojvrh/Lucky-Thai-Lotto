import React, { useState } from 'react';
import { Sparkles, Brain, Loader2 } from 'lucide-react';
import { interpretDream } from '../services/geminiService';
import NumberBall from './NumberBall';
import { LuckyResult } from '../types';

interface DreamTabProps {
  onSaveResult: (result: LuckyResult) => void;
}

const DreamTab: React.FC<DreamTabProps> = ({ onSaveResult }) => {
  const [dreamInput, setDreamInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LuckyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInterpret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dreamInput.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const aiResponse = await interpretDream(dreamInput);
      
      const newResult: LuckyResult = {
        twoDigits: aiResponse.twoDigits,
        threeDigits: aiResponse.threeDigits,
        description: aiResponse.reason,
        source: 'ai',
        timestamp: Date.now()
      };

      setResult(newResult);
      onSaveResult(newResult);
    } catch (err) {
      setError("ขออภัย ไม่สามารถทำนายฝันได้ในขณะนี้ โปรดลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-4 animate-fade-in w-full max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-indigo-900 flex items-center justify-center gap-2">
            <Sparkles className="text-amber-500" />
            ทำนายเลขจากฝัน (AI)
        </h2>
        <p className="text-slate-500">พิมพ์ความฝัน หรือสิ่งที่เห็น แล้วให้ AI ช่วยตีเป็นเลขเด็ด</p>
      </div>

      <form onSubmit={handleInterpret} className="w-full space-y-4">
        <div className="relative">
          <textarea
            value={dreamInput}
            onChange={(e) => setDreamInput(e.target.value)}
            placeholder="ตัวอย่าง: ฝันเห็นพญานาคสีทอง ว่ายน้ำอยู่ในแม่น้ำโขง..."
            className="w-full p-4 h-32 rounded-2xl border border-slate-200 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-lg text-slate-700 placeholder:text-slate-300 transition-all bg-white"
            disabled={isLoading}
          />
          <Brain className="absolute bottom-4 right-4 text-slate-300 w-6 h-6" />
        </div>

        <button
          type="submit"
          disabled={isLoading || !dreamInput.trim()}
          className={`
            w-full py-4 rounded-xl text-lg font-bold text-white shadow-md transition-all flex items-center justify-center gap-2
            ${isLoading || !dreamInput.trim() 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-95'}
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              <span>กำลังทำนาย... (Gemini)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>ทำนายเลขเด็ด</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl w-full text-center border border-red-100">
          {error}
        </div>
      )}

      {result && (
        <div className="w-full mt-8 bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden animate-slide-up">
            <div className="bg-indigo-50 p-4 border-b border-indigo-100">
                <h3 className="font-semibold text-indigo-800 text-center">ผลคำทำนาย</h3>
            </div>
            
            <div className="p-6 space-y-6">
                <div className="text-center">
                    <p className="text-slate-600 italic mb-4">"{result.description}"</p>
                </div>

                <div className="space-y-4">
                    {result.threeDigits.length > 0 && (
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">เลข 3 ตัว</span>
                            <div className="flex flex-wrap justify-center gap-3">
                                {result.threeDigits.map((num, i) => (
                                    <NumberBall key={i} number={num} size="md" color="gold" />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="w-full h-px bg-slate-100"></div>

                    {result.twoDigits.length > 0 && (
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">เลข 2 ตัว</span>
                            <div className="flex flex-wrap justify-center gap-3">
                                {result.twoDigits.map((num, i) => (
                                    <NumberBall key={i} number={num} size="md" color="red" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default DreamTab;