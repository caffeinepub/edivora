import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface HomeworkItem {
    id: string;
    subject: string;
    completed: boolean;
    dueDate: string;
    description: string;
}
export interface Lesson {
    day: bigint;
    title: string;
    content: string;
    subject: string;
    grade: bigint;
}
export interface QuizAttempt {
    answers: Array<bigint>;
    score: bigint;
    questions: Array<QuizQuestion>;
}
export interface QuizQuestion {
    question: string;
    subject: string;
    correctIndex: bigint;
    explanation: string;
    grade: bigint;
    options: Array<string>;
}
export interface UserProfile {
    subjects: Array<string>;
    name: string;
    voicePersona: string;
    grade: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addHomework(homeworkItem: HomeworkItem): Promise<void>;
    addLesson(lesson: Lesson): Promise<void>;
    addQuizQuestion(quiz: QuizQuestion): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAudio(): Promise<ExternalBlob | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCompletedLessons(): Promise<Array<string>>;
    getHomework(): Promise<Array<HomeworkItem>>;
    getLesson(grade: bigint, subject: string, day: bigint): Promise<Lesson | null>;
    getLessonTitles(grade: bigint, subject: string): Promise<Array<string>>;
    getProgressStats(): Promise<{
        completedQuizzes: bigint;
        completedLessons: bigint;
    }>;
    getQuestions(grade: bigint, subject: string): Promise<Array<QuizQuestion>>;
    getQuizHistory(): Promise<Array<QuizAttempt>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markHomeworkDone(homeworkId: string): Promise<void>;
    markLessonCompleted(lessonId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitAttempt(questions: Array<QuizQuestion>, answers: Array<bigint>): Promise<bigint>;
    uploadAudio(blob: ExternalBlob): Promise<void>;
}
