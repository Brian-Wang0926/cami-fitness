// frontend/src/hooks/useDraggable.ts
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { WorkoutSection, WorkoutSet } from "@/types/workout";

type DraggableType = "exercise" | "set";

interface UseDraggableReturn {
  sensors: ReturnType<typeof useSensors>;
  handleDragEnd: (
    event: DragEndEvent,
    items: WorkoutSection[] | WorkoutSet[],
    type: DraggableType,
    onMove?: (oldIndex: number, newIndex: number) => void
  ) => WorkoutSection[] | WorkoutSet[];
}

export const useDraggable = (): UseDraggableReturn => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (
    event: DragEndEvent,
    items: WorkoutSection[] | WorkoutSet[],
    type: DraggableType,
    onMove?: (oldIndex: number, newIndex: number) => void
  ): WorkoutSection[] | WorkoutSet[] => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return items;
    }

    if (type === "exercise") {
      const sections = items as WorkoutSection[];
      let activeSection: WorkoutSection | undefined;
      let overSection: WorkoutSection | undefined;

      sections.forEach((section) => {
        if (section.exercises.some((ex) => ex.id === active.id)) {
          activeSection = section;
        }
        if (section.exercises.some((ex) => ex.id === over.id)) {
          overSection = section;
        }
      });

      if (
        !activeSection ||
        !overSection ||
        activeSection.id !== overSection.id
      ) {
        return sections;
      }

      const sectionExercises = [...activeSection.exercises];
      const oldIndex = sectionExercises.findIndex((ex) => ex.id === active.id);
      const newIndex = sectionExercises.findIndex((ex) => ex.id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return sections;
      }

      return sections.map((section) => {
        if (section.id === activeSection?.id) {
          return {
            ...section,
            exercises: arrayMove(sectionExercises, oldIndex, newIndex),
          };
        }
        return section;
      });
    } else {
      // 處理 set 的拖曳
      const sets = items as WorkoutSet[];
      const oldIndex = sets.findIndex((set) => set.id === active.id);
      const newIndex = sets.findIndex((set) => set.id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return sets;
      }

      if (onMove) {
        onMove(oldIndex, newIndex);
      }
      return arrayMove(sets, oldIndex, newIndex);
    }
  };

  return {
    sensors,
    handleDragEnd,
  };
};
