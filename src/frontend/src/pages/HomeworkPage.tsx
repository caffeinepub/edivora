import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  useGetCallerUserProfile,
  useGetHomework,
  useAddHomework,
  useMarkHomeworkDone,
} from "../hooks/useQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import AppLayout from "../components/AppLayout";
import { SUBJECTS } from "../data/sampleData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PlusCircle, Loader2, Calendar, CheckCircle2, ListChecks } from "lucide-react";

function generateId() {
  return `hw-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function HomeworkPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const { data: homework, isLoading } = useGetHomework();
  const addHomework = useAddHomework();
  const markDone = useMarkHomeworkDone();

  const [formSubject, setFormSubject] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formDue, setFormDue] = useState("");
  const [showForm, setShowForm] = useState(false);

  if (!identity) {
    navigate({ to: "/" });
    return null;
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject || !formDesc || !formDue) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await addHomework.mutateAsync({
        id: generateId(),
        subject: formSubject,
        description: formDesc,
        dueDate: formDue,
        completed: false,
      });
      setFormSubject("");
      setFormDesc("");
      setFormDue("");
      setShowForm(false);
      toast.success("Homework added! 📝");
    } catch {
      toast.error("Failed to add homework");
    }
  };

  const handleMarkDone = async (id: string) => {
    try {
      await markDone.mutateAsync(id);
      toast.success("Marked as done! ✅");
    } catch {
      toast.error("Failed to update");
    }
  };

  const pending = homework?.filter((h) => !h.completed) ?? [];
  const done = homework?.filter((h) => h.completed) ?? [];

  const subjectColors: Record<string, string> = {
    Tamil: "oklch(0.65 0.2 340)",
    English: "oklch(0.55 0.18 265)",
    Math: "oklch(0.46 0.22 280)",
    Science: "oklch(0.55 0.18 185)",
    "Social Studies": "oklch(0.62 0.18 55)",
  };

  const subjectBg: Record<string, string> = {
    Tamil: "oklch(0.94 0.07 340)",
    English: "oklch(0.93 0.06 265)",
    Math: "oklch(0.92 0.05 280)",
    Science: "oklch(0.93 0.07 185)",
    "Social Studies": "oklch(0.95 0.08 55)",
  };

  return (
    <AppLayout userProfile={profile ? { name: profile.name, grade: profile.grade } : null}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 animate-fade-in-up flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground flex items-center gap-2">
            <ListChecks className="w-8 h-8 text-primary" />
            Homework
          </h1>
          <p className="text-muted-foreground mt-1">Manage your school assignments</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl gap-2 edivora-gradient"
        >
          <PlusCircle className="w-4 h-4" />
          Add Homework
        </Button>
      </div>

      {/* Add Homework Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 animate-fade-in-up">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">New Homework</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hw-subject" className="font-semibold">Subject</Label>
                <Select value={formSubject} onValueChange={setFormSubject}>
                  <SelectTrigger id="hw-subject" className="rounded-xl">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hw-due" className="font-semibold">Due Date</Label>
                <Input
                  id="hw-due"
                  type="date"
                  value={formDue}
                  onChange={(e) => setFormDue(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hw-desc" className="font-semibold">Description</Label>
              <Input
                id="hw-desc"
                placeholder="What's the homework about?"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={addHomework.isPending}
                className="rounded-xl edivora-gradient gap-2"
              >
                {addHomework.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusCircle className="w-4 h-4" />
                )}
                Add
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending */}
          <div>
            <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "oklch(0.72 0.18 55)" }}
              >
                {pending.length}
              </span>
              Pending
            </h2>

            {pending.length === 0 ? (
              <div className="bg-secondary/50 rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <p className="font-semibold text-foreground">All done! 🎉</p>
                <p className="text-sm text-muted-foreground">No pending homework</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pending.map((hw) => (
                  <div
                    key={hw.id}
                    className="bg-card border border-border rounded-2xl p-4 flex items-start gap-4 hover:shadow-md transition-shadow"
                  >
                    <Checkbox
                      checked={false}
                      onCheckedChange={() => handleMarkDone(hw.id)}
                      className="mt-1 rounded-md w-5 h-5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{hw.description}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full"
                          style={{
                            background: subjectBg[hw.subject] ?? "oklch(0.92 0.05 280)",
                            color: subjectColors[hw.subject] ?? "oklch(0.46 0.22 280)",
                          }}
                        >
                          {hw.subject}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {hw.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed */}
          {done.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold text-muted-foreground mb-3 flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "oklch(0.6 0.18 155)" }}
                >
                  {done.length}
                </span>
                Completed
              </h2>

              <div className="space-y-3">
                {done.map((hw) => (
                  <div
                    key={hw.id}
                    className="bg-secondary/30 border border-border rounded-2xl p-4 flex items-start gap-4 opacity-70"
                  >
                    <Checkbox checked={true} className="mt-1 rounded-md w-5 h-5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-muted-foreground line-through">{hw.description}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full opacity-70"
                          style={{
                            background: subjectBg[hw.subject] ?? "oklch(0.92 0.05 280)",
                            color: subjectColors[hw.subject] ?? "oklch(0.46 0.22 280)",
                          }}
                        >
                          {hw.subject}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {hw.dueDate}
                        </span>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
