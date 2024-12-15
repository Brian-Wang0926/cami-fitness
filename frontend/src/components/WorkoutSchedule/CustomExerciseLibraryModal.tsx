import { ExerciseLibrary } from "@/types/exerciseLibrary";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onAddCustomExercise: (exercise: {
    name: string;
    equipment: string;
    muscle_group: string;
    description: string;
    difficulty_level: string;
    category: string;
  }) => void;
  onEditExercise?: (
    id: string,
    exercise: {
      name: string;
      equipment: string;
      muscle_group: string;
      description: string;
      difficulty_level: string;
      category: string;
    }
  ) => void;
  initialData?: ExerciseLibrary | null; // 用於編輯時的初始資料
  mode?: "create" | "view" | "edit"; // 模式控制
  category: "basic" | "strength" | "cardio";
}

// 預設的器材列表
const EQUIPMENT_OPTIONS = [
  "徒手",
  "啞鈴",
  "槓鈴",
  "健身器械",
  "彈力帶",
  "瑜珈墊",
  "瑜珈球",
  "TRX",
  "其他",
];

// 預設的肌群列表
const MUSCLE_GROUPS = ["胸部", "背部", "腿部", "肩部", "手臂", "核心", "全身"];

export function CustomExerciseLibraryModal({
  open,
  onClose,
  onAddCustomExercise,
  onEditExercise,
  initialData,
  mode = "create",
  category,
}: Props) {
  // 新增表單資料的初始化邏輯
  const getInitialFormData = () => ({
    name: "",
    equipment: "",
    muscle_group: category === "strength" ? "" : "全身",
    description: "",
    difficulty_level: "beginner",
    category, // 使用傳入的 category
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === "create") {
      setFormData({
        name: "",
        equipment: "",
        muscle_group: category === "strength" ? "" : "全身",
        description: "",
        difficulty_level: "beginner",
        category: category,
      });
    }
  }, [mode, category]);

  useEffect(() => {
    if (initialData) {
      const categoryValue = initialData.category as
        | "basic"
        | "strength"
        | "cardio";
      setFormData({
        name: initialData.name,
        equipment: initialData.equipment,
        muscle_group: initialData.muscle_group,
        description: initialData.description || "",
        difficulty_level: initialData.difficulty_level || "beginner",
        category: categoryValue || category, // 使用傳入的 category 作為後備
      });
    }
  }, [initialData, category]);

  // 根據 category 決定肌群選項
  const getMuscleGroupValue = () => {
    if (category === "strength") {
      return formData.muscle_group;
    }
    return "全身";
  };

  // 根據模式決定標題
  const getModalTitle = () => {
    switch (mode) {
      case "view":
        return "查看動作詳細";
      case "edit":
        return "編輯動作";
      default:
        return "新增自定義動作";
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "動作名稱為必填";
    if (!formData.equipment) newErrors.equipment = "請選擇器材";
    if (!formData.muscle_group) newErrors.muscle_group = "請選擇目標肌群";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        category, // 確保使用傳入的 category
        muscle_group: category === "strength" ? formData.muscle_group : "全身",
      };

      if (mode === "edit" && initialData && onEditExercise) {
        await onEditExercise(initialData.exercise_id, submissionData);
      } else {
        await onAddCustomExercise(submissionData);
      }

      setFormData(getInitialFormData());
      onClose();
    } catch (err: any) {
      setErrors(
        err.response?.data?.message ||
          `${mode === "edit" ? "修改" : "新增"}失敗，請稍後再試`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {getModalTitle()}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="動作名稱"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={mode === "view"}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>器材</InputLabel>
                <Select
                  value={formData.equipment}
                  onChange={(e) =>
                    setFormData({ ...formData, equipment: e.target.value })
                  }
                  disabled={mode === "view"}
                >
                  {EQUIPMENT_OPTIONS.map((eq) => (
                    <MenuItem key={eq} value={eq}>
                      {eq}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>目標肌群</InputLabel>
                <Select
                  value={getMuscleGroupValue()}
                  onChange={(e) =>
                    setFormData({ ...formData, muscle_group: e.target.value })
                  }
                  disabled={category !== "strength" || mode === "view"}
                >
                  {category === "strength" ? (
                    MUSCLE_GROUPS.map((muscle) => (
                      <MenuItem key={muscle} value={muscle}>
                        {muscle}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="全身">全身</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="動作描述"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={mode === "view"}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>難度</InputLabel>
                <Select
                  value={formData.difficulty_level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty_level: e.target.value,
                    })
                  }
                  disabled={mode === "view"}
                >
                  <MenuItem value="beginner">初級</MenuItem>
                  <MenuItem value="intermediate">中級</MenuItem>
                  <MenuItem value="advanced">高級</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* 分類欄位 - 禁用且顯示當前分類 */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>分類</InputLabel>
                <Select value={category} disabled>
                  <MenuItem value={category}>
                    {category === "basic" && "基本"}
                    {category === "strength" && "肌力"}
                    {category === "cardio" && "有氧"}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button onClick={onClose}>
              {mode === "view" ? "關閉" : "取消"}
            </Button>
            {mode !== "view" && (
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {mode === "edit" ? "儲存" : "新增"}
              </Button>
            )}
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
