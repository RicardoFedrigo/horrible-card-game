import express from 'express';
import http from 'http';
import { randomUUID } from 'node:crypto';
import { Server } from 'socket.io';
import cors from 'cors';
import { ConfigRoom } from './app/room/types/config-room.types';
import { JoinRoom } from './app/room/types/join-room.type';
import { RoomManager } from './app/room/models/room-manager';
import { RoomPresenterService } from './app/room/services/room-presenter.service';
import { RoomService } from './app/room/services/room.service';
import { PlayerRoomService } from './app/player/services/player-room.service';
import { WinnerMessages } from './db/static-db/winner-messages';

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const roomManager = new RoomManager();
const roomPresenter = new RoomPresenterService();

// Maps a live socket connection to its stable player identity so that actions
// are attributed to the player (not the volatile socket id).
const socketToPlayer = new Map<string, { roomCode: string; playerId: string }>();

const resolvePlayerId = (socket: any): string => {
  const mapping = socketToPlayer.get(socket.id);
  return mapping?.playerId ?? socket.id;
};

const onRoomStateChange = (room: any, previousPhase: string) => {
  const roomView = roomPresenter.mapRoom(room);
  const roomCode = room.getCodeRoom().toUpperCase();
  const currentPhase = room.getGamePhase();

  io.to(roomCode).emit('roomUpdated', roomView);

  if (previousPhase === 'playing' && currentPhase === 'judging') {
    io.to(roomCode).emit('allCardsSubmitted', roomView.submittedCards);
  } else if ((previousPhase === 'playing' || previousPhase === 'judging') && currentPhase === 'results') {
    const winningPlayerIds = room.getWinningPlayerIds();
    const winningSubmissions =
      roomView.submittedCards?.filter((s: any) =>
        winningPlayerIds.includes(s.playerId),
      ) ?? [];
    const winningCards = winningSubmissions.map((s: any) => s.cards);
    io.to(roomCode).emit('winnerSelected', winningPlayerIds, winningCards);
  } else if (previousPhase === 'results' && currentPhase === 'playing') {
    io.to(roomCode).emit('newRound', { room: roomView });
  } else if (currentPhase === 'ended') {
    const players = room.getPlayers();
    if (players.length > 0) {
      const maxPoints = Math.max(
        ...players.map((p: any) => p.getPoints()),
      );
      const winner = players.find((p: any) => p.getPoints() === maxPoints);
      if (winner) {
        const language = room.getConfigGame()?.language || 'en';
        const message = WinnerMessages.getRandom(language, winner.getName());
        io.to(roomCode).emit('gameEnded', {
          id: winner.getId(),
          name: winner.getName(),
          status: winner.getStatus(),
          score: winner.getPoints(),
          cardsInHand: winner.getCards(),
          isAdmin: winner.getIsAdmin(),
          message,
        });
      }
    }
  }
};


const roomService = new RoomService(roomManager, roomPresenter);
const playerRoomService = new PlayerRoomService(roomManager, roomPresenter);


io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Create Room
  socket.on('create-room', function (config: ConfigRoom) {
    try {
      const playerId = randomUUID();
      const roomCreated = roomService.createRoom(config, playerId, onRoomStateChange);
      const roomCodeUpper = config.codeRoom.toUpperCase();
      socketToPlayer.set(socket.id, { roomCode: roomCodeUpper, playerId });
      console.log(`Room created: ${config.codeRoom} by ${playerId}`);

      socket.join(roomCodeUpper);

      const room = roomManager.getRoom(roomCodeUpper);
      const player = room.getPlayers().find((p: any) => p.getId() === playerId);
      const reconnectToken = player?.getReconnectToken();
      
      // Emit room-created with the expected { room, playerId } structure
      socket.emit('room-created', {
        room: roomCreated.room,
        playerId,
        reconnectToken,
      });
      // Also emit standard room sync
      socket.emit('room', {
        room: roomCreated.room,
        playerId,
        reconnectToken,
      });
    } catch (error) {
      console.error(`Error creating room:`, error);
      socket.emit('error', {
        message: error instanceof Error ? error.message : 'Failed to create room',
      });
    }
  });

  // Join Room
  socket.on('join-room', (joinRoom: JoinRoom) => {
    try {
      const playerId = randomUUID();
      const roomJoined = roomService.joinRoom(joinRoom, playerId);
      console.log(`Player ${joinRoom.name} joined room: ${joinRoom.codeRoom}`);

      const roomCodeUpper = joinRoom.codeRoom.toUpperCase();
      socketToPlayer.set(socket.id, { roomCode: roomCodeUpper, playerId });
      socket.join(roomCodeUpper);

      const room = roomManager.getRoom(joinRoom.codeRoom);
      const roomView = roomPresenter.mapRoom(room);
      const player = room.getPlayers().find((p: any) => p.getId() === playerId);
      const reconnectToken = player?.getReconnectToken();

      // Emit room joining sync back to the joining socket
      socket.emit('room', {
        room: roomView,
        playerId,
        reconnectToken,
      });
      socket.emit('roomJoined', {
        room: roomView,
        playerId,
        reconnectToken,
      });

      // Broadcast the complete updated room view to all players in the room
      io.to(roomCodeUpper).emit('roomUpdated', roomView);
      io.to(roomCodeUpper).emit('playerJoined', {
        playerId,
        name: joinRoom.name,
        players: roomView.players,
      });
    } catch (error) {
      console.error(`Error joining room:`, error);
      socket.emit('error', {
        message: error instanceof Error ? error.message : 'Failed to join room',
      });
    }
  });

  // Reconnect: re-associate a new socket connection with an existing player.
  socket.on('rejoin', (payload: { roomCode: string; playerId: string; reconnectToken?: string }) => {
    try {
      const roomCodeUpper = (payload?.roomCode || '').toUpperCase();
      const playerId = payload?.playerId;
      const reconnectToken = payload?.reconnectToken;
      if (!roomCodeUpper || !playerId) {
        return;
      }

      const room = roomManager.getRoom(roomCodeUpper);
      const player = room
        .getPlayers()
        .find((p: any) => p.getId() === playerId);

      if (!player || !reconnectToken || player.getReconnectToken() !== reconnectToken) {
        socket.emit('error', { message: 'Player not found in room' });
        return;
      }

      socketToPlayer.set(socket.id, { roomCode: roomCodeUpper, playerId });
      socket.join(roomCodeUpper);

      const roomView = roomPresenter.mapRoom(room);
      socket.emit('room', { room: roomView, playerId, reconnectToken });
    } catch (error) {
      console.error(`Error rejoining room:`, error);
    }
  });

  // Check if Room Exists
  socket.on('check-room', (roomCode: string) => {
    try {
      const roomCodeUpper = roomCode.toUpperCase();
      const result = roomService.roomExists(roomCodeUpper);

      if (!result.exists) {
        socket.emit('error', {
          message: `Room ${roomCodeUpper} not found`,
        });
        return;
      }

      socket.emit('roomChecked', {
        exists: true,
        roomId: result.roomId,
      });
    } catch (error) {
      console.error(`Error checking room:`, error);
      socket.emit('error', {
        message: error instanceof Error ? error.message : 'Room not found',
      });
    }
  });

  // Configure Room
  socket.on('configure-room', function (config: any) {
    try {
      const codeRoom = (config.roomCode || config.codeRoom || '').toUpperCase();
      const configMapped: ConfigRoom = {
        codeRoom: codeRoom,
        numberOfrounds: config.numberOfrounds ?? 5,
        maxPlayers: config.maxPlayers ?? 10,
        password: config.password,
        adminName: '',
        playingTime: config.playingTime ?? 60,
        judgingTime: config.judgingTime ?? 60,
        resultsTime: config.resultsTime ?? 30,
        language: config.language,
      };

      roomService.configureRoom(configMapped);
      console.log(`Room configured: ${codeRoom}`);

      const room = roomManager.getRoom(codeRoom);
      const roomView = roomPresenter.mapRoom(room);

      io.to(codeRoom).emit('roomUpdated', roomView);
    } catch (error) {
      console.error(`Error configuring room:`, error);
      socket.emit('error', {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Player Ready (toggle)
  socket.on('playerReady', (roomCode: string) => {
    try {
      const roomCodeUpper = roomCode.toUpperCase();
      const playerId = resolvePlayerId(socket);
      const result = playerRoomService.togglePlayerReady(roomCodeUpper, playerId);
      console.log(
        `Player ${playerId} toggled ready=${result.isReady} in room ${roomCodeUpper}`,
      );

      const room = roomManager.getRoom(roomCodeUpper);
      const roomView = roomPresenter.mapRoom(room);

      io.to(roomCodeUpper).emit('playerReadyChanged', playerId, result.isReady);
      io.to(roomCodeUpper).emit('roomUpdated', roomView);
    } catch (error) {
      console.error(`Error toggling player ready:`, error);
      socket.emit('error', {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

      socket.on('startGame', (roomCode: string) => {
        try {
          const roomCodeUpper = roomCode.toUpperCase();
          const room = roomManager.getRoom(roomCodeUpper);
          room.startGame();
          console.log(`Game started in room: ${roomCodeUpper}`);
    
          const roomView = roomPresenter.mapRoom(room);
    
          io.to(roomCodeUpper).emit('gameStarted', roomView);
          io.to(roomCodeUpper).emit('roomUpdated', roomView);
          io.to(roomCodeUpper).emit('newRound', { room: roomView });
        } catch (error) {
          console.error(`Error starting game:`, error);
          socket.emit('error', {
            message: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });
    
      // Submit Cards
      socket.on('submitCards', (roomCode: string, cardIds: string[]) => {
        try {
          const roomCodeUpper = roomCode.toUpperCase();
          const room = roomManager.getRoom(roomCodeUpper);
          const playerId = resolvePlayerId(socket);
          room.submitCards(playerId, cardIds);
          console.log(`Player ${playerId} submitted cards in room ${roomCodeUpper}`);
    
          io.to(roomCodeUpper).emit('cardsSubmitted', playerId);
        } catch (error) {
          console.error(`Error submitting cards:`, error);
          socket.emit('error', {
            message: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });
    
      // Vote for a submitted card
      socket.on('selectWinner', (roomCode: string, winnerPlayerId: string) => {
        try {
          const roomCodeUpper = roomCode.toUpperCase();
          const room = roomManager.getRoom(roomCodeUpper);
          const voterPlayerId = resolvePlayerId(socket);
          
          const recorded = room.selectWinner(voterPlayerId, winnerPlayerId);
          console.log(`Player ${voterPlayerId} voted for ${winnerPlayerId} in room ${roomCodeUpper}`);

          if (recorded) {
            io.to(roomCodeUpper).emit('voteSubmitted', {
              voterPlayerId,
              votedForPlayerId: winnerPlayerId,
            });
          }

          // Resolve only after voteSubmitted so event order stays consistent.
          room.resolveVotingIfComplete();
        } catch (error) {
          console.error(`Error selecting winner:`, error);
          socket.emit('error', {
            message: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

  // Leave Room
  socket.on('leaveRoom', (roomCode: string) => {
    try {
      const roomCodeUpper = roomCode.toUpperCase();
      const room = roomManager.getRoom(roomCodeUpper);
      const playerId = resolvePlayerId(socket);
      const remaining = room.disconnectPlayer(playerId);
      socketToPlayer.delete(socket.id);
      socket.leave(roomCodeUpper);
      console.log(`Player ${playerId} left room ${roomCodeUpper}`);

      if (remaining === 0) {
        roomManager.remove(roomCodeUpper);
        return;
      }

      io.to(roomCodeUpper).emit('playerLeft', playerId);

      const roomView = roomPresenter.mapRoom(room);
      io.to(roomCodeUpper).emit('roomUpdated', roomView);
    } catch (error) {
      // Silently catch if room is not found
    }
  });

  // Back to lobby (replay without leaving the room)
  socket.on('backToLobby', (roomCode: string) => {
    try {
      const roomCodeUpper = roomCode.toUpperCase();
      const room = roomManager.getRoom(roomCodeUpper);
      room.resetToLobby();

      const roomView = roomPresenter.mapRoom(room);
      io.to(roomCodeUpper).emit('roomUpdated', roomView);
    } catch (error) {
      console.error(`Error going back to lobby:`, error);
      socket.emit('error', {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Socket Error
  socket.on('error', (error) => {
    console.error(`Socket Error: ${error.message}`);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    // Keep the player in the room so a transient disconnect (page refresh,
    // hot reload) can reconnect via the "rejoin" event without losing their
    // seat. Only the socket -> player mapping is cleaned up here.
    socketToPlayer.delete(socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running on 3000');
});

// Broadcast timer ticks to all active rooms
setInterval(() => {
  const rooms = roomManager.getAllRooms();
  for (const room of rooms) {
    const phase = room.getGamePhase();
    if (phase === 'playing' || phase === 'judging' || phase === 'results') {
      const startedAt = room.getPhaseStartedAt();
      if (startedAt) {
        let duration = 60;
        const config = room.getConfigGame();
        switch (phase) {
          case 'playing': duration = config.playingTime; break;
          case 'judging': duration = config.judgingTime; break;
          case 'results': duration = config.resultsTime; break;
        }
        
        const elapsed = (Date.now() - startedAt) / 1000;
        const remaining = Math.max(0, Math.min(duration, Math.floor(duration - elapsed)));
        
        io.to(room.getCodeRoom().toUpperCase()).emit('timerTick', {
          phase,
          remaining
        });
      }
    }
  }
}, 1000);
