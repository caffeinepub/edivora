import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  useGetCallerUserProfile,
  useGetQuestions,
  useSubmitAttempt,
} from "../hooks/useQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import AppLayout from "../components/AppLayout";
import { SUBJECT_COLORS, SUBJECT_ICONS } from "../data/sampleData";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Timer, Loader2, Trophy, RefreshCw, BookOpen } from "lucide-react";

const QUESTION_TIME = 60;

type QuizState = "playing" | "submitted";

export default function QuizPage() {
  const navigate = useNavigate();
  const { subject } = useParams({ strict: false }) as { subject: string };
  const decodedSubject = decodeURIComponent(subject ?? "");

  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const grade = profile?.grade ?? 8n;

  const { data: questions, isLoading } = useGetQuestions(grade, decodedSubject);
  const submitAttempt = useSubmitAttempt();

  const [quizState, setQuizState] = useState<QuizState>("playing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [finalScore, setFinalScore] = useState<bigint | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions?.[currentIndex];
  const totalQuestions = questions?.length ?? 0;

  const handleNextQuestion = useCallback(() => {
    const nextIndex = currentIndex + 1;
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = selectedOption;
      return updated;
    });
    setSelectedOption(null);
    setShowExplanation(false);

    if (nextIndex >= totalQuestions) {
      // Submit
      setQuizState("submitted");
    } else {
      setCurrentIndex(nextIndex);
      setTimeLeft(QUESTION_TIME);
    }
  }, [currentIndex, selectedOption, totalQuestions]);

  // Timer
  useEffect(() => {
    if (quizState !== "playing" || !questions?.length) return;
    if (timeLeft <= 0) {
      handleNextQuestion();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quizState, questions, handleNextQuestion]);

  // Submit quiz when state changes to submitted
  useEffect(() => {
    if (quizState !== "submitted" || !questions?.length) return;

    const finalAnswers = answers.map((a) => BigInt(a ?? 0));

    submitAttempt
      .mutateAsync({ questions, answers: finalAnswers })
      .then((score) => {
        setFinalScore(score);
      })
      .catch(() => {
        // Calculate score locally as fallback
        let correct = 0;
        questions.forEach((q, i) => {
          if (BigInt(answers[i] ?? -1) === q.correctIndex) correct++;
        });
        setFinalScore(BigInt(correct));
        toast.error("Score saved locally — connection issue");
      });
  }, [quizState, questions, answers, submitAttempt]);

  if (!identity) {
    navigate({ to: "/" });
    return null;
  }

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setTimeLeft(QUESTION_TIME);
    setShowExplanation(false);
    setFinalScore(null);
    setQuizState("playing");
  };

  const getScoreMessage = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct >= 90) return { msg: "Outstanding! You're a genius! 🏆", color: "text-yellow-600" };
    if (pct >= 70) return { msg: "Great job! Keep it up! 🌟", color: "text-green-600" };
    if (pct >= 50) return { msg: "Good effort! You're improving! 💪", color: "text-blue-600" };
    return { msg: "Keep practicing! You'll get there! 📚", color: "text-orange-600" };
  };

  return (
    <AppLayout userProfile={profile ? { name: profile.name, grade: profile.grade } : null}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: `/subjects/${encodeURIComponent(decodedSubject)}/lessons` })}
          className="gap-2 rounded-xl -ml-2 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${SUBJECT_COLORS[decodedSubject] ?? "from-purple-400 to-indigo-500"} flex items-center justify-center text-xl`}
          >
            {SUBJECT_ICONS[decodedSubject] ?? "📖"}
          </div>
          <span className="font-display text-xl font-bold text-foreground">{decodedSubject} Quiz</span>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4 max-w-2xl mx-auto">
          <Skeleton className="h-6 w-full rounded-xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        </div>
      )}

      {/* Score Screen */}
      {!isLoading && quizState === "submitted" && (
        <div className="max-w-xl mx-auto text-center animate-pop-in">
          <div className="text-8xl mb-4">🎯</div>
          <h1 className="font-display text-4xl font-extrabold text-foreground mb-2">
            Quiz Complete!
          </h1>

          {finalScore === null ? (
            <div className="flex items-center justify-center gap-2 my-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-muted-foreground">Calculating score...</span>
            </div>
          ) : (
            <>
              <div className="my-8">
                <div
                  className="text-8xl font-extrabold font-display mb-2"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.46 0.22 280), oklch(0.62 0.2 195))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {finalScore.toString()}/{totalQuestions}
                </div>
                <div className="text-xl font-bold text-muted-foreground mb-3">
                  {Math.round((Number(finalScore) / totalQuestions) * 100)}% Correct
                </div>
                <div
                  className={`text-lg font-semibold ${
                    getScoreMessage(Number(finalScore), totalQuestions).color
                  }`}
                >
                  {getScoreMessage(Number(finalScore), totalQuestions).msg}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={resetQuiz}
                  className="rounded-xl gap-2 edivora-gradient px-6"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: "/subjects" })}
                  className="rounded-xl gap-2 border-primary text-primary px-6"
                >
                  <BookOpen className="w-4 h-4" />
                  Back to Subjects
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: "/progress" })}
                  className="rounded-xl gap-2 px-6"
                >
                  <Trophy className="w-4 h-4" />
                  View Progress
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Quiz Playing */}
      {!isLoading && quizState === "playing" && questions && questions.length > 0 && currentQuestion && (
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          {/* Progress & Timer */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-muted-foreground">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <div
              className={`flex items-center gap-2 font-bold text-sm px-3 py-1 rounded-full ${
                timeLeft <= 10 ? "bg-red-100 text-red-600" : "bg-secondary text-foreground"
              }`}
            >
              <Timer className="w-4 h-4" />
              {timeLeft}s
            </div>
          </div>

          <Progress
            value={((currentIndex + 1) / totalQuestions) * 100}
            className="mb-6 h-2 rounded-full"
          />

          {/* Question Card */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h2 className="font-display text-xl font-bold text-foreground leading-snug">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            {currentQuestion.options.map((option, optIndex) => {
              const optKey = `opt-${optIndex}-${option.slice(0, 10)}`;
              let optClass = "quiz-option border-border bg-card";

              if (selectedOption !== null) {
                if (optIndex === Number(currentQuestion.correctIndex)) {
                  optClass = "quiz-option correct";
                } else if (optIndex === selectedOption && optIndex !== Number(currentQuestion.correctIndex)) {
                  optClass = "quiz-option wrong";
                } else {
                  optClass = "quiz-option border-border bg-card opacity-60";
                }
              } else if (selectedOption === optIndex) {
                optClass = "quiz-option selected";
              }

              return (
                <button
                  key={optKey}
                  type="button"
                  onClick={() => handleSelectOption(optIndex)}
                  disabled={selectedOption !== null}
                  className={`${optClass} text-left flex items-center gap-3`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                      selectedOption !== null && optIndex === Number(currentQuestion.correctIndex)
                        ? "bg-green-500 text-white"
                        : selectedOption !== null && optIndex === selectedOption && optIndex !== Number(currentQuestion.correctIndex)
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {["A", "B", "C", "D"][optIndex]}
                  </div>
                  <span className="text-foreground font-medium">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div
              className="p-4 rounded-xl mb-4 animate-fade-in-up"
              style={{ background: "oklch(0.93 0.05 280)", border: "2px solid oklch(0.82 0.1 280)" }}
            >
              <p className="text-sm font-semibold text-foreground">
                💡 {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {selectedOption !== null && (
            <Button
              onClick={handleNextQuestion}
              className="w-full rounded-xl py-5 font-bold edivora-gradient animate-pop-in"
            >
              {currentIndex + 1 >= totalQuestions ? "See Results 🎯" : "Next Question →"}
            </Button>
          )}
        </div>
      )}

      {/* No Questions Fallback */}
      {!isLoading && quizState === "playing" && (!questions || questions.length === 0) && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">No Questions Available</h2>
          <p className="text-muted-foreground mb-6">No quiz questions found for {decodedSubject}</p>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/subjects" })}
            className="rounded-xl"
          >
            Back to Subjects
          </Button>
        </div>
      )}
    </AppLayout>
  );
}
