import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { createAppTheme, AppThemeMode } from "./theme";
import { ThemeModeProvider } from "./context/ThemeModeContext";

function Root() {
  const [mode, setMode] = useState<AppThemeMode>(() => {
    const saved = localStorage.getItem("reading_mvp_theme_mode");
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("reading_mvp_theme_mode", mode);
  }, [mode]);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeModeProvider
      value={{
        mode,
        toggleMode: () => setMode((current) => (current === "light" ? "dark" : "light"))
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </ThemeModeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
