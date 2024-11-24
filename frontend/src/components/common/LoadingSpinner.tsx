"use client";

import { CircularProgress } from "@mui/material";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <CircularProgress />
    </div>
  );
}
