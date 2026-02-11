import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { Article } from "../types";

type BibleInsightCardProps = {
  insight: NonNullable<Article["bibleInsight"]>;
};

export default function BibleInsightCard({ insight }: BibleInsightCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        mt: 5,
        borderColor: "#d9dfd8",
        bgcolor: "#f7faf6"
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <AutoStoriesRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.1em" }}>
            {insight.title}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.9 }}>
          {insight.content}
        </Typography>
        {insight.reference && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>
            {insight.reference}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
