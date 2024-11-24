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
import { useAuth } from "@/hooks/useAuth";

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuth();
  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const [validationError, setValidationError] = useState<string>("");

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    try {
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
            router.push("/");
          },
          onError: (error) => {
            setValidationError(error.message);
          },
        }
      );
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : "表單驗證失敗"
      );
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

        <Paper
          elevation={3}
          className="p-8 w-full"
          sx={{ width: "100%", maxWidth: "450px" }}
        >
          <Typography component="h1" variant="h5" className="text-center mb-6">
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
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
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
              {isLoading ? "登入中..." : "登入"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
