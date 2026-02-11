import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { Article } from "../types";
import BibleInsightCard from "./BibleInsightCard";

type ReaderViewProps = {
  article: Article;
  isBookmarked: boolean;
  savedVocabulary: string[];
  onToggleBookmark: (id: string) => void;
  onToggleVocabulary: (word: string) => void;
};

export default function ReaderView({
  article,
  isBookmarked,
  savedVocabulary,
  onToggleBookmark,
  onToggleVocabulary
}: ReaderViewProps) {
  const paragraphs = article.paragraphs ?? article.sections?.flatMap((section) => section.paragraphs) ?? [];
  const keyVocabulary = article.keyVocabulary ?? [];

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 6 },
        borderRadius: 4,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider"
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1.5, lineHeight: 1.25 }}>
            {article.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            {article.subtitle ?? article.hook}
          </Typography>
          <Button
            size="small"
            variant={isBookmarked ? "contained" : "outlined"}
            onClick={() => onToggleBookmark(article.id)}
            startIcon={isBookmarked ? <BookmarkRoundedIcon /> : <BookmarkBorderRoundedIcon />}
          >
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
        </Box>

        <Divider />

        <Box>
          {paragraphs.map((paragraph, index) => (
            <Typography
              key={`${article.id}-${index + 1}`}
              variant="body1"
              sx={{ mb: 2.5, maxWidth: "75ch" }}
            >
              {paragraph}
            </Typography>
          ))}
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.25 }}>
            Key Vocabulary
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {keyVocabulary.map((word) => {
              const saved = savedVocabulary.includes(word);
              return (
                <Chip
                  key={word}
                  label={word}
                  clickable
                  color={saved ? "primary" : "default"}
                  variant={saved ? "filled" : "outlined"}
                  onClick={() => onToggleVocabulary(word)}
                />
              );
            })}
          </Box>
        </Box>
      </Stack>

      {article.bibleInsight && <BibleInsightCard insight={article.bibleInsight} />}
    </Paper>
  );
}
