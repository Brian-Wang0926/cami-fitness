// 子組件: SetTableHeader
// frontend/src/components/WorkoutSchedule/SetTableHeader.tsx
import { Typography, Box } from "@mui/material";

export function SetTableHeader() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "30px 30px 60px 1fr 1fr 1fr 80px",
        gap: 1,
        mb: 1,
        pl: 1,
        "& .MuiTypography-root": {
          fontWeight: 500,
          fontSize: "0.875rem",
          color: "white",
        },
      }}
    >
      <Typography></Typography>
      <Typography></Typography>
      <Typography>#</Typography>
      <Typography>重量(kg)</Typography>
      <Typography>次數</Typography>
      <Typography>時間</Typography>
      <Typography>疲勞度</Typography>
    </Box>
  );
}
