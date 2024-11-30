import { Snackbar, Alert } from "@mui/material";

interface ToastProps {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

export function Toast({ open, message, severity, onClose }: ToastProps) {
  console.log("Toast");
  
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        position: "fixed",
        zIndex: 9999,
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          boxShadow: 3,
        }}
        elevation={6}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
