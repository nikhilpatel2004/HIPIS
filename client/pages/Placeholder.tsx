import { useLocation, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb } from "lucide-react";

export default function Placeholder() {
  const location = useLocation();

  const pageNames: Record<string, string> = {
    "/chatbot": "AI Mental Health Chatbot",
    "/appointments": "Appointment Booking System",
    "/wellness": "Wellness Tracker & Assessments",
    "/resources": "Psychoeducational Resource Hub",
    "/forum": "Peer Support Forum",
    "/assessments": "Assessment Tests",
    "/counsellor-dashboard": "Counsellor Dashboard",
    "/admin-dashboard": "Admin Analytics Dashboard",
  };

  const pageName = pageNames[location.pathname] || "Page";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <Card className="p-8 sm:p-12 space-y-8 text-center animate-slide-up">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-gradient-calm/20 flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {pageName}
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              This feature is coming soon! We're working hard to bring you the best mental health
              support experience.
            </p>
          </div>

          <div className="bg-gradient-soft border border-primary/20 rounded-lg p-6 space-y-3">
            <p className="text-sm font-medium text-foreground">
              Want to help shape this feature?
            </p>
            <p className="text-sm text-muted-foreground">
              Share your feedback and let us know what would help you most. Your input directly
              influences what we build next.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button variant="outline" size="lg">
                Back to Dashboard
              </Button>
            </Link>
            <a href="mailto:feedback@hipis.app">
              <Button size="lg" className="bg-gradient-calm hover:opacity-90 text-white">
                Send Feedback
              </Button>
            </a>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground border-t border-border pt-6">
            <p>Features currently being developed:</p>
            <ul className="space-y-1">
              <li>✨ AI-powered chatbot with emotion detection</li>
              <li>📅 Real-time appointment scheduling</li>
              <li>📊 Comprehensive wellness tracking</li>
              <li>📚 Multilingual resource library</li>
              <li>👥 Moderated peer support community</li>
              <li>📈 Advanced analytics dashboard</li>
            </ul>
          </div>
        </Card>
      </main>
    </div>
  );
}
