import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Users, Calendar, TrendingUp, AlertCircle, Loader2 } from "lucide-react";

interface AdminStats {
  totalStudents: number;
  totalCounselors: number;
  totalAppointments: number;
  todayAppointments: number;
  completedAppointments: number;
  appointmentRate: number;
  moodEntries: number;
  resources: number;
  forumPosts: number;
}

interface WellnessMetrics {
  moodDistribution: any;
  metrics: any;
}

interface HighRiskFlag {
  id: string;
  student: string;
  flag: string;
  date: string;
  severity: string;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [wellnessMetrics, setWellnessMetrics] = useState<WellnessMetrics | null>(null);
  const [appointmentAnalytics, setAppointmentAnalytics] = useState<any>(null);
  const [resourceEngagement, setResourceEngagement] = useState<any[]>([]);
  const [forumActivity, setForumActivity] = useState<any[]>([]);
  const [highRiskFlags, setHighRiskFlags] = useState<HighRiskFlag[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState("month");
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to access admin dashboard");
        return;
      }

      // Fetch all data in parallel
      const [
        statsRes,
        wellnessRes,
        appointmentRes,
        resourceRes,
        forumRes,
        flagsRes,
        alertsRes,
      ] = await Promise.all([
        fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/wellness", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/appointments", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/resources", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/forum", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/flags", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/alerts", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.data);
      }

      if (wellnessRes.ok) {
        const data = await wellnessRes.json();
        setWellnessMetrics(data.data);
      }

      if (appointmentRes.ok) {
        const data = await appointmentRes.json();
        setAppointmentAnalytics(data.data);
      }

      if (resourceRes.ok) {
        const data = await resourceRes.json();
        setResourceEngagement(data.data || []);
      }

      if (forumRes.ok) {
        const data = await forumRes.json();
        setForumActivity(data.data || []);
      }

      if (flagsRes.ok) {
        const data = await flagsRes.json();
        setHighRiskFlags(data.data || []);
      }

      if (alertsRes.ok) {
        const data = await alertsRes.json();
        setAlerts(data.data || []);
      }
    } catch (error) {
      console.error("Dashboard loading error:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      dateRange: dateRange,
      stats: stats,
      wellnessMetrics: wellnessMetrics,
      appointmentAnalytics: appointmentAnalytics,
      resourceEngagement: resourceEngagement,
      forumActivity: forumActivity,
      highRiskFlags: highRiskFlags,
      systemAlerts: alerts,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hipis-admin-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <AlertCircle className="h-8 w-8 text-destructive mb-4" />
          <p className="text-foreground font-medium mb-4">{error}</p>
          <Link to="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <h1 className="text-lg font-bold text-foreground">Admin Analytics</h1>
          <Button onClick={handleExport} className="bg-primary hover:opacity-90 text-white">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* System Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <Card key={alert.id} className="p-3 bg-yellow-50 border-yellow-200 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-yellow-800">{alert.message}</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {new Date(alert.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">View:</span>
          <div className="flex gap-2">
            {[
              { id: "week", label: "This Week" },
              { id: "month", label: "This Month" },
              { id: "semester", label: "This Semester" },
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setDateRange(range.id)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  dateRange === range.id
                    ? "bg-primary text-white"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Stats */}
        {stats && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Students</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Counselors</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{stats.totalCounselors}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Appointments Today</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{stats.todayAppointments}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Completion Rate</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">{stats.appointmentRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600 opacity-20" />
              </div>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* High-Risk Flags */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">⚠️ High-Risk Alerts</h2>
            <Card className="space-y-3 p-6">
              {highRiskFlags.length > 0 ? (
                highRiskFlags.slice(0, 5).map((flag) => (
                  <div
                    key={flag.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      flag.severity === "critical"
                        ? "bg-red-50 border-red-500 text-red-900"
                        : "bg-yellow-50 border-yellow-500 text-yellow-900"
                    }`}
                  >
                    <p className="font-medium text-sm">{flag.student}</p>
                    <p className="text-xs mt-1">{flag.flag}</p>
                    <p className="text-xs opacity-70 mt-1">{flag.date}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No high-risk alerts</p>
              )}
            </Card>
          </div>

          {/* Wellness Metrics */}
          {wellnessMetrics && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">📊 Wellness Metrics</h2>
              <Card className="space-y-4 p-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Anxiety Index</span>
                    <span className="text-sm font-bold text-orange-600">
                      {wellnessMetrics.metrics.anxietyIndex.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500"
                      style={{ width: `${(wellnessMetrics.metrics.anxietyIndex / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Depression Index</span>
                    <span className="text-sm font-bold text-blue-600">
                      {wellnessMetrics.metrics.depressionIndex.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(wellnessMetrics.metrics.depressionIndex / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Stress Level</span>
                    <span className="text-sm font-bold text-red-600">
                      {wellnessMetrics.metrics.stressLevel.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${(wellnessMetrics.metrics.stressLevel / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Wellbeing Score</span>
                    <span className="text-sm font-bold text-green-600">
                      {wellnessMetrics.metrics.wellbeingScore.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${(wellnessMetrics.metrics.wellbeingScore / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Resource Engagement */}
        {resourceEngagement.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">📚 Top Resources</h2>
            <Card className="p-6">
              <div className="space-y-3">
                {resourceEngagement.slice(0, 5).map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{resource.title}</p>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <span>👁️ {resource.views} views</span>
                        <span>❤️ {resource.likes} likes</span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        resource.engagement === "High"
                          ? "bg-green-100 text-green-700"
                          : resource.engagement === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {resource.engagement}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Forum Activity */}
        {forumActivity.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">💬 Forum Activity</h2>
            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-foreground font-medium">Category</th>
                      <th className="text-center py-2 text-foreground font-medium">Posts</th>
                      <th className="text-center py-2 text-foreground font-medium">Comments</th>
                      <th className="text-center py-2 text-foreground font-medium">Engagement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forumActivity.map((item) => (
                      <tr key={item.category} className="border-b hover:bg-muted/50">
                        <td className="py-3 text-foreground">{item.category}</td>
                        <td className="text-center text-foreground">{item.posts}</td>
                        <td className="text-center text-foreground">{item.comments}</td>
                        <td className="text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.engagement === "High"
                                ? "bg-green-100 text-green-700"
                                : item.engagement === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item.engagement}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
