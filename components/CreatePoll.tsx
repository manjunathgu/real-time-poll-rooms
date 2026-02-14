
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Calendar, Send, Sparkles, LayoutGrid } from 'lucide-react';
import { api } from '../services/api';

const PollCreator: React.FC = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [expiryHours, setExpiryHours] = useState('24');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOption = () => {
    if (options.length < 10) setOptions([...options, '']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.filter(o => o.trim());
    if (!question.trim() || validOptions.length < 2) {
      alert("Validation Error: Please provide a query and at least two distinct options.");
      return;
    }

    setIsSubmitting(true);
    try {
      const hours = parseInt(expiryHours);
      const poll = await api.createPoll({
        question,
        options: validOptions.map((text, i) => ({
          id: `o-${Date.now()}-${i}`,
          text,
          votes: 0
        })),
        expiresAt: hours > 0 ? Date.now() + hours * 60 * 60 * 1000 : null,
        authorId: localStorage.getItem('pollstream_voter_token') || 'anon'
      });
      
      navigate(`/poll/${poll.id}`);
    } catch (err) {
      alert("Upstream Error: Could not broadcast poll room.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-14 text-center">
        <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
          Poll Room <span className="text-indigo-600">Architect</span>
        </h2>
        <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
          Define your query, set your parameters, and launch a real-time room for your audience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Query */}
        <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-focus-within:opacity-20 transition-opacity">
            <LayoutGrid className="w-24 h-24" />
          </div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">
            01. Primary Query
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            className="w-full px-0 py-2 text-3xl md:text-4xl font-black text-slate-900 placeholder:text-slate-200 border-none focus:ring-0 outline-none resize-none h-40 custom-scrollbar leading-tight"
            required
          />
        </div>

        {/* Step 2: Parameters */}
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">
              02. Option Sets
            </label>
            <div className="space-y-4">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const next = [...options];
                        next[index] = e.target.value;
                        setOptions(next);
                      }}
                      placeholder={`Choice ${index + 1}`}
                      className="w-full px-6 py-4 bg-slate-50 text-base font-bold text-slate-700 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all outline-none"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setOptions(options.filter((_, i) => i !== index))}
                    disabled={options.length <= 2}
                    className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl disabled:opacity-0 transition-all active:scale-90"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddOption}
                disabled={options.length >= 10}
                className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:border-indigo-200 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Slot
              </button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between h-fit">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">
                03. Duration
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  <select
                    value={expiryHours}
                    onChange={(e) => setExpiryHours(e.target.value)}
                    className="bg-transparent font-black text-slate-700 outline-none cursor-pointer text-sm"
                  >
                    <option value="1">1 Hour</option>
                    <option value="24">24 Hours</option>
                    <option value="168">7 Days</option>
                    <option value="0">Indefinite</option>
                  </select>
                </div>
                <p className="text-[10px] font-medium text-slate-400 px-2 leading-relaxed">
                  Polls are auto-locked after expiry to ensure data finality.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-10 bg-indigo-600 text-white font-black text-2xl rounded-[3rem] shadow-2xl shadow-indigo-100 flex flex-col items-center justify-center gap-3 transition-all hover:bg-indigo-700 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-8 h-8" />
                  <span>Launch Room</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PollCreator;
