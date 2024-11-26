"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerAsync, isLoading, userError: authError } = useAuth();
  const [values, setValues] = useState({
    email: searchParams.get("email") || "",
    password: "",
    confirmPassword: "",
    name: "",
    gender: "",
    birth: "",
    showPassword: false,
    showConfirmPassword: false,
  });
  const [validationError, setValidationError] = useState<string>("");

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = (field: "password" | "confirmPassword") => {
    setValues({
      ...values,
      [field === "password" ? "showPassword" : "showConfirmPassword"]:
        !values[field === "password" ? "showPassword" : "showConfirmPassword"],
    });
  };

  const validateForm = () => {
    // Email 格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      throw new Error("請輸入有效的電子郵件地址");
    }
    // 生日驗證
    if (values.birth) {
      const birthDate = new Date(values.birth);
      const today = new Date();
      if (birthDate > today) {
        throw new Error("生日不可大於今天");
      }
    }
    if (!values.email || !values.password || !values.name) {
      throw new Error("請填寫必要欄位");
    }
    if (values.password !== values.confirmPassword) {
      throw new Error("密碼與確認密碼不符");
    }
    if (values.password.length < 6) {
      throw new Error("密碼長度至少需要6個字元");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    try {
      validateForm();

      const result = await registerAsync({
        email: values.email,
        password: values.password,
        name: values.name,
        gender: values.gender || undefined,
        birth: values.birth ? new Date(values.birth) : undefined,
      });

      if (result.success) {
        // 註冊並自動登入成功，導向首頁
        router.push("/");
      } else {
        // 註冊成功但自動登入失敗
        setValidationError("自動登入失敗，請手動登入");
        router.push("/login");
      }
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : "註冊失敗");
    }
  };

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Box className="w-full max-w-[450px] flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Typography
          component="h1"
          variant="h3"
          className="mb-8 font-bold text-primary"
        >
          cami-fitness
        </Typography>

        <Paper elevation={3} className="p-8 w-full">
          <Typography component="h1" variant="h5" className="text-center mb-6">
            註冊帳號
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
              value={values.email}
              onChange={handleChange("email")}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="姓名"
              id="name"
              value={values.name}
              onChange={handleChange("name")}
              slotProps={{
                input: {
                  autoComplete: "name",
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                },
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
              value={values.password}
              onChange={handleChange("password")}
              slotProps={{
                input: {
                  autoComplete: "new-password",
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleClickShowPassword("password")}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="確認密碼"
              type={values.showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              slotProps={{
                input: {
                  autoComplete: "new-password",
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleClickShowPassword("password")}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="gender-label">性別</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                value={values.gender}
                label="性別"
                onChange={(e) =>
                  setValues({ ...values, gender: e.target.value })
                }
              >
                <MenuItem value="male">男</MenuItem>
                <MenuItem value="female">女</MenuItem>
                <MenuItem value="other">其他</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              fullWidth
              id="birth"
              label="生日"
              type="date"
              value={values.birth}
              onChange={handleChange("birth")}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: new Date().toISOString().split("T")[0], // 設置最大日期為今天
              }}
            />

            {(authError || validationError) && (
              <Typography color="error" className="mt-2">
                {(authError instanceof Error ? authError.message : authError) ||
                  validationError}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="mt-6"
              disabled={isLoading}
            >
              {isLoading ? "註冊中..." : "註冊"}
            </Button>

            <Button
              fullWidth
              variant="text"
              className="mt-2"
              onClick={() => router.push("/login")}
            >
              已有帳號？登入
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
