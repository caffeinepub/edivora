import { useNavigate } from "@tanstack/react-router";
import {
  useGetCallerUserProfile,
  useGetProgressStats,
  useGetQuizHistory,
  useGetCompletedLessons,
} from "../hooks/useQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import AppLayout from "../components/AppLayout";
import { SUBJECT_ICONS, SUBJECT_COLORS } from "../data/sampleData";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, BookOpen, Brain, TrendingUp, Star } from "lucide-react";

export default function ProgressPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: stats, isLoading: statsLoading } = useGetProgressStats();
  const { data: quizHistory, isLoading: historyLoading } = useGetQuizHistory();
  const { data: completedLessons } = useGetCompletedLessons();

  if (!identity) {
    navigate({ to: "/" });
    return null;
  }

  const subjects = profile?.subjects ?? [];
  const grade = profile?.grade ?? 8n;

  const getSubjectProgress = (subject: string) => {
    if (!completedLessons) return 0;
    const subjectLessons = completedLessons.filter((id) =>
      id.startsWith(`${subject}-${grade.toString()}-`)
    );
    // Estimate 10 lessons per subject max for progress %
    return Math.min((subjectLessons.length / 10) * 100, 100);
  };

  const completedCount = Number(stats?.completedLessons ?? 0n);
  const quizCount = Number(stats?.completedQuizzes ?? 0n);
  const totalScore = quizHistory?.reduce((acc, q) => acc + Number(q.score), 0) ?? 0;
  const avgScore =
    quizHistory && quizHistory.length > 0
      ? Math.round(totalScore / quizHistory.length)
      : 0;

  return (
    <AppLayout userProfile={profile ? { name: profile.name, grade: profile.grade } : null}>
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="font-display text-3xl font-extrabold text-foreground flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-primary" />
          My Progress
        </h1>
        <p className="text-muted-foreground mt-1">Track your learning journey</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up stagger-1">
        {[
          {
            icon: <BookOpen className="w-6 h-6" />,
            label: "Lessons Completed",
            value: statsLoading ? "..." : completedCount.toString(),
            color: "oklch(0.46 0.22 280)",
            bg: "oklch(0.92 0.05 280)",
          },
          {
            icon: <Brain className="w-6 h-6" />,
            label: "Quizzes Taken",
            value: statsLoading ? "..." : quizCount.toString(),
            color: "oklch(0.42 0.2 195)",
            bg: "oklch(0.92 0.08 195)",
          },
          {
            icon: <Star className="w-6 h-6" />,
            label: "Avg Quiz Score",
            value: historyLoading ? "..." : `${avgScore}`,
            color: "oklch(0.6 0.18 155)",
            bg: "oklch(0.93 0.07 155)",
          },
          {
            icon: <Trophy className="w-6 h-6" />,
            label: "Subjects Enrolled",
            value: profileLoading ? "..." : subjects.length.toString(),
            color: "oklch(0.65 0.2 340)",
            bg: "oklch(0.94 0.07 340)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: stat.bg, color: stat.color }}
            >
              {stat.icon}
            </div>
            <div>
              <div
                className="text-2xl font-extrabold font-display"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground font-medium leading-tight">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subject Progress */}
        <div>
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Subject Progress</h2>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            {profileLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
              </div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No subjects enrolled yet</p>
              </div>
            ) : (
              subjects.map((subject) => {
                const progress = getSubjectProgress(subject);
                return (
                  <div key={subject}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{SUBJECT_ICONS[subject] ?? "📖"}</span>
                        <span className="font-semibold text-foreground">{subject}</span>
                      </div>
                      <span className="text-sm font-bold text-muted-foreground">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r ${SUBJECT_COLORS[subject] ?? "from-purple-400 to-indigo-500"}`}
                      style={{
                        width: `${Math.max(progress, 3)}%`,
                        transition: "width 1s ease-out",
                      }}
                    />
                    <div className="h-3 rounded-full bg-secondary -mt-3" style={{ zIndex: -1 }} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quiz History */}
        <div>
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Quiz History</h2>
          <div className="bg-card border border-border rounded-2xl p-6">
            {historyLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
              </div>
            ) : !quizHistory?.length ? (
              <div className="text-center py-8">
                <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold text-foreground">No quizzes taken yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Take your first quiz to see results here
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {quizHistory.map((attempt, i) => {
                  const total = attempt.questions.length;
                  const score = Number(attempt.score);
                  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
                  const subject =
                    attempt.questions[0]?.subject ?? "Unknown";
                  const attemptKey = `attempt-${i}-${subject}-${score}`;

                  return (
                    <div
                      key={attemptKey}
                      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl`}
                        style={{ background: "oklch(0.92 0.05 280)" }}
                      >
                        {SUBJECT_ICONS[subject] ?? "📖"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground text-sm">{subject}</span>
                          <span
                            className="text-sm font-bold"
                            style={{
                              color:
                                pct >= 70
                                  ? "oklch(0.55 0.18 155)"
                                  : pct >= 50
                                  ? "oklch(0.42 0.2 195)"
                                  : "oklch(0.6 0.22 27)",
                            }}
                          >
                            {score}/{total}
                          </span>
                        </div>
                        <Progress value={pct} className="h-1.5 mt-2 rounded-full" />
                        <div className="text-xs text-muted-foreground mt-1">{pct}% correct</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Encouragement Banner */}
      <div className="mt-8 edivora-gradient rounded-2xl p-6 text-white text-center animate-fade-in-up stagger-3">
        <div className="text-4xl mb-3">🚀</div>
        <h3 className="font-display text-xl font-bold mb-2">
          {completedCount > 5
            ? "Amazing Progress! Keep Going!"
            : "You're Just Getting Started!"}
        </h3>
        <p className="text-white/80 text-sm">
          {completedCount > 0
            ? `You've completed ${completedCount} lesson${completedCount !== 1 ? "s" : ""}. Every lesson brings you closer to your goals!`
            : "Start with Day 1 of any subject and build your knowledge step by step!"}
        </p>
      </div>
    </AppLayout>
  );
}
