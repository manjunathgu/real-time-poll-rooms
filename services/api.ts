
import { Poll } from '../types';

/**
 * API Service
 * Handles communication between the React frontend and the Express backend.
 */

// Use window.location.hostname to be more flexible, but default to 3001 for local dev
const API_BASE = window.location.port ? `http://${window.location.hostname}:3001` : ''; 

export const api = {
  async getPoll(id: string): Promise<Poll> {
    const response = await fetch(`${API_BASE}/api/polls/${id}`);
    if (!response.ok) throw new Error('Poll not found');
    return response.json();
  },

  async createPoll(pollData: Partial<Poll>): Promise<Poll> {
    const response = await fetch(`${API_BASE}/api/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pollData),
    });
    return response.json();
  },

  async castVote(pollId: string, optionId: string, voterToken: string): Promise<Poll> {
    const response = await fetch(`${API_BASE}/api/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId, voterToken }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to vote');
    }
    return response.json();
  }
};
