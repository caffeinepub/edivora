import { useNavigate, useParams } from "@tanstack/react-router";
import {
  useGetCallerUserProfile,
  useGetLessonTitles,
  useGetCompletedLessons,
} from "../hooks/useQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import AppLayout from "../components/AppLayout";
import { SUBJECT_ICONS, SUBJECT_COLORS } from "../data/sampleData";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Circle, ChevronRight, ArrowLeft } from "lucide-react";

export default function LessonListPage() {
  const navigate = useNavigate();
  const { subject } = useParams({ strict: false }) as { subject: string };
  const decodedSubject = decodeURIComponent(subject ?? "");
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const grade = profile?.grade ?? 8n;

  const { data: titles, isLoading } = useGetLessonTitles(grade, decodedSubject);
  const { data: completedLessons } = useGetCompletedLessons();

  if (!identity) {
    navigate({ to: "/" });
    return null;
  }

  const lessonTitles = titles && titles.length > 0
    ? titles
    : [
        `Introduction to ${decodedSubject}`,
        `${decodedSubject} Fundamentals`,
        `Advanced ${decodedSubject} Concepts`,
      ];

  const isLessonCompleted = (index: number) => {
    const lessonId = `${decodedSubject}-${grade.toString()}-day-${index + 1}`;
    return completedLessons?.includes(lessonId) ?? false;
  };

  return (
    <AppLayout userProfile={profile ? { name: profile.name, grade: profile.grade } : null}>
      {/* Back button + Header */}
      <div className="mb-6 animate-fade-in-up">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/subjects" })}
          className="gap-2 rounded-xl mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Subjects
        </Button>

        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${SUBJECT_COLORS[decodedSubject] ?? "from-purple-400 to-indigo-500"} flex items-center justify-center text-3xl shadow-sm`}
          >
            {SUBJECT_ICONS[decodedSubject] ?? "📖"}
          </div>
          <div>
            <h1 className="font-display text-3xl font-extrabold text-foreground">{decodedSubject}</h1>
            <p className="text-muted-foreground">
              Grade {grade.toString()} • {lessonTitles.length} lessons
            </p>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-3 animate-fade-in-up stagger-1">
        {isLoading ? (
          Array.from({ length: 5 }, (_, i) => `sk-${i}`).map((key) => (
            <Skeleton key={key} className="h-20 rounded-2xl" />
          ))
        ) : (
          lessonTitles.map((title, index) => {
            const day = index + 1;
            const completed = isLessonCompleted(index);
            return (
              <button
                key={day}
                type="button"
                onClick={() =>
                  navigate({
                    to: `/subjects/${encodeURIComponent(decodedSubject)}/lessons/${day}`,
                  })
                }
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md hover:border-primary group ${
                  completed
                    ? "border-green-200 bg-green-50/50 dark:bg-green-950/20"
                    : "border-border bg-card hover:bg-secondary/30"
                }`}
              >
                {/* Day Badge */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    completed
                      ? "bg-green-500 text-white"
                      : "edivora-gradient text-white"
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    `D${day}`
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      Day {day}
                    </span>
                    {completed && (
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        Completed ✓
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground truncate">{title}</h3>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </button>
            );
          })
        )}
      </div>

      {/* Footer CTA */}
      <div className="mt-8 p-6 bg-secondary/50 rounded-2xl text-center animate-fade-in-up stagger-3">
        <p className="text-muted-foreground mb-3 font-medium">Ready to test your knowledge?</p>
        <Button
          onClick={() => navigate({ to: `/subjects/${encodeURIComponent(decodedSubject)}/quiz` })}
          className="rounded-xl edivora-gradient gap-2"
        >
          <span>🧠</span>
          Take the Quiz
        </Button>
      </div>
    </AppLayout>
  );
}
