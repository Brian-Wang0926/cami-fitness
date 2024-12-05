// src/app/profile/page.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/layout/AppLayout";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
} from "@mui/material";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Card sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} display="flex" justifyContent="center">
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={user?.photoURL || ""}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" align="center">
                  {user?.displayName}
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="textSecondary"
                >
                  {user?.email}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
}
