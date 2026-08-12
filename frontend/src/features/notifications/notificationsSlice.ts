import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
  link?: string;
}

interface NotificationsState {
  items: Notification[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.is_read).length;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.items.unshift(action.payload);
      if (!action.payload.is_read) state.unreadCount += 1;
    },
    markRead(state, action: PayloadAction<string>) {
      const n = state.items.find((i) => i.id === action.payload);
      if (n && !n.is_read) {
        n.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead(state) {
      state.items.forEach((n) => (n.is_read = true));
      state.unreadCount = 0;
    },
  },
});

export const { setNotifications, addNotification, markRead, markAllRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
