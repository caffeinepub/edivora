import { useNavigate } from "@tanstack/react-router";
import { useGetCallerUserProfile, useGetLessonTitles } from "../hooks/useQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import AppLayout from "../components/AppLayout";
import { SUBJECT_ICONS, SUBJECT_COLORS } from "../data/sampleData";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Brain } from "lucide-react";

function SubjectCard({ subject, grade }: { subject: string; grade: bigint }) {
  const navigate = useNavigate();
  const { data: titles } = useGetLessonTitles(grade, subject);
  const lessonCount = titles?.length ?? 0;

  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 subject-card-hover">
      {/* Colored header strip */}
      <div className={`h-24 bg-gradient-to-br ${SUBJECT_COLORS[subject] ?? "from-purple-400 to-indigo-500"} flex items-center justify-center`}>
        <span className="text-5xl drop-shadow-sm">{SUBJECT_ICONS[subject] ?? "📖"}</span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-xl font-bold text-foreground mb-1">{subject}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {lessonCount > 0 ? `${lessonCount} lessons available` : "3+ lessons available"}
        </p>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => navigate({ to: `/subjects/${encodeURIComponent(subject)}/lessons` })}
            className="flex-1 rounded-xl gap-1 edivora-gradient text-xs"
          >
            <BookOpen className="w-3 h-3" />
            Lessons
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate({ to: `/subjects/${encodeURIComponent(subject)}/quiz` })}
            className="flex-1 rounded-xl gap-1 border-primary text-primary text-xs"
          >
            <Brain className="w-3 h-3" />
            Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SubjectsPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useGetCallerUserProfile();

  if (!identity) {
    navigate({ to: "/" });
    return null;
  }

  return (
    <AppLayout userProfile={profile ? { name: profile.name, grade: profile.grade } : null}>
      <div className="mb-8 animate-fade-in-up">
        <h1 className="font-display text-3xl font-extrabold text-foreground">My Subjects</h1>
        <p className="text-muted-foreground mt-1">Select a subject to start learning</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : !profile?.subjects?.length ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">No Subjects Yet</h2>
          <p className="text-muted-foreground mb-6">Go to onboarding to select your subjects</p>
          <Button
            className="rounded-xl edivora-gradient"
            onClick={() => navigate({ to: "/onboarding" })}
          >
            Set Up Subjects
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up stagger-1">
          {profile.subjects.map((subject) => (
            <SubjectCard key={subject} subject={subject} grade={profile.grade} />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
