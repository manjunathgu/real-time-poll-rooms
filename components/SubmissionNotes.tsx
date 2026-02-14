
import React from 'react';
import { Shield, AlertTriangle, Cpu, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubmissionNotes: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to App
      </Link>
      
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Technical Submission Notes</h1>

      <div className="space-y-8">
        {/* Fairness Mechanisms */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Fairness Mechanisms</h2>
          </div>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <div>
              <h3 className="font-bold text-slate-700">1. Poll Expiration Logic</h3>
              <p>Every poll is created with a mandatory (though optionally infinite) <code>expiresAt</code> timestamp. The system performs a server-side (simulated) check before accepting any vote. Once the current time exceeds the expiry, all voting buttons are locked, preventing last-minute "raiding" or outdated data collection.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-700">2. Session-based Token Tracking</h3>
              <p>Upon the first visit, a unique <code>voter_token</code> is generated and stored in the user's browser. When a vote is cast, the Poll ID is recorded in a persistent <code>voted_list</code>. The UI checks this list before rendering, ensuring a "One Vote Per Session" rule is enforced even if the user closes the tab.</p>
            </div>
          </div>
        </section>

        {/* Edge Cases */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Edge Cases Handled</h2>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li><strong>Concurrent Access:</strong> The real-time subscription model ensures that if two users have the same poll open, the progress bars update for both the moment a vote is cast elsewhere.</li>
            <li><strong>Invalid IDs:</strong> Manual navigation to a non-existent Poll ID triggers a "Poll Not Found" graceful error state rather than a crash.</li>
            <li><strong>Empty State:</strong> Handled zero-vote scenarios to avoid "Division by Zero" errors in the percentage calculation.</li>
            <li><strong>Incomplete Forms:</strong> Robust validation on the creation form prevents polls with empty questions or insufficient options.</li>
          </ul>
        </section>

        {/* Limitations */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Known Limitations</h2>
          </div>
          <div className="space-y-4 text-slate-600">
            <p><strong>Persistence Scope:</strong> Since this is a browser-based technical demonstration, data is persisted in <code>LocalStorage</code>. In a production environment, this would be replaced with a MongoDB instance via a Node.js REST API.</p>
            <p><strong>Security:</strong> Session-based tracking can be circumvented by clearing browser data. A production-grade anti-abuse system would combine this with IP-based rate limiting on the backend.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SubmissionNotes;
