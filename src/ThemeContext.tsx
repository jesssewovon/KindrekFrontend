import React, { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

interface ThemeContextType {
  isSideBarOpen: boolean;
  setSideBarStatus: React.Dispatch<React.SetStateAction<boolean>>;
}
// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isSideBarOpen, setSideBarStatus] = useState(false);

  return (
    <ThemeContext.Provider value={{ isSideBarOpen, setSideBarStatus }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook (optional, for cleaner usage)
//export const useTheme = () => useContext(ThemeContext);
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};