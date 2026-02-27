import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  useGetCallerUserProfile,
  useGetLesson,
  useMarkLessonCompleted,
  useGetCompletedLessons,
} from "../hooks/useQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import AppLayout from "../components/AppLayout";
import { SUBJECT_COLORS, SUBJECT_ICONS, VOICE_PERSONAS, PERSONA_TTS_SETTINGS } from "../data/sampleData";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  CheckCircle2,
  Loader2,
  BookOpen,
} from "lucide-react";

export default function LessonViewerPage() {
  const navigate = useNavigate();
  const { subject, day } = useParams({ strict: false }) as { subject: string; day: string };
  const decodedSubject = decodeURIComponent(subject ?? "");
  const dayNum = parseInt(day ?? "1", 10);

  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const grade = profile?.grade ?? 8n;

  const { data: lesson, isLoading } = useGetLesson(grade, decodedSubject, BigInt(dayNum));
  const { data: completedLessons } = useGetCompletedLessons();
  const markCompleted = useMarkLessonCompleted();

  const [isReading, setIsReading] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const lessonId = `${decodedSubject}-${grade.toString()}-day-${dayNum}`;
  const isCompleted = completedLessons?.includes(lessonId) ?? false;

  const persona = VOICE_PERSONAS.find((p) => p.id === (profile?.voicePersona ?? "Robot AI"));
  const ttsSettings = PERSONA_TTS_SETTINGS[profile?.voicePersona ?? "Robot AI"];

  const stopReading = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsReading(false);
    setUtterance(null);
  }, []);

  useEffect(() => {
    return () => {
      stopReading();
    };
  }, [stopReading]);

  if (!identity) {
    navigate({ to: "/" });
    return null;
  }

  const handleReadAloud = () => {
    if (!lesson?.content) return;

    if (isReading) {
      stopReading();
      return;
    }

    const synth = window.speechSynthesis;
    if (!synth) {
      toast.error("Speech synthesis not supported in this browser");
      return;
    }

    const utt = new SpeechSynthesisUtterance(lesson.content.replace(/\*\*/g, ""));
    utt.pitch = ttsSettings.pitch;
    utt.rate = ttsSettings.rate;
    utt.volume = 1;
    utt.onend = () => setIsReading(false);
    utt.onerror = () => setIsReading(false);

    setUtterance(utt);
    setIsReading(true);
    synth.speak(utt);
  };

  const handleMarkCompleted = async () => {
    try {
      await markCompleted.mutateAsync(lessonId);
      toast.success("Lesson completed! 🎉 Keep up the great work!");
    } catch {
      toast.error("Failed to mark lesson as completed");
    }
  };

  const handleNavigate = (direction: "prev" | "next") => {
    stopReading();
    const newDay = direction === "prev" ? dayNum - 1 : dayNum + 1;
    navigate({ to: `/subjects/${encodeURIComponent(decodedSubject)}/lessons/${newDay}` });
  };

  return (
    <AppLayout userProfile={profile ? { name: profile.name, grade: profile.grade } : null}>
      {/* Back + Navigation */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: `/subjects/${encodeURIComponent(decodedSubject)}/lessons` })}
          className="gap-2 rounded-xl -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Lessons
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigate("prev")}
            disabled={dayNum <= 1}
            className="rounded-xl gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigate("next")}
            className="rounded-xl gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3 rounded-xl" />
          <Skeleton className="h-4 w-1/3 rounded-xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : !lesson ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">No Lesson Available</h2>
          <p className="text-muted-foreground mb-6">
            No lesson found for Day {dayNum} in {decodedSubject}
          </p>
          <Button
            variant="outline"
            onClick={() => navigate({ to: `/subjects/${encodeURIComponent(decodedSubject)}/lessons` })}
            className="rounded-xl"
          >
            Browse Available Lessons
          </Button>
        </div>
      ) : (
        <div className="max-w-3xl animate-fade-in-up">
          {/* Lesson Header */}
          <div className="flex items-start gap-4 mb-6">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${SUBJECT_COLORS[decodedSubject] ?? "from-purple-400 to-indigo-500"} flex items-center justify-center text-3xl shadow-sm shrink-0`}
            >
              {SUBJECT_ICONS[decodedSubject] ?? "📖"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Day {dayNum}
                </span>
                {isCompleted && (
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-foreground">
                {lesson.title}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {decodedSubject} • Grade {grade.toString()}
              </p>
            </div>
          </div>

          {/* Persona Banner */}
          <div
            className="flex items-center gap-4 p-4 rounded-2xl mb-6"
            style={{
              background: "oklch(0.92 0.05 280)",
              border: "2px solid oklch(0.82 0.1 280)",
            }}
          >
            <div className="text-4xl">{persona?.emoji ?? "🤖"}</div>
            <div className="flex-1">
              <div className="font-bold text-foreground">
                {persona?.name ?? "Robot AI"} is teaching this lesson
              </div>
              <div className="text-sm text-muted-foreground">{persona?.desc} voice</div>
            </div>
            <Button
              onClick={handleReadAloud}
              className={`rounded-xl gap-2 font-bold ${
                isReading
                  ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  : "edivora-gradient"
              }`}
            >
              {isReading ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  Stop
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  Read Aloud
                </>
              )}
            </Button>
          </div>

          {/* Lesson Content */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-bold text-foreground">Lesson Content</h2>
            </div>
            <div className="prose prose-sm max-w-none text-foreground">
              {lesson.content.split("\n").map((line, i) => {
                const lineKey = `line-${i}-${line.slice(0, 20)}`;
                if (!line.trim()) return <br key={lineKey} />;
                // Parse bold markers manually to avoid dangerouslySetInnerHTML
                const parts = line.split(/\*\*(.*?)\*\*/g);
                return (
                  <p key={lineKey} className="mb-2 leading-relaxed">
                    {parts.map((part, partIndex) => {
                      const partKey = `${lineKey}-part-${partIndex}-${part.slice(0,8)}`;
                      return partIndex % 2 === 1 ? (
                        <strong key={partKey}>{part}</strong>
                      ) : (
                        <span key={partKey}>{part}</span>
                      );
                    })}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!isCompleted ? (
              <Button
                onClick={handleMarkCompleted}
                disabled={markCompleted.isPending}
                className="flex-1 rounded-xl gap-2 edivora-gradient py-5 text-base font-bold"
              >
                {markCompleted.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Mark as Completed
                  </>
                )}
              </Button>
            ) : (
              <div
                className="flex-1 flex items-center justify-center gap-2 py-5 rounded-xl font-bold text-green-700"
                style={{ background: "oklch(0.93 0.07 155)", border: "2px solid oklch(0.6 0.18 155)" }}
              >
                <CheckCircle2 className="w-5 h-5" />
                Lesson Completed! 🎉
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => navigate({ to: `/subjects/${encodeURIComponent(decodedSubject)}/quiz` })}
              className="flex-1 rounded-xl gap-2 border-primary text-primary py-5 text-base font-bold"
            >
              <span>🧠</span>
              Take Quiz
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
