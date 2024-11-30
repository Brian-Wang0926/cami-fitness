// src/contexts/ToastContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { AlertColor } from "@mui/material";
import { Toast } from "@/components/common/Toast";

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface ToastContextType {
  showToast: (params: { type: AlertColor; message: string }) => void;
  hideToast: () => void;
  toastState: ToastState;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toastState, setToastState] = useState<ToastState>({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = useCallback(
    ({
      type,
      message,
    }: {
      type: "success" | "error" | "info" | "warning";
      message: string;
    }) => {
      setToastState({
        open: true,
        message,
        severity: type,
      });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToastState((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, toastState }}>
      {children}
      <Toast
        open={toastState.open}
        message={toastState.message}
        severity={toastState.severity}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
