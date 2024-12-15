"use client";
import { Box, Container } from "@mui/material";
import { WorkoutSchedule } from "@/components/WorkoutSchedule";
import AppLayout from "@/components/layout/AppLayout";

function CourseManagementPage() {
  return (
    <AppLayout>
      <Container>
        <Box sx={{ mt: 4 }}>
          <WorkoutSchedule />
        </Box>
      </Container>
    </AppLayout>
  );
}

export default CourseManagementPage;
