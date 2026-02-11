import { createContext, ReactNode, useContext } from "react";
import { AppThemeMode } from "../theme";

type ThemeModeContextValue = {
  mode: AppThemeMode;
  toggleMode: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

type ThemeModeProviderProps = {
  value: ThemeModeContextValue;
  children: ReactNode;
};

export function ThemeModeProvider({ value, children }: ThemeModeProviderProps) {
  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used inside ThemeModeProvider");
  }
  return context;
}
