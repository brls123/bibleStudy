import { useMemo } from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import ArticleList from "../components/ArticleList";
import rawArticles from "../data/articles.json";
import { useLocalStorage } from "../hooks/useLocalStorage";
import AppLayout from "../layouts/AppLayout";
import { Article } from "../types";
import { toggleListItem } from "../utils/toggleListItem";

const articles = rawArticles as Article[];

export default function ArticleListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>("reading_mvp_bookmarks", []);
  const [savedVocabulary] = useLocalStorage<string[]>("reading_mvp_vocabulary", []);
  const tab = (() => {
    const current = searchParams.get("tab");
    if (current === "bookmarks" || current === "words" || current === "discover") {
      return current;
    }
    return "discover";
  })();
  const bookmarkedArticles = useMemo(
    () => articles.filter((article) => bookmarks.includes(article.id)),
    [bookmarks]
  );
  const wordsByLesson = useMemo(
    () =>
      articles
        .map((article) => {
          const lessonWords = (article.keyVocabulary ?? []).filter((word) =>
            savedVocabulary.includes(word)
          );
          return { article, lessonWords };
        })
        .filter((entry) => entry.lessonWords.length > 0),
    [savedVocabulary]
  );
  const uncategorizedWords = useMemo(() => {
    const knownWords = new Set(
      articles.flatMap((article) => article.keyVocabulary ?? []).map((word) => word.toLowerCase())
    );
    return savedVocabulary.filter((word) => !knownWords.has(word.toLowerCase()));
  }, [savedVocabulary]);

  return (
    <AppLayout>
      <Stack spacing={3.5}>
        <AppHeader bookmarkCount={bookmarks.length} vocabCount={savedVocabulary.length} />

        <Box sx={{ pt: 0.5 }}>
          {tab === "discover" ? (
            <>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ letterSpacing: "0.1em", display: "block", mb: 0.6 }}
              >
                Daily Selection
              </Typography>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, letterSpacing: "0.002em" }}>
                Read in 5 minutes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.75 }}>
                Calm, bite-sized stories with gentle difficulty progression.
              </Typography>
              <ArticleList
                articles={articles}
                selectedArticleId=""
                bookmarks={bookmarks}
                onSelect={(id) => navigate(`/article/${id}?tab=${tab}`)}
                onToggleBookmark={(id) => setBookmarks((current) => toggleListItem(current, id))}
              />
            </>
          ) : null}

          {tab === "bookmarks" ? (
            <>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Saved Articles
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your bookmarked reads in one place.
              </Typography>
              {bookmarkedArticles.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No bookmarked articles yet.
                </Typography>
              ) : (
                <ArticleList
                  articles={bookmarkedArticles}
                  selectedArticleId=""
                  bookmarks={bookmarks}
                  onSelect={(id) => navigate(`/article/${id}?tab=${tab}`)}
                  onToggleBookmark={(id) => setBookmarks((current) => toggleListItem(current, id))}
                />
              )}
            </>
          ) : null}

          {tab === "words" ? (
            <>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Saved Words
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Tap a word in any article to build your vocabulary list.
              </Typography>
              {savedVocabulary.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No saved words yet.
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  {wordsByLesson.map(({ article, lessonWords }) => (
                    <Box
                      key={article.id}
                      onClick={() => navigate(`/article/${article.id}?tab=words`)}
                      sx={{
                        p: 1.8,
                        border: "1px solid rgba(0,0,0,0.08)",
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "background-color 150ms ease, border-color 150ms ease",
                        "&:hover": {
                          bgcolor: "rgba(0,0,0,0.015)",
                          borderColor: "rgba(0,0,0,0.16)"
                        }
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        {article.title}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                        {lessonWords.map((word) => (
                          <Chip key={`${article.id}-${word}`} size="small" label={word} />
                        ))}
                      </Box>
                    </Box>
                  ))}

                  {uncategorizedWords.length > 0 ? (
                    <Box
                      sx={{
                        p: 1.8,
                        border: "1px dashed rgba(0,0,0,0.12)",
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Other Saved Words
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                        {uncategorizedWords.map((word) => (
                          <Chip key={`misc-${word}`} size="small" label={word} />
                        ))}
                      </Box>
                    </Box>
                  ) : null}
                </Stack>
              )}
            </>
          ) : null}
        </Box>
      </Stack>
    </AppLayout>
  );
}
