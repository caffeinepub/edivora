import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  Navigate,
} from "@tanstack/react-router";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import { Toaster } from "@/components/ui/sonner";
import { Loader2, GraduationCap } from "lucide-react";

// Pages
import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import SubjectsPage from "./pages/SubjectsPage";
import LessonListPage from "./pages/LessonListPage";
import LessonViewerPage from "./pages/LessonViewerPage";
import QuizPage from "./pages/QuizPage";
import HomeworkPage from "./pages/HomeworkPage";
import ProgressPage from "./pages/ProgressPage";

// ─── Auth Guard ───────────────────────────────────────────────────────────────
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  if (isInitializing || profileLoading) {
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

  if (!identity) {
    return <Navigate to="/" />;
  }

  // If profile doesn't exist or has no subjects, redirect to onboarding
  if (isFetched && (profile === null || (profile && profile.subjects.length === 0))) {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
}

// ─── Routes ───────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: OnboardingPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  ),
});

const subjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subjects",
  component: () => (
    <AuthGuard>
      <SubjectsPage />
    </AuthGuard>
  ),
});

const lessonListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subjects/$subject/lessons",
  component: () => (
    <AuthGuard>
      <LessonListPage />
    </AuthGuard>
  ),
});

const lessonViewerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subjects/$subject/lessons/$day",
  component: () => (
    <AuthGuard>
      <LessonViewerPage />
    </AuthGuard>
  ),
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subjects/$subject/quiz",
  component: () => (
    <AuthGuard>
      <QuizPage />
    </AuthGuard>
  ),
});

const homeworkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/homework",
  component: () => (
    <AuthGuard>
      <HomeworkPage />
    </AuthGuard>
  ),
});

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/progress",
  component: () => (
    <AuthGuard>
      <ProgressPage />
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  onboardingRoute,
  dashboardRoute,
  subjectsRoute,
  lessonListRoute,
  lessonViewerRoute,
  quizRoute,
  homeworkRoute,
  progressRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
