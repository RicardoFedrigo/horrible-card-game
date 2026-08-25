export interface ClientToServerEvents {
  'room:create': (payload: { name: string }) => void;

  'room:join': (payload: {
    roomId: string;
    name: string;
  }) => void;

  'room:check': (roomId: string) => void;

  'game:start': () => void;
}

export interface ServerToClientEvents {
  'room:created': (payload: {
    roomId: string;
  }) => void;

  'room:updated': (payload: unknown) => void;

  'room:checked': (payload: {
    exists: boolean;
    roomId: string;
  }) => void;

  error: (message: string) => void;
}