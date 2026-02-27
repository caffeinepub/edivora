import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { UserProfile, HomeworkItem, QuizQuestion, Lesson } from "../backend.d";
import { SAMPLE_LESSONS, SAMPLE_QUIZ_QUESTIONS } from "../data/sampleData";

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export function useGetProgressStats() {
  const { actor, isFetching } = useActor();
  return useQuery<{ completedQuizzes: bigint; completedLessons: bigint }>({
    queryKey: ["progressStats"],
    queryFn: async () => {
      if (!actor) return { completedQuizzes: 0n, completedLessons: 0n };
      return actor.getProgressStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCompletedLessons() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["completedLessons"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCompletedLessons();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkLessonCompleted() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.markLessonCompleted(lessonId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["completedLessons"] });
      queryClient.invalidateQueries({ queryKey: ["progressStats"] });
    },
  });
}

// ─── Lessons ──────────────────────────────────────────────────────────────────

export function useGetLessonTitles(grade: bigint, subject: string) {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["lessonTitles", grade.toString(), subject],
    queryFn: async () => {
      if (!actor) return [];
      const titles = await actor.getLessonTitles(grade, subject);
      if (titles.length > 0) return titles;
      // Fallback sample data
      const samples = SAMPLE_LESSONS[subject] ?? [];
      return samples.map((l) => l.title);
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

export function useGetLesson(grade: bigint, subject: string, day: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Lesson | null>({
    queryKey: ["lesson", grade.toString(), subject, day.toString()],
    queryFn: async () => {
      if (!actor) return null;
      const lesson = await actor.getLesson(grade, subject, day);
      if (lesson) return lesson;
      // Fallback sample data
      const samples = SAMPLE_LESSONS[subject] ?? [];
      return samples.find((l) => l.day === day) ?? null;
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export function useGetQuestions(grade: bigint, subject: string) {
  const { actor, isFetching } = useActor();
  return useQuery<QuizQuestion[]>({
    queryKey: ["questions", grade.toString(), subject],
    queryFn: async () => {
      if (!actor) return SAMPLE_QUIZ_QUESTIONS[subject] ?? [];
      const questions = await actor.getQuestions(grade, subject);
      if (questions.length > 0) return questions;
      return SAMPLE_QUIZ_QUESTIONS[subject] ?? [];
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

export function useSubmitAttempt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      questions,
      answers,
    }: {
      questions: QuizQuestion[];
      answers: bigint[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitAttempt(questions, answers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizHistory"] });
      queryClient.invalidateQueries({ queryKey: ["progressStats"] });
    },
  });
}

export function useGetQuizHistory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["quizHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuizHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Homework ─────────────────────────────────────────────────────────────────

export function useGetHomework() {
  const { actor, isFetching } = useActor();
  return useQuery<HomeworkItem[]>({
    queryKey: ["homework"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHomework();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddHomework() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: HomeworkItem) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addHomework(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homework"] });
    },
  });
}

export function useMarkHomeworkDone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (homeworkId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.markHomeworkDone(homeworkId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homework"] });
    },
  });
}
