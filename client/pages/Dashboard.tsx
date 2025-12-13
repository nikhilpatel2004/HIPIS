import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MessageCircle,
  Calendar,
  TrendingUp,
  Users,
  BookOpen,
  LogOut,
  Menu,
  Bell,
  Settings,
  Home,
  BarChart3,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import MiniChatbot from "@/components/MiniChatbot";
import AppointmentWidget from "@/components/AppointmentWidget";
import WellnessWidget from "@/components/WellnessWidget";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DashboardStats {
  upcomingAppointments: number;
  moodEntries: number;
  resources: number;
  forums: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Guest");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [wellnessOpen, setWellnessOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadNotifications = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setNotifications([]);
      return;
    }

    try {
      setNotificationsLoading(true);
      setNotificationsError(null);

      const res = await fetch(`/api/notifications/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to load notifications");
      }

      const data = await res.json();
      setNotifications(data.data || []);
    } catch (err) {
      console.error("Error loading notifications:", err);
      setNotificationsError("Failed to load notifications");
    } finally {
      setNotificationsLoading(false);
    }
  };

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      const profileRes = await fetch("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (profileRes.ok) {
        const data = await profileRes.json();
        setUserProfile(data.user);
        setUserName(data.user.name);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userRole", data.user.role);

        // Redirect based on role
        if (data.user.role === "admin") {
          // Admin can see this but also redirect to admin-dashboard
        } else if (data.user.role === "counsellor") {
          // Counselor can see this but also has access to counselor dashboard
        }
      }

      // Load basic stats
      const notificationsRes = await fetch(`/api/notifications/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (notificationsRes.ok) {
        const data = await notificationsRes.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

    try {
      await fetch(`/api/notifications/${userId}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadNotifications();
    } catch (error) {
      console.error("Error marking notifications read:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const quickActions = [
    {
      icon: MessageCircle,
      label: "Chat with AI",
      description: "Get instant mental health support",
      link: "/chatbot",
      color: "from-primary/20 to-secondary/20",
    },
    {
      icon: Calendar,
      label: "Book Appointment",
      description: "Schedule with a counsellor",
      link: "/appointments",
      color: "from-secondary/20 to-primary/20",
    },
    {
      icon: TrendingUp,
      label: "Wellness Tracker",
      description: "Log your mood and progress",
      link: "/wellness",
      color: "from-primary/10 to-accent/20",
    },
    {
      icon: BookOpen,
      label: "Resources",
      description: "Learn about mental health",
      link: "/resources",
      color: "from-accent/20 to-primary/20",
    },
    {
      icon: Users,
      label: "Peer Forum",
      description: "Connect with other students",
      link: "/forum",
      color: "from-secondary/10 to-accent/20",
    },
    {
      icon: BarChart3,
      label: "My Progress",
      description: "View your assessments",
      link: "/assessments",
      color: "from-primary/20 to-accent/20",
    },
  ];

  const recentActivity = [
    { title: "Completed PHQ-9 Assessment", time: "2 hours ago", icon: "📋" },
    { title: "Logged mood: Stressed", time: "Today at 2:30 PM", icon: "😟" },
    { title: "Read: Managing Academic Stress", time: "Yesterday", icon: "📖" },
  ];

  const upcomingAppointments = [
    {
      counsellor: "Dr. Priya Sharma",
      date: "Tomorrow",
      time: "2:00 PM",
      type: "Video Call",
    },
    {
      counsellor: "Ms. Anjali Patel",
      date: "Friday",
      time: "4:00 PM",
      type: "In-Person",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-calm">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-primary hidden sm:inline">HIPIS</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                title="Notifications"
                onClick={() => {
                  const nextOpen = !notificationsOpen;
                  setNotificationsOpen(nextOpen);
                  if (nextOpen) loadNotifications();
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors relative"
              >
                <Bell className="h-5 w-5 text-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                    <span className="text-sm font-medium text-foreground">Notifications</span>
                    <button
                      className="text-xs text-primary hover:underline"
                      onClick={markAllRead}
                      disabled={!notifications.length}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notificationsLoading ? (
                      <p className="text-xs text-muted-foreground p-3">Loading...</p>
                    ) : notificationsError ? (
                      <p className="text-xs text-red-600 p-3">{notificationsError}</p>
                    ) : notifications.length === 0 ? (
                      <p className="text-xs text-muted-foreground p-3">No notifications yet.</p>
                    ) : (
                      notifications.map((note) => (
                        <div
                          key={note._id}
                          className={`px-3 py-2 border-b border-border/60 ${note.read ? "bg-background" : "bg-primary/5"}`}
                        >
                          <p className="text-sm font-medium text-foreground">{note.title}</p>
                          <p className="text-xs text-muted-foreground">{note.message}</p>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            {note.createdAt ? new Date(note.createdAt).toLocaleString() : ""}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <button
              title="Settings"
              onClick={() => navigate("/settings")}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Settings className="h-5 w-5 text-foreground" />
            </button>
            <button
              title="Logout"
              onClick={handleLogout}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 border-r border-border/50 bg-background/95 backdrop-blur transition-all ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-6 space-y-6 h-full overflow-auto">
            <nav className="space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium"
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>

              {userProfile?.role === "counsellor" && (
                <Link
                  to="/counsellor-dashboard"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span>Counselor Dashboard</span>
                </Link>
              )}

              {userProfile?.role === "admin" && (
                <Link
                  to="/admin-dashboard"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              {userProfile?.role === "student" && (
                <>
                  <Link
                    to="/chatbot"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Chatbot</span>
                  </Link>
                  <Link
                    to="/appointments"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Appointments</span>
                  </Link>
                  <Link
                    to="/wellness"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <TrendingUp className="h-5 w-5" />
                    <span>Wellness</span>
                  </Link>
                  <Link
                    to="/resources"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Resources</span>
                  </Link>
                  <Link
                    to="/forum"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    <span>Peer Forum</span>
                  </Link>
                </>
              )}
            </nav>

            <div className="border-t border-border pt-6 space-y-2">
              <button 
                onClick={() => navigate("/settings")}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted w-full transition-colors text-left"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-destructive hover:bg-red-50 w-full transition-colors text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Welcome Section */}
              <section className="space-y-2 animate-slide-up">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Welcome back, {userName}!
                </h1>
                <p className="text-muted-foreground">
                  {userProfile?.role === "student" && "Here's your mental health dashboard. You're doing great!"}
                  {userProfile?.role === "counsellor" && "View your clients and manage appointments."}
                  {userProfile?.role === "admin" && "Monitor system-wide metrics and student wellness."}
                </p>
              </section>

          {/* Quick Actions Grid */}
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const isAppointment = action.label === "Book Appointment";
              const isWellness = action.label === "Wellness Tracker";
              
              if (isAppointment) {
                return (
                  <button
                    key={index}
                    onClick={() => setAppointmentOpen(true)}
                    className="w-full"
                  >
                    <Card
                      className={`p-6 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-300 h-full bg-gradient-to-br ${action.color}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="space-y-4">
                        <div className="h-12 w-12 rounded-lg bg-gradient-calm flex items-center justify-center">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-foreground">{action.label}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    </Card>
                  </button>
                );
              }

              if (isWellness) {
                return (
                  <button
                    key={index}
                    onClick={() => setWellnessOpen(true)}
                    className="w-full"
                  >
                    <Card
                      className={`p-6 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-300 h-full bg-gradient-to-br ${action.color}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="space-y-4">
                        <div className="h-12 w-12 rounded-lg bg-gradient-calm flex items-center justify-center">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-foreground">{action.label}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    </Card>
                  </button>
                );
              }
              
              return (
                <Link key={index} to={action.link}>
                  <Card
                    className={`p-6 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-300 h-full bg-gradient-to-br ${action.color}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="space-y-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-calm flex items-center justify-center">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{action.label}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </section>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <section className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
                <Link to="/wellness" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <Card key={index} className="p-4 hover:border-primary/50 transition-all">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">{activity.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Upcoming Appointments */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Upcoming</h2>
                <button 
                  onClick={() => setAppointmentOpen(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Book new
                </button>
              </div>
              <div className="space-y-3">
                {upcomingAppointments.map((apt, index) => (
                  <Card key={index} className="p-4 bg-gradient-soft border-primary/20 cursor-pointer hover:shadow-md transition-all" onClick={() => setAppointmentOpen(true)}>
                    <div className="space-y-2">
                      <p className="font-medium text-foreground text-sm">{apt.counsellor}</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>{apt.date} at {apt.time}</p>
                        <p className="text-primary">{apt.type}</p>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-2 text-xs h-8">
                        Manage
                      </Button>
                    </div>
                  </Card>
                ))}

                {/* Today's Mood */}
                <Card className="p-4 border-secondary/50 bg-gradient-to-br from-secondary/10 to-accent/10">
                  <h3 className="font-medium text-foreground text-sm mb-3">How are you feeling today?</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {["😢", "😟", "😐", "🙂", "😊"].map((emoji, i) => (
                      <button
                        key={i}
                        className="text-2xl p-2 rounded-lg hover:bg-white/50 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </section>
          </div>

          {/* Tips Section */}
          <Card className="p-6 sm:p-8 bg-gradient-calm text-white space-y-4">
            <h2 className="text-xl font-bold">Daily Wellness Tip</h2>
            <p>
              Taking just 5 minutes for deep breathing can reduce stress and anxiety. Try the
              "4-7-8" technique: breathe in for 4 counts, hold for 7, exhale for 8. Perfect for
              before exams or stressful moments.
            </p>
            <Link to="/resources">
              <Button size="sm" className="bg-white text-primary hover:bg-opacity-90">
                Learn More Techniques
              </Button>
            </Link>
          </Card>
            </>
          )}
        </main>

        {/* Floating Chatbot Button */}
        {!chatbotOpen && (
          <button
            onClick={() => setChatbotOpen(true)}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-calm text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-40"
            title="Open AI Chatbot"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        )}

        {/* Mini Chatbot Widget */}
        <MiniChatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />

        {/* Appointment Widget */}
        <AppointmentWidget isOpen={appointmentOpen} onClose={() => setAppointmentOpen(false)} />

        {/* Wellness Widget */}
        <WellnessWidget isOpen={wellnessOpen} onClose={() => setWellnessOpen(false)} />
      </div>
    </div>
  );
}
