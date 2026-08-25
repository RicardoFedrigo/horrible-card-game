import { io, type Socket } from "socket.io-client";
import { useGameStore } from "../store/useGameStore";
import i18n from "../i18n";
import type { Card, Player, Room } from "../types";
import { getPlayerId } from "../utils/playerId";

interface RoomActivityPayload {
  message: string;
  roomId: string;
  configGame: Room["configGame"];
  players: Player[];
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "localhost:3000";
const SOCKET_RECONNECTION_DELAY = parseInt(
  import.meta.env.VITE_SOCKET_RECONNECTION_DELAY || "1000",
  10
);

const getPhaseDuration = (room: Room): number => {
  switch (room.gamePhase) {
    case "playing":
      return room.configGame.playingTime;
    case "judging":
      return room.configGame.judgingTime;
    case "results":
      return room.configGame.resultsTime;
    default:
      return 0;
  }
};

let socket: Socket | null = null;
let socketListenersAttached = false;

const attachSocketListeners = (socketInstance: Socket) => {
  if (socketListenersAttached) return;
  socketListenersAttached = true;

  const setState = useGameStore.setState;
  const setRoomAndPlayer = (room: Room, playerId?: string) => {
    const currentPlayerId = playerId ?? getPlayerId();
    setState({
      room,
      player: room.players.find((p) => p.id === currentPlayerId) ?? null,
      error: null,
    });
  };

  socketInstance.on("connect", () => {
    setState({ isConnected: true, socketStatus: "connected", error: null });

    const { room, player } = useGameStore.getState();
    if (room?.codeRoom && player?.id) {
      socketInstance.emit("rejoin", {
        roomCode: room.codeRoom,
        playerId: player.id,
      });
    }
  });

  socketInstance.on("disconnect", () => {
    setState({ isConnected: false, socketStatus: "disconnected" });
  });

  socketInstance.on("connect_error", () => {
    setState({
      socketStatus: "disconnected",
      error: "Failed to connect to server",
    });
  });

  socketInstance.on("error", (message: string | { message: string }) => {
    const errorMsg = typeof message === "string" ? message : message?.message || "Unknown error";
    console.error("Error from server:", errorMsg);
    setState({ error: errorMsg });
  });

  socketInstance.on(
    "room",
    (
      payload:
        | { room: Room; playerId: string }
        | RoomActivityPayload,
    ) => {
      if ("room" in payload && "playerId" in payload) {
        setRoomAndPlayer(payload.room, payload.playerId);
        return;
      }

      setState((prev) => {
        if (!prev.room) return prev;
        return {
          room: {
            ...prev.room,
            players: payload.players as Player[],
            configGame: payload.configGame,
          },
          lobbyMessages: [payload.message, ...prev.lobbyMessages].slice(0, 10),
        };
      });
    },
  );

  socketInstance.on("room-created", (roomCreated: { room: Room }) => {
    setRoomAndPlayer(roomCreated.room, roomCreated.room.players[0]?.id);
  });

  socketInstance.on("roomJoined", (payload: { room: Room; playerId?: string }) => {
    setRoomAndPlayer(payload.room, payload.playerId);
  });

  socketInstance.on("roomUpdated", (updatedRoom: Room) => {
    setState((prev) => {
      const phaseChanged = prev.room?.gamePhase !== updatedRoom.gamePhase;
      const next: Partial<ReturnType<typeof useGameStore.getState>> = {
        room: updatedRoom,
        player:
          updatedRoom.players.find((p) => p.id === prev.player?.id) ??
          prev.player,
      };

      if (phaseChanged) {
        next.timerRemaining = getPhaseDuration(updatedRoom);
      }

      return next;
    });
  });

  socketInstance.on("playerLeft", (leftPlayerId: string) => {
    setState((prev) => {
      if (!prev.room) return prev;
      return {
        room: {
          ...prev.room,
          players: prev.room.players.filter((p) => p.id !== leftPlayerId),
        },
      };
    });
  });

  socketInstance.on(
    "playerJoined",
    (payload: { playerId: string; name: string; players: Player[] }) => {
      setState((prev) => {
        if (!prev.room) return prev;
        return {
          room: {
            ...prev.room,
            players: payload.players,
          },
          lobbyMessages: [
            i18n.t("game.playerJoined", { name: payload.name }),
            ...prev.lobbyMessages,
          ].slice(0, 10),
        };
      });
    },
  );

  socketInstance.on(
    "playerReadyChanged",
    (changedPlayerId: string, isReady: boolean) => {
      setState((prev) => {
        if (!prev.room) return prev;
        return {
          room: {
            ...prev.room,
            players: prev.room.players.map((p) =>
              p.id === changedPlayerId
                ? { ...p, isReady, status: isReady ? "ready" : "waiting" }
                : p,
            ),
          },
        };
      });
    },
  );

  socketInstance.on("gameStarted", (updatedRoom: Room) => {
    setState({ room: updatedRoom });
  });

  socketInstance.on(
    "newRound",
    (payload: { room: Room }) => {
      setState((prev) => {
        if (!payload.room) return prev;
        return {
          room: payload.room,
          player:
            payload.room.players.find((p) => p.id === prev.player?.id) ??
            prev.player,
        };
      });
    },
  );

  socketInstance.on(
    "allCardsSubmitted",
    (submissions: { playerId: string; cards: Card[] }[]) => {
      setState((prev) => {
        if (!prev.room) return prev;
        return {
          room: {
            ...prev.room,
            submittedCards: submissions,
          },
        };
      });
    },
  );

  // The server emits a room update event with the new player list and config.

  socketInstance.on("cardsSubmitted", () => {
    useGameStore.getState().setSubmissionConfirmed(true);
  });

  socketInstance.on(
    "voteSubmitted",
    (payload: { voterPlayerId: string; votedForPlayerId: string }) => {
      setState((prev) => {
        if (!prev.room) return prev;
        const votes = prev.room.votes ?? [];
        if (votes.some((v) => v.voterPlayerId === payload.voterPlayerId)) {
          return prev;
        }
        return {
          room: {
            ...prev.room,
            votes: [...votes, payload],
          },
        };
      });
    },
  );

  socketInstance.on(
    "winnerSelected",
    (winningPlayerIds: string[], winningCards: Card[][]) => {
      setState((prev) => {
        if (!prev.room) return prev;

        const winnerIds = Array.isArray(winningPlayerIds)
          ? winningPlayerIds
          : [];
        const winnerNames = winnerIds.map(
          (id) =>
            prev.room?.players.find((p) => p.id === id)?.name ?? "Unknown",
        );

        if (prev.room.currentBlackCard) {
          useGameStore.getState().addRoundRecord({
            round: prev.room.currentRound,
            blackCard: prev.room.currentBlackCard,
            winnerId: winnerIds[0] ?? null,
            winnerName: winnerNames.join(" & "),
            winningCards: (winningCards ?? []).flat(),
            votes: prev.room.votes ?? [],
          });
        }

        return {
          room: {
            ...prev.room,
            winningPlayerIds: winnerIds,
            winningPlayerId: winnerIds[0] ?? null,
          },
        };
      });
    },
  );

  socketInstance.on("gameEnded", (winner: Player & { message?: string }) => {
    setState((prev) => {
      if (!prev.room) return prev;
      return {
        room: {
          ...prev.room,
          gamePhase: "ended",
          winningPlayerId: winner.id,
        },
      };
    });
    useGameStore.getState().setWinnerMessage(winner.message ?? null);
    console.log("Game ended! Winner:", winner.name);
  });

  socketInstance.on("timerTick", (data: { phase: string; remaining: number }) => {
    useGameStore.getState().setTimerRemaining(data.remaining);
  });
};

export const initializeSocket = () => {
  if (socket) return socket;
  useGameStore.setState({
    socketStatus: "connecting",
    socketInitialized: true,
  });

  socket = io(SOCKET_URL, {
    autoConnect: true,
    timeout: 5000,
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: SOCKET_RECONNECTION_DELAY,
  });

  attachSocketListeners(socket);
  return socket;
};

export const getSocket = () => socket;
