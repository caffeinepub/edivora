import { useNavigate } from "@tanstack/react-router";
import { useGetCallerUserProfile, useGetProgressStats, useGetHomework, useMarkHomeworkDone } from "../hooks/useQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import AppLayout from "../components/AppLayout";
import { SUBJECT_ICONS, SUBJECT_COLORS } from "../data/sampleData";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  BookOpen,
  Brain,
  PlusCircle,
  Calendar,
  Play,
  Trophy,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: stats, isLoading: statsLoading } = useGetProgressStats();
  const { data: homework, isLoading: hwLoading } = useGetHomework();
  const markDone = useMarkHomeworkDone();

  if (!identity) {
    navigate({ to: "/" });
    return null;
  }

  const pendingHw = homework?.filter((h) => !h.completed).slice(0, 5) ?? [];

  const handleMarkDone = async (id: string) => {
    try {
      await markDone.mutateAsync(id);
      toast.success("Homework marked as done! ✅");
    } catch {
      toast.error("Failed to update homework");
    }
  };

  const greetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "☀️";
    if (hour < 17) return "🌤️";
    return "🌙";
  };

  return (
    <AppLayout userProfile={profile ? { name: profile.name, grade: profile.grade } : null}>
      {/* Welcome Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground">
              {greetingEmoji()} Hi,{" "}
              {profileLoading ? (
                <Skeleton className="inline-block w-32 h-9" />
              ) : (
                <span className="text-primary">{profile?.name ?? "Student"}</span>
              )}
              !
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">Ready to learn something amazing today?</p>
          </div>
          {profile && (
            <Badge
              className="text-sm font-bold px-4 py-2 rounded-full"
            style={{
              background: "oklch(0.62 0.2 195)",
              color: "white",
              fontSize: "0.875rem",
            }}
            >
              Grade {profile.grade.toString()}
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up stagger-1">
        {[
          {
            icon: <BookOpen className="w-6 h-6" />,
            label: "Lessons Done",
            value: statsLoading ? "..." : stats?.completedLessons?.toString() ?? "0",
            color: "oklch(0.46 0.22 280)",
            bg: "oklch(0.92 0.05 280)",
          },
          {
            icon: <Brain className="w-6 h-6" />,
            label: "Quizzes Taken",
            value: statsLoading ? "..." : stats?.completedQuizzes?.toString() ?? "0",
            color: "oklch(0.42 0.2 195)",
            bg: "oklch(0.92 0.08 195)",
          },
          {
            icon: <Trophy className="w-6 h-6" />,
            label: "Subjects",
            value: profile?.subjects?.length?.toString() ?? "0",
            color: "oklch(0.6 0.18 155)",
            bg: "oklch(0.93 0.07 155)",
          },
          {
            icon: <Zap className="w-6 h-6" />,
            label: "Homework Left",
            value: hwLoading ? "..." : pendingHw.length.toString(),
            color: "oklch(0.65 0.2 340)",
            bg: "oklch(0.94 0.07 340)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: stat.bg, color: stat.color }}
            >
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-extrabold font-display" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">Continue Learning</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/subjects" })}
              className="text-primary font-semibold rounded-xl"
            >
              View All →
            </Button>
          </div>

          {profileLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
          ) : !profile?.subjects?.length ? (
            <div className="bg-secondary/50 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-muted-foreground">No subjects selected yet.</p>
              <Button
                className="mt-4 rounded-xl edivora-gradient"
                onClick={() => navigate({ to: "/onboarding" })}
              >
                Set Up Subjects
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.subjects.map((subject) => (
                <div
                  key={subject}
                  className="group bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${SUBJECT_COLORS[subject] ?? "from-purple-400 to-indigo-500"} flex items-center justify-center text-2xl shadow-sm`}
                    >
                      {SUBJECT_ICONS[subject] ?? "📖"}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{subject}</h3>
                      <p className="text-xs text-muted-foreground">Grade {profile.grade.toString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => navigate({ to: `/subjects/${encodeURIComponent(subject)}/lessons` })}
                      className="flex-1 rounded-xl text-xs gap-1 edivora-gradient"
                    >
                      <Play className="w-3 h-3" />
                      Resume
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate({ to: `/subjects/${encodeURIComponent(subject)}/quiz` })}
                      className="flex-1 rounded-xl text-xs gap-1 border-primary text-primary"
                    >
                      <Brain className="w-3 h-3" />
                      Quiz
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: "🧠",
                  label: "Start Quiz",
                  onClick: () => navigate({ to: "/subjects" }),
                  color: "oklch(0.46 0.22 280)",
                  bg: "oklch(0.92 0.05 280)",
                },
                {
                  icon: "📝",
                  label: "Add Homework",
                  onClick: () => navigate({ to: "/homework" }),
                  color: "oklch(0.42 0.2 195)",
                  bg: "oklch(0.92 0.08 195)",
                },
                {
                  icon: "📅",
                  label: "View Timetable",
                  onClick: () => navigate({ to: "/homework" }),
                  color: "oklch(0.6 0.18 155)",
                  bg: "oklch(0.93 0.07 155)",
                },
              ].map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-2xl hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: action.bg }}
                  >
                    {action.icon}
                  </div>
                  <span className="text-xs font-semibold text-foreground text-center">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Homework */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">Today&apos;s Homework</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/homework" })}
              className="text-primary font-semibold rounded-xl"
            >
              <PlusCircle className="w-4 h-4" />
            </Button>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            {hwLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : pendingHw.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm font-medium">All caught up! 🎉</p>
                <p className="text-muted-foreground text-xs">No pending homework</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 rounded-xl text-xs"
                  onClick={() => navigate({ to: "/homework" })}
                >
                  Add Homework
                </Button>
              </div>
            ) : (
              pendingHw.map((hw) => (
                <div
                  key={hw.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <Checkbox
                    checked={hw.completed}
                    onCheckedChange={() => handleMarkDone(hw.id)}
                    className="mt-0.5 rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{hw.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: "oklch(0.92 0.05 280)",
                          color: "oklch(0.46 0.22 280)",
                        }}
                      >
                        {hw.subject}
                      </span>
                      <span className="text-xs text-muted-foreground">Due: {hw.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
