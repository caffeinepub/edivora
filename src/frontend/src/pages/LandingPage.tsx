import { useNavigate } from "@tanstack/react-router";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useEffect } from "react";
import { Loader2, GraduationCap, Star, BookOpen, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const { login, loginStatus, identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity && !isInitializing) {
      navigate({ to: "/dashboard" });
    }
  }, [identity, isInitializing, navigate]);

  const isLoggingIn = loginStatus === "logging-in";

  const features = [
    { icon: "🎤", title: "Voice-Guided Lessons", desc: "Learn with your favourite actor or cartoon voice" },
    { icon: "🧠", title: "Smart Quizzes", desc: "AI-powered tests to prepare you for exams" },
    { icon: "📅", title: "Homework Planner", desc: "Upload timetables and get guided through homework" },
    { icon: "📈", title: "Progress Tracking", desc: "See how you improve day by day" },
  ];

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl edivora-gradient flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading Edivora...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Decorative background blobs */}
      <div
        className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.46 0.22 280)" }}
      />
      <div
        className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.72 0.18 55)" }}
      />

      {/* Header */}
      <header className="relative z-10 px-4 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl edivora-gradient flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-primary">Edivora</span>
        </div>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          className="rounded-full px-6 font-bold"
          style={{ background: "oklch(0.72 0.18 55)", color: "white" }}
        >
          {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isLoggingIn ? "Signing In..." : "Sign In"}
        </Button>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-secondary rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-accent-foreground" style={{ color: "oklch(0.72 0.18 55)" }} />
              <span className="text-sm font-semibold text-secondary-foreground">For Grades 6 to 12</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
              Learn Smarter,{" "}
              <span
                className="relative"
                style={{
                  background: "linear-gradient(135deg, oklch(0.46 0.22 280), oklch(0.72 0.18 55))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Not Harder!
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Edivora is your personal AI tutor for Grades 6–12. Learn Tamil, English, Math, Science & Social Studies 
              with fun voice-guided lessons, smart quizzes, and a homework planner — all in one place!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-bold edivora-gradient shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5 mr-2" />
                    Start Learning Free
                  </>
                )}
              </Button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex -space-x-2">
                  {["grad", "book", "star"].map((key, i) => (
                    <div
                      key={key}
                      className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-sm"
                    >
                      {["🎓", "📚", "⭐"][i]}
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium">1000+ students learning</span>
              </div>
            </div>
          </div>

          {/* Right: Mascot + Floating Cards */}
          <div className="relative flex justify-center animate-fade-in-up stagger-2">
            <div className="relative">
              {/* Mascot */}
              <div
                className="w-64 h-64 rounded-3xl flex items-center justify-center relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, oklch(0.88 0.08 280), oklch(0.92 0.06 60))" }}
              >
                <img
                  src="/assets/generated/edivora-mascot-transparent.dim_300x300.png"
                  alt="Edivora Mascot"
                  className="w-56 h-56 object-contain drop-shadow-xl"
                />
              </div>

              {/* Floating stat cards */}
              <div className="absolute -top-4 -left-8 bg-card rounded-2xl shadow-lg p-3 border border-border animate-pop-in stagger-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="text-xs text-muted-foreground">Quiz Score</div>
                    <div className="text-base font-bold text-foreground">95%</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-8 bg-card rounded-2xl shadow-lg p-3 border border-border animate-pop-in stagger-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌟</span>
                  <div>
                    <div className="text-xs text-muted-foreground">Streak</div>
                    <div className="text-base font-bold text-foreground">7 days</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-12 bg-card rounded-2xl shadow-lg p-3 border border-border animate-pop-in stagger-5">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">AI Tutor</div>
                    <div className="text-xs font-bold text-green-600">Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-16">
        <h2 className="font-display text-3xl font-bold text-center text-foreground mb-10">
          Why Students Love Edivora
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`bg-card border border-border rounded-2xl p-6 text-center animate-fade-in-up stagger-${i + 1} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-display text-base font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        <div className="edivora-gradient rounded-3xl p-10 text-center text-white">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="font-display text-3xl font-bold mb-3">Ready to Start Your Journey?</h2>
          <p className="text-white/80 mb-6">Join thousands of students already learning smarter with Edivora</p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="rounded-full bg-white text-primary font-bold px-8 hover:bg-white/90 transition-all hover:scale-105"
          >
            {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Get Started — It&apos;s Free!
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © 2026. Built with ❤️ using{" "}
        <a
          href="https://caffeine.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
