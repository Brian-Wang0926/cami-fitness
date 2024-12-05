import { AppBar, Toolbar, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

interface HeaderProps {
  drawerWidth: number;
  onDrawerToggle: () => void;
}

export default function Header({ onDrawerToggle }: HeaderProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "#4285f4",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2 }} // 移除 display 限制，讓漢堡選單在所有尺寸都顯示
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
