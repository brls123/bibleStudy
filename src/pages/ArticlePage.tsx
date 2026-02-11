import { useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useThemeMode } from "../context/ThemeModeContext";
import rawArticles from "../data/articles.json";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Article } from "../types";
import { toggleListItem } from "../utils/toggleListItem";

const articles = rawArticles as Article[];

function levelChipSx(level: 1 | 2 | 3) {
  const base = {
    fontWeight: 600,
    border: "1px solid rgba(0,0,0,0.06)"
  };
  if (level === 1) return { ...base, backgroundColor: "#EEF2FF" };
  if (level === 2) return { ...base, backgroundColor: "#ECFDF5" };
  return { ...base, backgroundColor: "#FFF7ED" };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsWord(text: string, word: string) {
  return new RegExp(`\\b${escapeRegExp(word.toLowerCase())}\\b`, "i").test(text.toLowerCase());
}

function renderHighlightedText(text: string, words: string[], isDarkMode: boolean) {
  if (words.length === 0) return text;
  const escapedWords = words.map((word) => escapeRegExp(word)).filter(Boolean);
  if (escapedWords.length === 0) return text;

  const pattern = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi");
  const pieces = text.split(pattern);

  return pieces.map((piece, index) => {
    const matched = words.some((word) => word.toLowerCase() === piece.toLowerCase());
    if (!matched) return piece;
    return (
      <Box
        key={`${piece}-${index}`}
        component="mark"
        sx={{
          px: 0.2,
          py: 0.03,
          borderRadius: 0.4,
          bgcolor: isDarkMode ? "#6C5815" : "#fff3c4",
          color: isDarkMode ? "#FFF6D9" : "#4A3A00"
        }}
      >
        {piece}
      </Box>
    );
  });
}

export default function ArticlePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const activeTab = (() => {
    const current = searchParams.get("tab");
    if (current === "bookmarks" || current === "words" || current === "discover") {
      return current;
    }
    return "discover";
  })();
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>("reading_mvp_bookmarks", []);
  const [savedVocabulary, setSavedVocabulary] = useLocalStorage<string[]>("reading_mvp_vocabulary", []);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [selectionWords, setSelectionWords] = useState<string[]>([]);
  const [pickedWords, setPickedWords] = useState<string[]>([]);
  const article = articles.find((entry) => entry.id === id);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const rawText = selection?.toString().trim() ?? "";
    if (!rawText) return;

    const extracted = Array.from(
      new Set((rawText.match(/[A-Za-z][A-Za-z'-]*/g) ?? []).map((word) => word.toLowerCase()))
    ).slice(0, 8);
    if (extracted.length === 0) return;

    setSelectionWords(extracted);
    setPickedWords(extracted.filter((word) => !savedVocabulary.includes(word)));
    setIsSaveDialogOpen(true);
    selection?.removeAllRanges();
  };

  const handleSaveSelectedWords = () => {
    setSavedVocabulary((current) => {
      const next = [...current];
      pickedWords.forEach((word) => {
        if (!next.includes(word)) next.push(word);
      });
      return next;
    });
    setIsSaveDialogOpen(false);
  };

  if (!article) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Article not found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2.5 }}>
          The requested article does not exist in local data.
        </Typography>
        <Button
          onClick={() => navigate(`/?tab=${activeTab}`)}
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
        >
          Back to List
        </Button>
      </Container>
    );
  }

  const level = article.level;
  const isBookmarked = bookmarks.includes(article.id);
  const sections = article.sections ?? [{ paragraphs: article.paragraphs ?? [] }];
  const articleTextForVocabulary = `${article.title} ${article.hook} ${sections
    .flatMap((section) => section.paragraphs)
    .join(" ")}`;
  const articleVocabulary = (article.keyVocabulary ?? []).filter((word) =>
    containsWord(articleTextForVocabulary, word)
  );
  const secondLens = article.secondLens
    ? article.secondLens
    : article.bibleInsight
      ? {
          title: article.bibleInsight.title,
          discussionTitle: "Connected Reflection",
          discussionParagraphs: [article.bibleInsight.content],
          scriptureTitle: "Scripture",
          scriptureReference: article.bibleInsight.reference,
          scriptureVerses: []
        }
      : undefined;
  const secondLensVocabulary = (() => {
    if (!secondLens || !article.keyVocabulary || article.keyVocabulary.length === 0) return [];
    const discussionText = (secondLens.discussionParagraphs ?? secondLens.paragraphs ?? []).join(" ");
    const scriptureText = (secondLens.scriptureVerses ?? []).join(" ");
    const lensText = `${discussionText} ${scriptureText}`.toLowerCase();
    return article.keyVocabulary.filter((word) =>
      new RegExp(`\\b${escapeRegExp(word.toLowerCase())}\\b`, "i").test(lensText)
    );
  })();

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(10px)",
          backgroundColor: alpha(theme.palette.background.default, 0.8),
          borderBottom: "1px solid",
          borderColor: alpha(theme.palette.text.primary, 0.08)
        }}
      >
        <Container sx={{ py: 1.1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Tooltip title="Back">
              <IconButton onClick={() => navigate(`/?tab=${activeTab}`)}>
                <ArrowBackRoundedIcon />
              </IconButton>
            </Tooltip>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
              <Tooltip title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}>
                <IconButton size="small" aria-label="toggle theme mode" onClick={toggleMode}>
                  {mode === "light" ? <DarkModeRoundedIcon fontSize="small" /> : <LightModeRoundedIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title={isBookmarked ? "Bookmarked" : "Bookmark"}>
                <IconButton onClick={() => setBookmarks((current) => toggleListItem(current, article.id))}>
                  {isBookmarked ? <BookmarkRoundedIcon /> : <BookmarkBorderRoundedIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 3, sm: 5 } }}>
        <Box sx={{ maxWidth: "740px", mx: "auto" }}>
          <Stack spacing={1.5} sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography variant="h1" sx={{ fontSize: { xs: "1.85rem", sm: "2.2rem" } }}>
              {article.title}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
              <Chip
                label={`Level ${level}`}
                sx={
                  theme.palette.mode === "dark"
                    ? {
                        fontWeight: 600,
                        border: "1px solid rgba(255,255,255,0.14)",
                        color: "#F8F9FA",
                        backgroundColor:
                          level === 1 ? "#2A3248" : level === 2 ? "#21352D" : "#3B3023"
                      }
                    : levelChipSx(level)
                }
              />
              <Chip label={`${article.readingTime} min read`} variant="outlined" />
            </Box>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontStyle: "italic", lineHeight: 1.75 }}
            >
              {article.hook}
            </Typography>
          </Stack>

          <Box onMouseUp={handleTextSelection} onTouchEnd={handleTextSelection}>
            {sections.map((section, sectionIndex) => (
              <Box key={`${article.id}-section-${sectionIndex}`} sx={{ mb: 2.5 }}>
                {section.heading ? (
                  <Typography
                    variant="h3"
                    sx={{ fontSize: "1.12rem", mb: 1.2, mt: sectionIndex === 0 ? 0 : 1.2 }}
                  >
                    {section.heading}
                  </Typography>
                ) : null}
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <Typography
                    key={`${article.id}-${sectionIndex}-${paragraphIndex}`}
                    variant="body1"
                    sx={{
                      mb: 2.2,
                      fontSize: { xs: "1.02rem", sm: "1.08rem" },
                      lineHeight: 1.78
                    }}
                  >
                    {renderHighlightedText(paragraph, savedVocabulary, theme.palette.mode === "dark")}
                  </Typography>
                ))}
              </Box>
            ))}
          </Box>

          {articleVocabulary.length > 0 ? (
            <Box sx={{ mt: { xs: 3.5, sm: 4.5 } }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.2 }}>
                Words to remember
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {articleVocabulary.map((word) => {
                  const saved = savedVocabulary.includes(word);
                  return (
                    <Chip
                      key={word}
                      label={word}
                      clickable
                      color={saved ? "primary" : "default"}
                      variant={saved ? "filled" : "outlined"}
                      sx={
                        saved
                          ? {
                              bgcolor: theme.palette.mode === "dark" ? "#4A5A88" : "primary.main",
                              color: "#fff",
                              border: "1px solid",
                              borderColor: theme.palette.mode === "dark" ? "#6B7DB0" : "primary.dark",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.18)"
                            }
                          : undefined
                      }
                      onClick={() => setSavedVocabulary((current) => toggleListItem(current, word))}
                    />
                  );
                })}
              </Box>
            </Box>
          ) : null}

          {secondLens ? (
            <>
              <Box sx={{ my: { xs: 4, sm: 5 } }}>
                <Divider />
              </Box>

              <Paper
                elevation={0}
                onMouseUp={handleTextSelection}
                onTouchEnd={handleTextSelection}
                sx={{
                  p: { xs: 2.2, sm: 3 },
                  borderRadius: 3,
                  bgcolor: theme.palette.mode === "dark" ? "#22262D" : "#F0F1F3",
                  border: "1px solid",
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(0,0,0,0.05)"
                }}
              >
                <Stack spacing={1.2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AutoStoriesRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                    <Typography variant="h2" sx={{ fontSize: "1.2rem" }}>
                      {secondLens.title ?? "A Second Lens"}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 0.6 }}>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      sx={{ letterSpacing: "0.08em", display: "block", mb: 0.8 }}
                    >
                      {secondLens.discussionTitle ?? "Connected Discussion"}
                    </Typography>
                    {(secondLens.discussionParagraphs ?? secondLens.paragraphs ?? []).map((paragraph, index) => (
                      <Typography
                        key={`${article.id}-lens-discussion-${index}`}
                        variant="body1"
                        sx={{
                          mb: 1.4,
                          fontSize: { xs: "0.99rem", sm: "1.03rem" },
                          lineHeight: 1.75,
                          color: theme.palette.mode === "dark" ? "rgba(241,243,245,0.95)" : "text.primary"
                        }}
                      >
                        {renderHighlightedText(paragraph, savedVocabulary, theme.palette.mode === "dark")}
                      </Typography>
                    ))}
                  </Box>

                  {(secondLens.scriptureVerses?.length ?? 0) > 0 ? (
                    <Box
                      sx={{
                        mt: 0.8,
                        pt: 1.4,
                        borderTop: "1px solid",
                        borderColor: alpha(theme.palette.text.primary, 0.12)
                      }}
                    >
                      <Typography
                        variant="overline"
                        color="text.secondary"
                        sx={{ letterSpacing: "0.08em", display: "block", mb: 0.8 }}
                      >
                        {secondLens.scriptureTitle ?? "Scripture Text"}
                      </Typography>
                      {secondLens.scriptureReference ? (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.2 }}>
                          {secondLens.scriptureReference}
                        </Typography>
                      ) : null}
                      <Stack spacing={1}>
                        {secondLens.scriptureVerses.map((verse, index) => (
                          <Typography
                            key={`${article.id}-lens-scripture-${index}`}
                            variant="body2"
                            sx={{
                              lineHeight: 1.75,
                              color: theme.palette.mode === "dark" ? "rgba(241,243,245,0.92)" : "text.primary"
                            }}
                          >
                            {renderHighlightedText(verse, savedVocabulary, theme.palette.mode === "dark")}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  ) : null}

                  {secondLensVocabulary.length > 0 ? (
                    <Box sx={{ mt: 1.4, pt: 1.4, borderTop: "1px solid", borderColor: "divider" }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Words to remember
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {secondLensVocabulary.map((word) => {
                          const saved = savedVocabulary.includes(word);
                          return (
                            <Chip
                              key={`lens-word-${word}`}
                              label={word}
                              clickable
                              color={saved ? "primary" : "default"}
                              variant={saved ? "filled" : "outlined"}
                              sx={
                                saved
                                  ? {
                                      bgcolor: theme.palette.mode === "dark" ? "#4A5A88" : "primary.main",
                                      color: "#fff",
                                      border: "1px solid",
                                      borderColor: theme.palette.mode === "dark" ? "#6B7DB0" : "primary.dark",
                                      boxShadow: "0 1px 3px rgba(0,0,0,0.18)"
                                    }
                                  : undefined
                              }
                              onClick={() =>
                                setSavedVocabulary((current) => toggleListItem(current, word))
                              }
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  ) : null}
                </Stack>
              </Paper>
            </>
          ) : null}

          <Box sx={{ mt: 4.5, pt: 2.5, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.2 }}>
              Saved vocabulary ({savedVocabulary.length})
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {savedVocabulary.slice(0, 18).map((word) => (
                <Chip
                  key={word}
                  size="small"
                  label={word}
                  onDelete={() =>
                    setSavedVocabulary((current) => current.filter((savedWord) => savedWord !== word))
                  }
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ height: 40 }} />
        </Box>
      </Container>

      <Dialog open={isSaveDialogOpen} onClose={() => setIsSaveDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Save Vocabulary</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select words from your text selection.
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectionWords.map((word) => {
              const picked = pickedWords.includes(word);
              return (
                <Chip
                  key={word}
                  label={word}
                  clickable
                  color={picked ? "primary" : "default"}
                  variant={picked ? "filled" : "outlined"}
                  sx={
                    picked
                      ? {
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          border: "1px solid",
                          borderColor: "primary.dark",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.16)",
                          "&:hover": {
                            bgcolor: "primary.dark"
                          }
                        }
                      : {
                          bgcolor: "transparent",
                          borderColor: "rgba(0,0,0,0.18)",
                          "&:hover": {
                            bgcolor: "rgba(0,0,0,0.04)"
                          }
                        }
                  }
                  onClick={() => setPickedWords((current) => toggleListItem(current, word))}
                />
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setIsSaveDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveSelectedWords} variant="contained" disabled={pickedWords.length === 0}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
