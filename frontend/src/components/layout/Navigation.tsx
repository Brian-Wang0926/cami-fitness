// src/components/layout/Navigation.tsx
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
} from "@mui/material";
import {
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  FitnessCenter as FitnessCenterIcon,
  EventNote as EventNoteIcon,
  Payment as PaymentIcon,
  Assignment as AssignmentIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

export default function Navigation() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // 處理登出
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("登出失敗:", error);
    }
  };

  // 共用選單項目
  const commonMenuItems = [
    { text: "個人資料", icon: <PersonIcon />, path: "/profile" },
    { text: "課程行事曆", icon: <CalendarIcon />, path: "/calendar" },
    { text: "課程管理", icon: <EventNoteIcon />, path: "/course-management" },
  ];

  // 學生專屬選單項目
  // const studentMenuItems = [
  //   { text: "我的課表", icon: <EventNoteIcon />, path: "/my-schedule" },
  //   { text: "課程紀錄", icon: <AssignmentIcon />, path: "/course-history" },
  //   { text: "體能數據", icon: <FitnessCenterIcon />, path: "/fitness-data" },
  //   { text: "付款紀錄", icon: <PaymentIcon />, path: "/payment-history" },
  // ];

  // // 教練專屬選單項目
  // const trainerMenuItems = [
  //   { text: "我的學生", icon: <SchoolIcon />, path: "/my-students" },
  //   { text: "課程管理", icon: <EventNoteIcon />, path: "/course-management" },
  //   { text: "學生課表", icon: <AssessmentIcon />, path: "/student-schedules" },
  //   { text: "業績統計", icon: <AssignmentIcon />, path: "/performance" },
  //   { text: "收款紀錄", icon: <PaymentIcon />, path: "/payment-records" },
  // ];

  // 根據用戶角色選擇顯示的選單項目
  const menuItems = [
    ...commonMenuItems,
    // ...(user?.role === "trainer" ? trainerMenuItems : studentMenuItems),
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => router.push(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* 登出按鈕區域 */}
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="登出" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
