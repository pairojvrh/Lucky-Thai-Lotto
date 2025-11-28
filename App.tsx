import React, { useState } from 'react';
import { Clover, Dices, Sparkles, History, Menu } from 'lucide-react';
import RandomTab from './components/RandomTab';
import DreamTab from './components/DreamTab';
import NumberBall from './components/NumberBall';
import { LuckyResult, AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.RANDOM);
  const [history, setHistory] = useState<LuckyResult[]>([]);
  const [showMobileHistory, setShowMobileHistory] = useState(false);

  const handleSaveResult = (newResult: LuckyResult) => {
    setHistory(prev => [newResult, ...prev]);
  };

  const NavButton: React.FC<{ tab: AppTab; icon: React.ReactNode; label: string }> = ({ tab, icon, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`
        flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200
        ${activeTab === tab 
          ? 'bg-amber-100 text-amber-700 shadow-sm font-semibold ring-1 ring-amber-200' 
          : 'text-slate-500 hover:bg-slate-100'}
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row max-w-7xl mx-auto">
      
      {/* Sidebar (Desktop) / Drawer (Mobile) - History */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-80 bg-white border-l border-slate-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-80 md:block
        ${showMobileHistory ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}
      `}>
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <History className="text-amber-500" />
                    ประวัติเลขที่ออก
                </h3>
                <button 
                  onClick={() => setShowMobileHistory(false)}
                  className="md:hidden p-2 text-slate-400 hover:text-slate-600"
                >
                    ✕
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {history.length === 0 ? (
                    <div className="text-center text-slate-400 py-10">
                        ยังไม่มีประวัติ
                        <br/>
                        <span className="text-sm">สุ่มเลขเลย!</span>
                    </div>
                ) : (
                    history.map((item, idx) => (
                        <div key={`${item.timestamp}-${idx}`} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.source === 'ai' ? 'bg-indigo-100 text-indigo-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.source === 'ai' ? 'AI ทำนาย' : 'สุ่มปกติ'}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {new Date(item.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            {item.description && (
                                <p className="text-sm text-slate-600 mb-3 italic line-clamp-2">"{item.description}"</p>
                            )}
                            <div className="flex gap-2 justify-between">
                                <div className="flex gap-1 items-center">
                                    <span className="text-xs text-slate-400 font-mono mr-1">3ตัว:</span>
                                    {item.threeDigits.map((n, i) => (
                                        <span key={i} className="font-bold text-amber-600 text-lg">{n}</span>
                                    ))}
                                </div>
                                <div className="flex gap-1 items-center">
                                    <span className="text-xs text-slate-400 font-mono mr-1">2ตัว:</span>
                                    {item.twoDigits.map((n, i) => (
                                         <span key={i} className="font-bold text-red-600 text-lg">{n}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </aside>
      
      {/* Overlay for mobile drawer */}
      {showMobileHistory && (
        <div 
            className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setShowMobileHistory(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30">
            <div className="max-w-2xl mx-auto md:max-w-none flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                        <Clover size={24} />
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                        Lucky Thai Lotto
                    </h1>
                </div>
                <button 
                    onClick={() => setShowMobileHistory(true)}
                    className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                    <History />
                </button>
            </div>
        </header>

        {/* Tab Navigation */}
        <div className="px-6 pt-6 pb-2">
            <div className="max-w-2xl mx-auto bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex gap-1">
                <NavButton tab={AppTab.RANDOM} icon={<Dices size={20} />} label="สุ่มตัวเลข" />
                <NavButton tab={AppTab.DREAM} icon={<Sparkles size={20} />} label="ทำนายฝัน AI" />
            </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 px-4 pb-10 overflow-y-auto">
             <div className="max-w-3xl mx-auto h-full">
                {activeTab === AppTab.RANDOM ? (
                    <RandomTab onSaveResult={handleSaveResult} />
                ) : (
                    <DreamTab onSaveResult={handleSaveResult} />
                )}
             </div>
        </div>
      </main>

    </div>
  );
};

export default App;