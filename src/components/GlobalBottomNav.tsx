import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { SyntheticEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { alpha, useTheme } from "@mui/material/styles";

type HomeTab = "discover" | "bookmarks" | "words";

function getTabFromSearch(search: string): HomeTab {
  const tab = new URLSearchParams(search).get("tab");
  if (tab === "bookmarks" || tab === "words" || tab === "discover") {
    return tab;
  }
  return "discover";
}

export default function GlobalBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const currentTab = getTabFromSearch(location.search);

  const handleChange = (_: SyntheticEvent, nextTab: HomeTab) => {
    if (location.pathname === "/") {
      navigate(`/?tab=${nextTab}`);
      return;
    }
    navigate(`/?tab=${nextTab}`);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        borderTop: "1px solid",
        borderColor: alpha(theme.palette.text.primary, 0.12),
        bgcolor: alpha(theme.palette.background.paper, 0.92),
        backdropFilter: "blur(8px)",
        zIndex: 1200
      }}
    >
      <BottomNavigation value={currentTab} onChange={handleChange}>
        <BottomNavigationAction
          label="Discover"
          value="discover"
          icon={<AutoStoriesRoundedIcon fontSize="small" />}
        />
        <BottomNavigationAction
          label="Bookmarks"
          value="bookmarks"
          icon={<BookmarkRoundedIcon fontSize="small" />}
        />
        <BottomNavigationAction
          label="Words"
          value="words"
          icon={<SchoolRoundedIcon fontSize="small" />}
        />
      </BottomNavigation>
    </Paper>
  );
}
