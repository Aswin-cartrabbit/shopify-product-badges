import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SessionState {
  storeId: string | null;
  setStoreId: (id: string) => void;
  clearStoreId: () => void;
}

export const useSessionStore = create<SessionState>()(
  devtools(
    persist(
      (set) => ({
        storeId: null,
        setStoreId: (id) => set({ storeId: id }),
        clearStoreId: () => set({ storeId: null }),
      }),
      {
        name: "sessionStore",
      }
    )
  )
);
