import { useEffect, useCallback } from "react";
import type { Room, Player } from "../types";
import { useGameStore } from "../store/useGameStore";
import { getSocket, initializeSocket } from "../socket/socketClient";
import { getPlayerId } from "../utils/playerId";

interface UseSocketReturn {
  isConnected: boolean;
  room: Room | null;
  player: Player | null;
  error: string | null;
  lobbyMessages: string[];
  timerRemaining: number | null;
  createRoom: (
    playerName: string,
    roomCode: string,
    password?: string,
    language?: string,
  ) => void;
  joinRoom: (
    roomCode: string,
    playerName: string,
    password?: string,
  ) => void;
  setReady: () => void;
  startGame: () => void;
  submitCards: (cardIds: string[]) => void;
  selectWinner: (playerId: string) => void;
  leaveRoom: () => void;
  backToLobby: () => void;
  configureRoom: (config: {
    numberOfrounds: number;
    maxPlayers: number;
    password?: string;
    playingTime: number;
    judgingTime: number;
    resultsTime: number;
    language?: string;
  }) => void;
}

const getOrInitializeSocket = () => getSocket() ?? initializeSocket();

export const useSocket = (): UseSocketReturn => {
  const room = useGameStore((state) => state.room);
  const player = useGameStore((state) => state.player);
  const isConnected = useGameStore((state) => state.isConnected);
  const error = useGameStore((state) => state.error);
  const lobbyMessages = useGameStore((state) => state.lobbyMessages);
  const timerRemaining = useGameStore((state) => state.timerRemaining);

  useEffect(() => {
    initializeSocket();
  }, []);

  const createRoom = useCallback(
    (
      playerName: string,
      roomCode: string,
      password?: string,
      language?: string,
    ) => {
      const socket = getOrInitializeSocket();
      useGameStore.getState().setRoomPassword(password?.trim() || null);
      socket.emit("create-room", {
        numberOfrounds: 5,
        maxPlayers: 10,
        codeRoom: roomCode,
        adminName: playerName,
        playerId: getPlayerId(),
        password: password || undefined,
        playingTime: 60,
        judgingTime: 60,
        resultsTime: 10,
        language: language || "en",
      });
    },
    [],
  );

  const joinRoom = useCallback(
    (codeRoom: string, playerName: string, password?: string) => {
      const socket = getOrInitializeSocket();
      useGameStore.getState().setRoomPassword(password?.trim() || null);
      socket.emit("join-room", {
        codeRoom,
        name: playerName,
        playerId: getPlayerId(),
        password: password || undefined,
      });
    },
    [],
  );

  const setReady = useCallback(() => {
    if (!room) return;
    const socket = getOrInitializeSocket();
    socket.emit("playerReady", room.codeRoom);
  }, [room]);

  const startGame = useCallback(() => {
    if (!room) return;
    const socket = getOrInitializeSocket();
    socket.emit("startGame", room.codeRoom);
  }, [room]);

  const submitCards = useCallback(
    (cardIds: string[]) => {
      if (!room) return;
      const socket = getOrInitializeSocket();
      socket.emit("submitCards", room.codeRoom, cardIds);
    },
    [room],
  );

  const selectWinner = useCallback(
    (playerId: string) => {
      if (!room) return;
      const socket = getOrInitializeSocket();
      socket.emit("selectWinner", room.codeRoom, playerId);
    },
    [room],
  );

  const leaveRoom = useCallback(() => {
    if (!room) return;
    const socket = getOrInitializeSocket();
    socket.emit("leaveRoom", room.codeRoom);
    useGameStore.setState({ room: null, player: null });
  }, [room]);

  const backToLobby = useCallback(() => {
    if (!room) return;
    const socket = getOrInitializeSocket();
    socket.emit("backToLobby", room.codeRoom);
    useGameStore.setState({ roundHistory: [], winnerMessage: null });
  }, [room]);

  const configureRoom = useCallback(
    (config: {
      numberOfrounds: number;
      maxPlayers: number;
      password?: string;
      playingTime: number;
      judgingTime: number;
      resultsTime: number;
      language?: string;
    }) => {
      if (!room) return;
      const socket = getOrInitializeSocket();
      socket.emit("configure-room", {
        roomCode: room.codeRoom,
        ...config,
      });
    },
    [room],
  );

  return {
    isConnected,
    room,
    player,
    error,
    lobbyMessages,
    timerRemaining,
    createRoom,
    joinRoom,
    setReady,
    startGame,
    submitCards,
    selectWinner,
    leaveRoom,
    backToLobby,
    configureRoom,
  };
};
