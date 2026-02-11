import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useThemeMode } from "../context/ThemeModeContext";

type AppHeaderProps = {
  bookmarkCount: number;
  vocabCount: number;
};

export default function AppHeader({ bookmarkCount, vocabCount }: AppHeaderProps) {
  const { mode, toggleMode } = useThemeMode();
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 2.25, md: 3.5 },
        borderBottom: "1px solid",
        borderColor: alpha(theme.palette.text.primary, 0.08),
        mb: { xs: 1, md: 2 }
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <MenuBookRoundedIcon sx={{ color: "primary.main", fontSize: 20 }} />
          <Typography variant="h6" sx={{ letterSpacing: "0.01em", fontWeight: 600, fontSize: "1.05rem" }}>
            Daily Reader
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: "0.02em", opacity: 0.9 }}>
            {bookmarkCount} bookmarks • {vocabCount} saved words
          </Typography>
          <Tooltip title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}>
            <IconButton size="small" aria-label="toggle theme mode" onClick={toggleMode}>
              {mode === "light" ? <DarkModeRoundedIcon fontSize="small" /> : <LightModeRoundedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.9, lineHeight: 1.65 }}>
        Short daily reads for focused language growth.
      </Typography>
    </Box>
  );
}
