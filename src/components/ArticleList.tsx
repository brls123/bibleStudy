import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Article } from "../types";

type ArticleListProps = {
  articles: Article[];
  selectedArticleId: string;
  bookmarks: string[];
  onSelect: (id: string) => void;
  onToggleBookmark: (id: string) => void;
};

export default function ArticleList({
  articles,
  selectedArticleId,
  bookmarks,
  onSelect,
  onToggleBookmark
}: ArticleListProps) {
  const theme = useTheme();

  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });

  return (
    <Stack spacing={1.75}>
      {articles.map((article) => {
        const selected = selectedArticleId === article.id;
        const bookmarked = bookmarks.includes(article.id);

        return (
          <Card
            key={article.id}
            variant="outlined"
            sx={{
              borderColor: selected ? "rgba(47,62,70,0.24)" : "rgba(31,37,40,0.10)",
              bgcolor: "background.paper",
              transition: "background-color 180ms ease, border-color 180ms ease",
              "&:hover": {
                bgcolor: alpha(theme.palette.text.primary, theme.palette.mode === "dark" ? 0.08 : 0.03),
                borderColor: "rgba(47,62,70,0.2)"
              }
            }}
          >
            <CardActionArea onClick={() => onSelect(article.id)}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                  <Box>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      sx={{ display: "block", letterSpacing: "0.08em", lineHeight: 1.4 }}
                    >
                      {formatDate(article.publishedAt)}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 600, letterSpacing: "0.005em" }}>
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.4, lineHeight: 1.75 }}>
                      {article.hook}
                    </Typography>
                    {article.learnings && article.learnings.length > 0 ? (
                      <Box sx={{ mb: 1.4 }}>
                        {article.learnings.slice(0, 2).map((item) => (
                          <Typography
                            key={item}
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", lineHeight: 1.55 }}
                          >
                            - {item}
                          </Typography>
                        ))}
                      </Box>
                    ) : null}
                  </Box>
                  <Tooltip title={bookmarked ? "Remove bookmark" : "Save bookmark"}>
                    <IconButton
                      size="small"
                      aria-label={bookmarked ? "remove bookmark" : "save bookmark"}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleBookmark(article.id);
                      }}
                    >
                      {bookmarked ? (
                        <BookmarkRoundedIcon fontSize="small" />
                      ) : (
                        <BookmarkBorderRoundedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip size="small" label={`Level ${article.level}`} variant="outlined" sx={{ bgcolor: "transparent" }} />
                  <Chip
                    size="small"
                    icon={<AccessTimeRoundedIcon />}
                    label={`${article.readingTime} min read`}
                    variant="outlined"
                    sx={{ bgcolor: "transparent" }}
                  />
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Stack>
  );
}

