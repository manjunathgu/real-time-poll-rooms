
export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdAt: number;
  expiresAt: number | null;
  authorId: string; // Renamed from createdBy for clarity
}

export interface VoteRequest {
  optionId: string;
  voterToken: string;
}
