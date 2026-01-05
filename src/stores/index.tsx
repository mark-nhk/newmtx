import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface StoreTypes {
  data: string;
  isShowFooter: boolean;
  isWrap: boolean;
  positionCursor: {
    selStart: number;
    selEnd: number;
  };
  themeColor: string;
  textColor: string;
  fontSize: number;
  history: string[];
  historyIndex: number;
  setPositionCursor: (value: { selStart: number; selEnd: number }) => void;
  setIsWrap: (value: boolean) => void;
  setThemeColor: (value: string) => void;
  setTextColor: (value: string) => void;
  setData: (value: string) => void;
  setFontSize: (value: number) => void;
  setIsShowFooter: (value: boolean) => void;
  undo: () => void;
  redo: () => void;
  addToHistory: (value: string) => void;
}

// Load themeColor and textColor from sessionStorage on initialization
const loadSessionColors = () => {
  try {
    const sessionData = sessionStorage.getItem("sessionColors");
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      return {
        themeColor: parsed.themeColor || "Default",
        textColor: parsed.textColor || "gainsboro",
      };
    }
  } catch {
    // Ignore errors
  }
  return {
    themeColor: "Default",
    textColor: "gainsboro",
  };
};

const sessionColors = loadSessionColors();

export const store = create<StoreTypes>()(
  devtools(
    persist(
      (set, get) => ({
        themeColor: sessionColors.themeColor,
        textColor: sessionColors.textColor,
        data: "",
        fontSize: 1,
        isShowFooter: true,
        isWrap: true,
        positionCursor: { selStart: 0, selEnd: 0 },
        history: [""],
        historyIndex: 0,
        setPositionCursor: (value: { selStart: number; selEnd: number }) =>
          set({
            positionCursor: {
              selStart: value.selStart,
              selEnd: value.selEnd,
            },
          }),
        setThemeColor: (value: string) => set({ themeColor: value }),
        setTextColor: (value: string) => set({ textColor: value }),
        setData: (value: string) => {
          const state = get();
          const oldValue = state.data;
          set({ data: value });
          // Only add to history if value changed
          if (value !== oldValue) {
            state.addToHistory(value);
          }
        },
        addToHistory: (value: string) => {
          const state = get();
          // Don't add if it's the same as current
          if (value === state.history[state.historyIndex]) {
            return;
          }
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(value);
          // Limit history to 50 items
          if (newHistory.length > 50) {
            newHistory.shift();
          } else {
            set({ historyIndex: newHistory.length - 1 });
          }
          set({ history: newHistory });
        },
        undo: () => {
          const state = get();
          if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1;
            set({
              data: state.history[newIndex],
              historyIndex: newIndex,
            });
          }
        },
        redo: () => {
          const state = get();
          if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1;
            set({
              data: state.history[newIndex],
              historyIndex: newIndex,
            });
          }
        },
        setFontSize: (value: number) => set({ fontSize: value }),
        setIsWrap: (value: boolean) => set({ isWrap: value }),
        setIsShowFooter: (value: boolean) => set({ isShowFooter: value }),
      }),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          // Exclude themeColor and textColor from localStorage persist
          data: state.data,
          fontSize: state.fontSize,
          isShowFooter: state.isShowFooter,
          isWrap: state.isWrap,
          positionCursor: state.positionCursor,
          history: state.history,
          historyIndex: state.historyIndex,
        }),
      }
    )
  )
);

// Subscribe to themeColor and textColor changes to sync with sessionStorage
let prevThemeColor = sessionColors.themeColor;
let prevTextColor = sessionColors.textColor;

store.subscribe((state) => {
  if (state.themeColor !== prevThemeColor || state.textColor !== prevTextColor) {
    prevThemeColor = state.themeColor;
    prevTextColor = state.textColor;
    try {
      sessionStorage.setItem("sessionColors", JSON.stringify({ 
        themeColor: state.themeColor, 
        textColor: state.textColor 
      }));
    } catch (error) {
      // Silently fail - sessionStorage might not be available in some contexts
      if (process.env.NODE_ENV === "development") {
        console.error("Error saving session colors:", error);
      }
    }
  }
});
