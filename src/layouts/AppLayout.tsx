import { ReactNode } from "react";
import { Box, Container } from "@mui/material";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 3, md: 6 } }}>
      <Container maxWidth="md">{children}</Container>
    </Box>
  );
}
