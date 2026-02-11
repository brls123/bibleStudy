import { Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import ArticleListPage from "./pages/ArticleListPage";
import ArticlePage from "./pages/ArticlePage";
import GlobalBottomNav from "./components/GlobalBottomNav";

export default function App() {
  return (
    <Box sx={{ minHeight: "100vh", pb: 9 }}>
      <Routes>
        <Route path="/" element={<ArticleListPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <GlobalBottomNav />
    </Box>
  );
}
