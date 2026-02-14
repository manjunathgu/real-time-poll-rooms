
import { Poll, PollOption } from '../types';

/**
 * Real-time Poll Room Architecture - Step 1
 * This service simulates our Node/Express/MongoDB backend.
 * 
 * I'm using an EventEmitter-like pattern to simulate Socket.IO functionality
 * within the frontend for this assignment stage.
 */

type PollUpdateListener = (poll: Poll) => void;

class MockDB {
  private listeners: Set<PollUpdateListener> = new Set();

  constructor() {
    // Initialize storage if empty
    if (!localStorage.getItem('pollstream_polls')) {
      localStorage.setItem('pollstream_polls', JSON.stringify([]));
    }
  }

  // Real-time "Socket" subscription
  subscribe(callback: PollUpdateListener) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private broadcast(poll: Poll) {
    this.listeners.forEach(l => l(poll));
  }

  async getPolls(): Promise<Poll[]> {
    const data = localStorage.getItem('pollstream_polls');
    return data ? JSON.parse(data) : [];
  }

  async findPollById(id: string): Promise<Poll | null> {
    const polls = await this.getPolls();
    return polls.find(p => p.id === id) || null;
  }

  async savePoll(poll: Poll): Promise<Poll> {
    const polls = await this.getPolls();
    polls.push(poll);
    localStorage.setItem('pollstream_polls', JSON.stringify(polls));
    return poll;
  }

  async vote(pollId: string, optionId: string, voterToken: string): Promise<Poll> {
    const polls = await this.getPolls();
    const pollIndex = polls.findIndex(p => p.id === pollId);
    
    if (pollIndex === -1) throw new Error("Poll not found");
    
    // Check if expired (Fairness 1)
    if (polls[pollIndex].expiresAt && Date.now() > polls[pollIndex].expiresAt!) {
      throw new Error("This poll has expired");
    }

    // Update vote count
    const updatedOptions = polls[pollIndex].options.map(opt => 
      opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
    );

    polls[pollIndex].options = updatedOptions;
    localStorage.setItem('pollstream_polls', JSON.stringify(polls));
    
    const updatedPoll = polls[pollIndex];
    this.broadcast(updatedPoll);
    return updatedPoll;
  }
}

export const db = new MockDB();
