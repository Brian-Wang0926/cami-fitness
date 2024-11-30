"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/hooks/useAuth";
import { logger } from "@/lib/logger";
import { config } from "@/config";
import { Toast } from "@/components/common/Toast";
import { useToast } from "@/contexts/ToastContext";
import { LoginFormValues } from "@/types/auth";

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading, userError: authError } = useAuth();
  const { showToast, hideToast, toastState } = useToast();
  
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
    showPassword: false,
  });
  const [validationError, setValidationError] = useState<string>("");

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
      setValidationError("");
    };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      throw new Error("請輸入有效的電子郵件地址");
    }
    if (!values.email || !values.password) {
      throw new Error("請填寫電子郵件和密碼");
    }
    if (values.password.length < 6) {
      throw new Error("密碼長度至少需要6個字元");
    }
  };

  const handleGoogleLogin = () => {
    try {
      // 生成並儲存 state 參數用於防止 CSRF
      const state = crypto.randomUUID();
      sessionStorage.setItem("googleAuthState", state);

      // 將 state 作為查詢參數添加到 URL
      const googleAuthUrl = new URL(`${config.apiBaseUrl}/api/auth/google`);
      googleAuthUrl.searchParams.append("state", state);

      // 添加調試日誌
      console.log("Generated state:", state);
      console.log("Auth URL:", googleAuthUrl.toString());

      window.location.href = googleAuthUrl.toString();
    } catch (error) {
      showToast({
        type: "error",
        message: "無法連接到 Google 登入服務，請稍後再試",
      });
      logger.error("Google login error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    try {
      validateForm();

      logger.log("Login attempt");

      if (!values.email || !values.password) {
        throw new Error("請填寫電子郵件和密碼");
      }

      login(
        {
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: () => {
            showToast({
              type: "success",
              message: "登入成功！",
            });
            setTimeout(() => {
              router.push("/");
            }, 500);
          },
          onError: (error) => {
            logger.error("登入錯誤:", error.message);
            // 檢查是否為找不到帳號的錯誤
            if (error.message === "USER_NOT_FOUND") {
              // 顯示確認對話框
              const confirmRegister =
                window.confirm("找不到此帳號，是否要註冊新帳號？");
              if (confirmRegister) {
                // 將email帶入註冊頁面的參數中
                router.push(
                  `/register?email=${encodeURIComponent(values.email)}`
                );
              }
            } else {
              setValidationError(error.message);
              showToast({
                type: "error",
                message: error.message,
              });
            }
          },
        }
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "表單驗證失敗";
      setValidationError(errorMessage);
      showToast({
        type: "error",
        message: errorMessage,
      });
    }
  };

  // 提取錯誤訊息顯示邏輯
  const renderError = () => {
    const errorMessage =
      (authError instanceof Error ? authError.message : authError) ||
      validationError;
    if (!errorMessage) return null;

    return (
      <Typography color="error" className="mt-2">
        {errorMessage}
      </Typography>
    );
  };

  return (
    <>
      <Toast
        open={toastState.open}
        message={toastState.message}
        severity={toastState.severity}
        onClose={hideToast}
      />
      <Box className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Box className="w-full max-w-[450px] flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Typography
            component="h1"
            variant="h3"
            className="mb-8 font-bold text-primary"
          >
            cami-fitness
          </Typography>

          <Paper
            elevation={3}
            className="p-8 w-full"
            sx={{ width: "100%", maxWidth: "450px" }}
          >
            <Typography
              component="h1"
              variant="h5"
              className="text-center mb-6"
            >
              登入
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="電子郵件"
                name="email"
                autoComplete="email"
                autoFocus
                value={values.email}
                onChange={handleChange("email")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="密碼"
                type={values.showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange("password")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {renderError()}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="mt-6"
                disabled={isLoading}
              >
                {isLoading ? "登入中..." : "登入"}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FcGoogle />}
                onClick={handleGoogleLogin}
                className="mt-4"
              >
                使用 Google 帳號登入
              </Button>
              <Button
                fullWidth
                variant="text"
                className="mt-2"
                onClick={() => router.push("/register")}
              >
                還沒有帳號？立即註冊
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
