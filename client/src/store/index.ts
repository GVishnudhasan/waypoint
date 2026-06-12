import { create } from 'zustand';
import { api } from '../api/client';
import { io } from 'socket.io-client';

interface AppState {
  // Auth
  currentUser: any | null;
  isAuthenticated: boolean;
  socket: any | null;

  // Event
  currentEvent: any | null;

  // UI
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;

  // Actions
  setCurrentUser: (user: any) => void;
  setCurrentEvent: (event: any) => void;
  loginAsUser: (userId: string) => Promise<void>;
  registerUser: (data: any) => Promise<any>;
  logout: () => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  socket: null,
  currentEvent: null,
  sidebarOpen: true,
  commandPaletteOpen: false,
  toasts: [],

  setCurrentUser: (user) => {
    // Disconnect old socket if any
    const oldSocket = get().socket;
    if (oldSocket) {
      oldSocket.disconnect();
    }

    let socketInstance: any = null;
    if (user) {
      // Connect to WebSocket server
      socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');
      socketInstance.on('connect', () => {
        socketInstance.emit('REGISTER', { userId: user.id });
      });

      socketInstance.on('CONNECTION_REQUEST', (data: any) => {
        get().addToast(`New connection request from ${data.senderName || 'another attendee'}!`, 'info');
      });

      socketInstance.on('USER_AVAILABLE', (data: any) => {
        if (data.userId !== user.id) {
          get().addToast(`${data.userName} is now available in ${data.zone} discussing: ${data.topics}`, 'info');
        }
      });
    }

    set({ currentUser: user, isAuthenticated: !!user, socket: socketInstance });
  },

  setCurrentEvent: (event) => {
    set({ currentEvent: event });
  },

  loginAsUser: async (userId: string) => {
    try {
      const user = await api.getUser(userId);
      get().setCurrentUser(user);
    } catch (e) {
      console.error('Login failed:', e);
    }
  },

  registerUser: async (data: any) => {
    try {
      const currentEvent = get().currentEvent;
      const user = await api.createUser({
        ...data,
        event_id: currentEvent?.id || 'default',
      });
      get().setCurrentUser(user);
      get().addToast('Welcome to Waypoint!', 'success');
      return user;
    } catch (e: any) {
      get().addToast(e.message || 'Registration failed', 'error');
      throw e;
    }
  },

  logout: () => {
    const oldSocket = get().socket;
    if (oldSocket) {
      oldSocket.disconnect();
    }
    set({ currentUser: null, isAuthenticated: false, socket: null });
  },

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => get().removeToast(id), 4000);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
