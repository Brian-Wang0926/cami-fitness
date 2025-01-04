import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect, useMemo } from "react";
import { CustomExerciseLibraryModal } from "./CustomExerciseLibraryModal";
import { ExerciseActionButtons } from "./ExerciseActionButtons";
import { exerciseLibraryService } from "@/services/exerciseLibraryService";
import {
  ExerciseLibrary,
  ExerciseLibrarySection,
  CreateExerciseLibrary,
} from "@/types/exerciseLibrary";

interface Props {
  open: boolean;
  onClose: () => void;
  onAddToWorkout: (exercise: ExerciseLibrary, sectionId: string) => void;
  onDelete?: (exercise: ExerciseLibrary) => void;
  sections: ExerciseLibrarySection[];
  category: "basic" | "strength" | "cardio";
  selectedSectionId: string;
  trainerId?: string;
}

// 新增 REST_EXERCISE_ID 常數
const REST_EXERCISE_ID = "21";

export function ExerciseLibraryModal({
  open,
  onClose,
  onAddToWorkout,
  category,
  selectedSectionId,
}: Props) {
  const [exercises, setExercises] = useState<ExerciseLibrary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseLibrary | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customModalMode, setCustomModalMode] = useState<
    "create" | "view" | "edit"
  >("create");
  const [selectedExerciseForModal, setSelectedExerciseForModal] =
    useState<ExerciseLibrary | null>(null);
  const showMuscleGroups = category === "strength";

  // 當模態框打開時獲取資料
  useEffect(() => {
    if (open || !isCustomModalOpen) {
      fetchExercisesLibrary();
    }
  }, [open, isCustomModalOpen]);

  const fetchExercisesLibrary = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response =
        await exerciseLibraryService.getExercisesLibrary(category);
      console.log("[fetchExercises]", response);
      // 驗證回應資料
      if (response && Array.isArray(response.exercisesLibrary)) {
        setExercises(response.exercisesLibrary);
      } else {
        console.error("Invalid response format:", response);
        setError("獲取動作資料格式錯誤");
      }
    } catch (error) {
      setError("獲取動作資料失敗");
      console.error("Error fetching exercises:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 用 useMemo 處理過濾邏輯
  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesTab =
        currentTab === "all" || exercise.muscle_group === currentTab;
      const matchesSearch =
        !searchTerm ||
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.equipment.toLowerCase().includes(searchTerm.toLowerCase());

      // 不在動作庫中顯示休息動作，因為有獨立按鈕
      const isNotRest = exercise.exercise_id !== REST_EXERCISE_ID;
     
      return matchesTab && matchesSearch && isNotRest;
    });
  }, [exercises, currentTab, searchTerm]);

  // 處理自定義動作的新增
  const handleAddCustomExercise = async (
    exerciseData: CreateExerciseLibrary
  ) => {
    try {
      const response =
        await exerciseLibraryService.createExerciseLibrary(exerciseData);
      console.log("Created exercise response:", response);

      // 更新本地狀態
      setExercises((prev) => [...prev, response]);
      setIsCustomModalOpen(false);
      setSelectedExercise(response);
    } catch (error) {
      console.error("Error creating exercise:", error);
      // 可以加入錯誤提示
    }
  };

  const handleSubmit = () => {
    if (!selectedExercise) return;
    console.log("Submitting exercise:", selectedExercise);

    onAddToWorkout(selectedExercise, selectedSectionId);

    setSelectedExercise(null);
    onClose();
  };

  const handleExerciseSelect = (exercise: ExerciseLibrary) => {
    setSelectedExercise(exercise);
  };

  // 新增處理函數
  const handleViewExercise = (exercise: ExerciseLibrary) => {
    setSelectedExerciseForModal(exercise);
    setCustomModalMode("view");
    setIsCustomModalOpen(true);
  };

  const handleEditExercise = (exercise: ExerciseLibrary) => {
    setSelectedExerciseForModal(exercise);
    setCustomModalMode("edit");
    setIsCustomModalOpen(true);
  };

  const handleDeleteExercise = async (exercise: ExerciseLibrary) => {
    try {
      await exerciseLibraryService.deleteExerciseLibrary(
        Number(exercise.exercise_id)
      );
      // 更新本地狀態,移除被刪除的動作
      setExercises((prevExercises) =>
        prevExercises.filter((e) => e.exercise_id !== exercise.exercise_id)
      );
    } catch (error) {
      console.error("Error deleting exercise:", error);
      setError("刪除動作失敗");
    }
  };

  const handleOpenAddCustomModal = () => {
    setSelectedExerciseForModal(null); // 清空選中的動作
    setCustomModalMode("create"); // 設置為新增模式
    setIsCustomModalOpen(true); // 打開模態框
  };

  const handleCloseCustomModal = () => {
    setIsCustomModalOpen(false);
    setSelectedExerciseForModal(null);
    setCustomModalMode("create");
  };

  const handleEditSubmit = async (
    id: string,
    exerciseData: Partial<ExerciseLibrary>
  ) => {
    try {
      const updatedExercise =
        await exerciseLibraryService.updateExerciseLibrary(
          Number(id),
          exerciseData
        );
      // 更新本地狀態
      setExercises((prev) =>
        prev.map((exercise) =>
          exercise.exercise_id === id ? updatedExercise : exercise
        )
      );
      setIsCustomModalOpen(false);
    } catch (error) {
      console.error("Error updating exercise:", error);
      setError("修改動作失敗");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            maxHeight: "90vh",
          }}
        >
          {/* 頂部固定區域 */}
          <Box sx={{ p: 4, pb: 2 }}>
            <IconButton
              sx={{ position: "absolute", right: 8, top: 8 }}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6" gutterBottom>
              動作庫
            </Typography>
            {/* 只在 strength 類型時顯示肌群分類 */}
            {showMuscleGroups ? (
              <Tabs
                value={currentTab}
                onChange={(_, newValue) => setCurrentTab(newValue)}
                sx={{ mb: 2 }}
              >
                <Tab label="全部" value="all" />
                <Tab label="胸部" value="胸部" />
                <Tab label="背部" value="背部" />
                <Tab label="腿部" value="腿部" />
                <Tab label="肩部" value="肩部" />
                <Tab label="手臂" value="手臂" />
                <Tab label="核心" value="核心" />
                <Tab label="全身" value="全身" />
              </Tabs>
            ) : null}

            <TextField
              fullWidth
              variant="outlined"
              placeholder="搜尋動作或器材..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* 動作列表可滾動區域 */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              px: 4,
              pb: 2,
            }}
          >
            <Grid container spacing={2}>
              {" "}
              {/* 新增這一層 */}
              {/* 新增自定義動作卡片 */}
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  onClick={handleOpenAddCustomModal}
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    bgcolor: "action.hover",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <AddIcon sx={{ fontSize: 40 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              {/* 動作卡片列表 */}
              {filteredExercises.map((exercise) => (
                <Grid item xs={12} sm={6} md={4} key={exercise.exercise_id}>
                  <Card
                    onClick={() => handleExerciseSelect(exercise)}
                    sx={{
                      cursor: "pointer",
                      height: "100%",
                      border:
                        selectedExercise?.exercise_id === exercise.exercise_id
                          ? 2
                          : 0,
                      borderColor: "primary.main",
                      position: "relative",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {exercise.name}
                            {exercise.created_by && (
                              <Typography
                                component="span"
                                color="primary"
                                sx={{ ml: 1, fontSize: "0.8rem" }}
                              >
                                (自定義)
                              </Typography>
                            )}
                          </Typography>
                          <Typography color="textSecondary">
                            器材：{exercise.equipment}
                          </Typography>
                          <Typography color="textSecondary">
                            肌群：{exercise.muscle_group}
                          </Typography>
                        </Box>
                        <ExerciseActionButtons
                          exercise={exercise}
                          onView={handleViewExercise}
                          onEdit={handleEditExercise}
                          onDelete={handleDeleteExercise}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* 底部固定區域 */}
          <Box sx={{ p: 4, pt: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: 1,
                borderColor: "divider",
                pt: 2,
              }}
            >
              <Box>
                <Button sx={{ mr: 2 }} onClick={onClose}>
                  取消
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!selectedExercise}
                >
                  確定新增
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <CustomExerciseLibraryModal
          open={isCustomModalOpen}
          onClose={handleCloseCustomModal}
          onAddCustomExercise={handleAddCustomExercise}
          initialData={selectedExerciseForModal}
          onEditExercise={handleEditSubmit}
          mode={customModalMode}
          category={category}
        />
      </div>
    </Modal>
  );
}
