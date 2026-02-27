import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSaveUserProfile } from "../hooks/useQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { SUBJECTS, VOICE_PERSONAS } from "../data/sampleData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  GraduationCap,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const GRADES = [6, 7, 8, 9, 10, 11, 12];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const saveProfile = useSaveUserProfile();

  const [step, setStep] = useState(1);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>("Robot AI");

  if (!identity) {
    navigate({ to: "/" });
    return null;
  }

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const handleFinish = async () => {
    if (!selectedGrade || selectedSubjects.length === 0) return;
    try {
      await saveProfile.mutateAsync({
        name: "Student",
        grade: BigInt(selectedGrade),
        subjects: selectedSubjects,
        voicePersona: selectedPersona,
      });
      toast.success("Welcome to Edivora! 🎉");
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const stepTitles = ["Choose Your Grade", "Select Subjects", "Pick Your AI Voice"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 py-5 border-b border-border">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl edivora-gradient flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-primary">Edivora Setup</span>
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  s < step
                    ? "edivora-gradient text-white"
                    : s === step
                    ? "bg-primary text-primary-foreground shadow-lg scale-110"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                    s < step ? "bg-primary" : "bg-secondary"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <h1 className="font-display text-3xl font-bold text-foreground mb-2 text-center">
          {stepTitles[step - 1]}
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          {step === 1 && "Select your current grade so we can personalize your lessons"}
          {step === 2 && "Choose the subjects you want to study (pick all that apply)"}
          {step === 3 && "Pick the voice you want your AI tutor to use while teaching"}
        </p>

        {/* Step 1: Grade Selection */}
        {step === 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 animate-fade-in-up">
            {GRADES.map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => setSelectedGrade(grade)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-200 font-bold cursor-pointer ${
                  selectedGrade === grade
                    ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                    : "border-border bg-card text-foreground hover:border-primary hover:scale-105"
                }`}
              >
                <span className="text-lg font-extrabold">{grade}</span>
                <span className="text-xs opacity-70">Grade</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Subject Selection */}
        {step === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up">
            {SUBJECTS.map((subject) => {
              const icons: Record<string, string> = {
                Tamil: "📚",
                English: "✏️",
                Math: "🔢",
                Science: "🔬",
                "Social Studies": "🌍",
              };
              const colors: Record<string, string> = {
                Tamil: "from-rose-400 to-pink-500",
                English: "from-blue-400 to-indigo-500",
                Math: "from-violet-400 to-purple-600",
                Science: "from-teal-400 to-cyan-500",
                "Social Studies": "from-teal-400 to-cyan-500",
              };
              const isSelected = selectedSubjects.includes(subject);
              return (
                <button
                  key={subject}
                  type="button"
                  onClick={() => toggleSubject(subject)}
                  className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left cursor-pointer ${
                    isSelected
                      ? "border-primary bg-secondary shadow-lg"
                      : "border-border bg-card hover:border-primary hover:bg-secondary/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[subject]} flex items-center justify-center text-2xl shadow-sm`}
                  >
                    {icons[subject]}
                  </div>
                  <span className="font-bold text-foreground text-lg">{subject}</span>
                  {isSelected && (
                    <CheckCircle2 className="w-6 h-6 text-primary absolute top-3 right-3" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Step 3: Voice Persona Selection */}
        {step === 3 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in-up">
            {VOICE_PERSONAS.map((persona) => (
              <button
                key={persona.id}
                type="button"
                onClick={() => setSelectedPersona(persona.id)}
                className={`persona-card flex flex-col items-center gap-2 ${
                  selectedPersona === persona.id ? "selected" : "border-border bg-card hover:border-primary"
                }`}
              >
                <div className="text-4xl">{persona.emoji}</div>
                <div className="font-bold text-foreground">{persona.name}</div>
                <div
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: "oklch(0.92 0.05 280)",
                    color: "oklch(0.46 0.22 280)",
                  }}
                >
                  {persona.label}
                </div>
                <div className="text-xs text-muted-foreground">{persona.desc}</div>
                {selectedPersona === persona.id && (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-10">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              className="rounded-xl gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 ? !selectedGrade : step === 2 ? selectedSubjects.length === 0 : false}
              className="rounded-xl gap-2 edivora-gradient"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={saveProfile.isPending}
              className="rounded-xl gap-2 edivora-gradient"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Let&apos;s Go! 🚀
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
