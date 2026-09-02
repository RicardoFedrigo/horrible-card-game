import { create } from "zustand";
import type { Room, Player, Card } from "../types";

export interface RoundRecord {
  round: number;
  blackCard: Card;
  winnerId: string | null;
  winnerName: string;
  winningCards: Card[];
  votes: { voterPlayerId: string; votedForPlayerId: string }[];
}

interface GameStore {
  room: Room | null;
  player: Player | null;
  isConnected: boolean;
  socketStatus: "idle" | "connecting" | "connected" | "disconnected" | "reconnecting";
  socketInitialized: boolean;
  error: string | null;
  lobbyMessages: string[];
  timerRemaining: number | null;
  submissionConfirmed: boolean;
  roundHistory: RoundRecord[];
  winnerMessage: string | null;
  roomPassword: string | null;
  setRoom: (room: Room | null) => void;
  setPlayer: (player: Player | null) => void;
  setConnected: (isConnected: boolean) => void;
  setSocketStatus: (
    socketStatus: "idle" | "connecting" | "connected" | "disconnected" | "reconnecting",
  ) => void;
  setSocketInitialized: (initialized: boolean) => void;
  setError: (error: string | null) => void;
  pushLobbyMessage: (message: string) => void;
  setTimerRemaining: (remaining: number | null) => void;
  setSubmissionConfirmed: (confirmed: boolean) => void;
  addRoundRecord: (record: RoundRecord) => void;
  setWinnerMessage: (message: string | null) => void;
  setRoomPassword: (password: string | null) => void;
  resetRoom: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  room: null,
  player: null,
  isConnected: false,
  socketStatus: "idle",
  socketInitialized: false,
  error: null,
  lobbyMessages: [],
  timerRemaining: null,
  submissionConfirmed: false,
  roundHistory: [],
  winnerMessage: null,
  roomPassword: null,
  setRoom: (room) => set({ room }),
  setPlayer: (player) => set({ player }),
  setConnected: (isConnected) => set({ isConnected }),
  setSocketStatus: (socketStatus) => set({ socketStatus }),
  setSocketInitialized: (initialized) => set({ socketInitialized: initialized }),
  setError: (error) => set({ error }),
  pushLobbyMessage: (message) =>
    set((state) => ({
      lobbyMessages: [message, ...state.lobbyMessages].slice(0, 10),
    })),
  setTimerRemaining: (remaining) => set({ timerRemaining: remaining }),
  setSubmissionConfirmed: (confirmed) => set({ submissionConfirmed: confirmed }),
  addRoundRecord: (record) =>
    set((state) => ({
      roundHistory: [...state.roundHistory, record],
    })),
  setWinnerMessage: (message) => set({ winnerMessage: message }),
  setRoomPassword: (roomPassword) => set({ roomPassword }),
  resetRoom: () =>
    set({
      room: null,
      player: null,
      error: null,
      lobbyMessages: [],
      timerRemaining: null,
      submissionConfirmed: false,
      roundHistory: [],
      winnerMessage: null,
      roomPassword: null,
    }),
}));
