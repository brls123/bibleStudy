import { createTheme } from "@mui/material/styles";

export type AppThemeMode = "light" | "dark";

export function createAppTheme(mode: AppThemeMode) {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      background: {
        default: isDark ? "#121316" : "#F7F7F8",
        paper: isDark ? "#1A1C20" : "#ffffff"
      },
      text: {
        primary: isDark ? "#F1F3F5" : "#1C1C1E",
        secondary: isDark ? "#ADB5BD" : "#6E6E73"
      },
      primary: {
        main: isDark ? "#E9ECEF" : "#2E2E2E"
      }
    },
    typography: {
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: "2rem",
        fontWeight: 600,
        letterSpacing: "-0.02em"
      },
      h2: {
        fontSize: "1.5rem",
        fontWeight: 600,
        letterSpacing: "-0.01em"
      },
      h3: {
        fontSize: "1.2rem",
        fontWeight: 600
      },
      body1: {
        fontSize: "1.05rem",
        lineHeight: 1.75,
        letterSpacing: "0.01em"
      },
      body2: {
        fontSize: "0.95rem",
        lineHeight: 1.6,
        color: isDark ? "#ADB5BD" : "#6E6E73"
      }
    },
    shape: {
      borderRadius: 12
    },
    components: {
      MuiContainer: {
        styleOverrides: {
          root: {
            maxWidth: "760px"
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: isDark ? "none" : "0 2px 8px rgba(0,0,0,0.04)",
            border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.04)"
          }
        }
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            wordBreak: "break-word"
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            backgroundColor: isDark ? "#2A2E35" : "#EFEFF1"
          },
          label: {
            paddingLeft: 8,
            paddingRight: 8
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: "none",
            fontWeight: 500
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none"
          }
        }
      }
    }
  });
}

export const appTheme = createAppTheme("light");
