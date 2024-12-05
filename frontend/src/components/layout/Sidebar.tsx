import { Box, Drawer, Typography, Toolbar } from "@mui/material";
import Navigation from "./Navigation";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  drawerWidth: number;
  open: boolean; // 改名為 open
  onDrawerToggle: () => void;
}

export default function Sidebar({
  drawerWidth,
  open, // 改名為 open
  onDrawerToggle,
}: SidebarProps) {
  const { user } = useAuth();

  const drawer = (
    <Box>
      <Toolbar />
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          component="img"
          src={user?.avatar || "/default-avatar.png"}
          alt="用戶頭像"
          sx={{ width: 50, height: 50, borderRadius: "50%" }}
        />
        <Typography variant="subtitle1">{user?.name}</Typography>
      </Box>
      <Navigation />
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: drawerWidth, flexShrink: { sm: 0 }, position: "relative" }}
    >
      <Drawer
        variant="permanent"
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            transform: open ? "none" : `translateX(-${drawerWidth}px)`,
            transition: "transform 0.3s ease-in-out",
          },
        }}
        open={open}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
