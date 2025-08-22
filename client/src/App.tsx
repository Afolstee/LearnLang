import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/ui/navigation";
import Home from "@/pages/home";
import Articles from "@/pages/articles";
import Progress from "@/pages/progress";
import NotFound from "@/pages/not-found";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

function AppContent() {
  const userId = localStorage.getItem("userId");
  
  const { data: user } = useQuery({
    queryKey: ["/api/users", userId],
    queryFn: () => userId ? api.getUser(userId) : null,
    enabled: !!userId,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user ? {
        streakDays: user.streakDays,
        username: user.username,
      } : undefined} />
      
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/articles" component={Articles} />
          <Route path="/progress" component={Progress} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
