
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Plus, BarChart2, Github, History, ArrowRight, Zap, Globe, ShieldCheck } from 'lucide-react';
import PollCreator from './components/CreatePoll';
import PollRoom from './components/PollView';
import SubmissionNotes from './components/SubmissionNotes';

const Home: React.FC = () => {
  const [history, setHistory] = useState<{id: string, question: string}[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('pollstream_history') || '[]');
    setHistory(saved.slice(0, 4));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-50/50 rounded-full blur-3xl -z-10 opacity-60" />
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100/50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-indigo-200 shadow-sm shadow-indigo-100">
          <Zap className="w-3.5 h-3.5" /> Next-Gen Polling
        </div>
        <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight mb-6">
          Decision Making <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Reimagined.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed">
          The most fluid real-time polling platform for technical teams, creators, and decision-makers. Fast, secure, and purely frictionless.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link 
            to="/create" 
            className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Launch New Room
          </Link>
          <a href="#history" className="px-8 py-4 bg-white text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">
            View History
          </a>
        </div>
      </section>

      {/* Bento Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="history">
        {/* History Panel */}
        <div className="md:col-span-2 glass-panel p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <History className="w-6 h-6 text-indigo-500" />
              Pulse History
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last 4 Sessions</span>
          </div>
          
          {history.length > 0 ? (
            <div className="grid gap-4">
              {history.map((poll) => (
                <Link 
                  key={poll.id} 
                  to={`/poll/${poll.id}`}
                  className="group flex items-center justify-between p-5 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-indigo-50/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-indigo-200 shadow-sm transition-all">
                      <BarChart2 className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-indigo-900 transition-colors line-clamp-1">{poll.question}</h3>
                      <p className="text-xs text-slate-400 font-medium tracking-tight">Room ID: {poll.id}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                <Plus className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-slate-400 font-medium">No recent activity found on this device.</p>
            </div>
          )}
        </div>

        {/* Feature Stats Panel */}
        <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 text-white flex flex-col justify-between overflow-hidden relative">
          <Globe className="absolute -right-12 -bottom-12 w-48 h-48 opacity-10" />
          <div>
            <div className="p-3 bg-white/10 rounded-xl w-fit mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black mb-2 tracking-tight">Active Protection</h3>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed">
              Every room is protected by our session-based anti-abuse engine and automated expiry logic.
            </p>
          </div>
          <div className="mt-12">
            <div className="text-3xl font-black tracking-tighter">100%</div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Real-time sync uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen">
        <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md border-slate-100">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 rotate-3 group hover:rotate-0 transition-transform">
                <BarChart2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-2xl text-slate-900 tracking-tighter">PollStream</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Explorer</Link>
              <Link to="/notes" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Docs</Link>
              <Link to="/create" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-100 active:scale-95">
                New Room
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<PollCreator />} />
            <Route path="/poll/:id" element={<PollRoom />} />
            <Route path="/notes" element={<SubmissionNotes />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
