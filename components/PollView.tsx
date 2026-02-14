
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Share2, CheckCircle2, Lock, Clock, ArrowLeft, BarChart3, Users, Copy, Trophy, QrCode } from 'lucide-react';
import { io } from 'socket.io-client';
import { api } from '../services/api';
import { Poll } from '../types';
import QRCode from 'qrcode';

const PollRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [showQR, setShowQR] = useState(false);
  const [lastUpdatedOption, setLastUpdatedOption] = useState<string | null>(null);

  const socketRef = useRef<any>(null);

  const voterToken = useMemo(() => {
    let token = localStorage.getItem('pollstream_voter_token');
    if (!token) {
      token = crypto.randomUUID();
      localStorage.setItem('pollstream_voter_token', token);
    }
    return token;
  }, []);

  useEffect(() => {
    if (!id) return;

    // Generate QR code for sharing
    QRCode.toDataURL(window.location.href, { margin: 1, width: 250 }, (err, url) => {
      if (!err) setQrUrl(url);
    });

    const fetchPoll = async () => {
      try {
        const p = await api.getPoll(id);
        setPoll(p);
        
        const votedPolls = JSON.parse(localStorage.getItem('pollstream_voted_list') || '[]');
        if (votedPolls.includes(id)) {
          setHasVoted(true);
        }

        const history = JSON.parse(localStorage.getItem('pollstream_history') || '[]');
        if (!history.find((h: any) => h.id === id)) {
          history.unshift({ id, question: p.question });
          localStorage.setItem('pollstream_history', JSON.stringify(history.slice(0, 10)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();

    // Socket Connection Logic
    socketRef.current = io('http://localhost:3001');
    socketRef.current.emit('join-room', id);

    socketRef.current.on('poll-updated', (updatedPoll: Poll) => {
      setPoll((prev) => {
        if (prev) {
          updatedPoll.options.forEach((opt, i) => {
            if (opt.votes !== prev.options[i].votes) {
              setLastUpdatedOption(opt.id);
              setTimeout(() => setLastUpdatedOption(null), 1000);
            }
          });
        }
        return updatedPoll;
      });
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [id]);

  const handleVote = async (optionId: string) => {
    if (hasVoted || !id || !poll) return;
    
    // Confetti effect - using global window object from script tag
    // @ts-ignore
    window.confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#3b82f6']
    });

    setVoting(optionId);
    try {
      const updated = await api.castVote(id, optionId, voterToken);
      setPoll(updated);
      
      const votedPolls = JSON.parse(localStorage.getItem('pollstream_voted_list') || '[]');
      votedPolls.push(id);
      localStorage.setItem('pollstream_voted_list', JSON.stringify(votedPolls));
      
      setHasVoted(true);
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setVoting(null);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const totalVotes = poll?.options.reduce((acc, curr) => acc + curr.votes, 0) || 0;
  const isExpired = poll?.expiresAt && Date.now() > poll.expiresAt;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-100 rounded-full" />
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0" />
      </div>
      <p className="text-slate-500 font-bold tracking-tighter">Syncing Room Metadata...</p>
    </div>
  );

  if (!poll) return (
    <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
      <h2 className="text-3xl font-black text-slate-900 mb-2">Room Unavailable</h2>
      <p className="text-slate-500 mb-8 max-w-sm mx-auto">This link has expired or the poll has been removed from the server.</p>
      <Link to="/" className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl">Return to Dashboard</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-32">
      {/* Dynamic Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-3 text-slate-500 hover:text-indigo-600 font-bold transition-all">
          <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:border-indigo-100 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span>Explorer</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowQR(!showQR)}
            className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-500 hover:text-indigo-600 transition-all hover:border-indigo-100"
          >
            <QrCode className="w-5 h-5" />
          </button>
          <button 
            onClick={handleShare}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all shadow-sm ${
              copySuccess 
                ? 'bg-emerald-500 text-white shadow-emerald-200' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {copySuccess ? <><CheckCircle2 className="w-4 h-4" /> Link Copied</> : <><Copy className="w-4 h-4" /> Copy Link</>}
          </button>
        </div>
      </div>

      {/* QR Code Modal Overlay */}
      {showQR && (
        <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black mb-6">Scan to Vote</h3>
            {qrUrl && <img src={qrUrl} alt="QR Code" className="w-64 h-64 mb-6 rounded-2xl shadow-sm border border-slate-100" />}
            <button 
              onClick={() => setShowQR(false)}
              className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Poll Card */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-indigo-100/40 overflow-hidden">
        <div className="p-10 md:p-14 border-b border-slate-50 bg-indigo-50/20">
          <div className="flex items-center gap-4 mb-6">
             {isExpired ? (
               <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                 <Lock className="w-3 h-3" /> Results Final
               </div>
             ) : (
               <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-100">
                 <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Live Now
               </div>
             )}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter">
            {poll.question}
          </h1>
        </div>

        <div className="p-10 md:p-14 space-y-4">
          {poll.options.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const isWinner = totalVotes > 0 && option.votes === Math.max(...poll.options.map(o => o.votes));
            const isUpdating = lastUpdatedOption === option.id;

            return (
              <div key={option.id} className="relative group">
                <button
                  onClick={() => handleVote(option.id)}
                  disabled={hasVoted || !!isExpired || !!voting}
                  className={`w-full text-left rounded-[1.75rem] transition-all relative overflow-hidden h-24 ${
                    hasVoted 
                      ? 'cursor-default ring-1 ring-slate-100 bg-white' 
                      : isExpired 
                        ? 'opacity-60 cursor-not-allowed bg-slate-50'
                        : 'border border-slate-200 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 bg-white'
                  }`}
                >
                  {/* The Progress Bar with "Bouncy" transition */}
                  {hasVoted && (
                    <div 
                      className={`absolute inset-y-0 left-0 z-0 transition-all duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                        isWinner ? 'bg-indigo-600/10' : 'bg-slate-50'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  )}

                  <div className="flex justify-between items-center h-full px-8 relative z-10">
                    <div className="flex items-center gap-4">
                       <span className={`text-xl font-bold transition-colors ${
                         hasVoted && isWinner ? 'text-indigo-700' : 'text-slate-700'
                       }`}>
                         {option.text}
                       </span>
                       {hasVoted && isWinner && <Trophy className="w-6 h-6 text-amber-400 drop-shadow-sm" />}
                    </div>

                    {hasVoted && (
                      <div className="text-right">
                        <div className={`text-3xl font-black tabular-nums tracking-tighter leading-none ${
                          isUpdating ? 'text-indigo-600 scale-110 transition-all' : 'text-slate-900'
                        }`}>
                          {Math.round(percentage)}%
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          {option.votes} Votes
                        </div>
                      </div>
                    )}

                    {!hasVoted && !isExpired && (
                      <div className="w-10 h-10 rounded-2xl border border-slate-100 group-hover:border-indigo-300 group-hover:bg-indigo-50 transition-all flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-transparent group-hover:text-indigo-500 transition-all" />
                      </div>
                    )}
                  </div>
                  
                  {voting === option.id && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
                      <div className="w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="px-10 py-8 bg-slate-50/40 border-t border-slate-100 flex flex-wrap gap-8 items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-600">{totalVotes} Total Participation</span>
            </div>
            <div className="hidden sm:flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-600">Engineered Integrity</span>
            </div>
          </div>
          
          {poll.expiresAt && !isExpired && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 lowercase">
              <Clock className="w-4 h-4" />
              <span>Ends in {Math.round((poll.expiresAt - Date.now()) / (1000 * 60 * 60))}h</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollRoom;
