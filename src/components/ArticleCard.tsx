import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";

type DifficultyLevel = 1 | 2 | 3;

type ArticleCardProps = {
  title: string;
  excerpt: string;
  level: DifficultyLevel;
  readingMinutes?: number;
  onClick?: () => void;
};

const levelLabel: Record<DifficultyLevel, string> = {
  1: "Level 1",
  2: "Level 2",
  3: "Level 3"
};

export default function ArticleCard({
  title,
  excerpt,
  level,
  readingMinutes,
  onClick
}: ArticleCardProps) {
  const content = (
    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
      <Stack spacing={1.75}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, opacity: 0.85 }}>
          <Chip size="small" variant="outlined" label={levelLabel[level]} />
          {readingMinutes ? (
            <Chip
              size="small"
              variant="outlined"
              icon={<AccessTimeRoundedIcon />}
              label={`${readingMinutes} min read`}
            />
          ) : null}
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: "1.2rem", md: "1.28rem" },
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
            fontWeight: 600
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: "1rem",
            lineHeight: 1.8,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {excerpt}
        </Typography>
      </Stack>
    </CardContent>
  );

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "rgba(28,28,30,0.1)",
        borderRadius: 3,
        bgcolor: "background.paper",
        transition: "border-color 180ms ease, background-color 180ms ease",
        "&:hover": {
          borderColor: "rgba(28,28,30,0.18)",
          bgcolor: "#fcfcfd"
        }
      }}
    >
      {onClick ? (
        <CardActionArea onClick={onClick} sx={{ borderRadius: 3 }}>
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
}
