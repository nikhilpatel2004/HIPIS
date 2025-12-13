import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, Users, Clock, MessageSquare, CheckCircle2, AlertCircle, Plus, Loader2 } from "lucide-react";

interface ClientAppointment {
  _id: string;
  clientName: string;
  clientId: string;
  date: string;
  time: string;
  type: "video-call" | "in-person" | "phone";
  notes: string;
  status: "upcoming" | "completed";
}

interface ClientNote {
  clientName: string;
  date: string;
  content: string;
  followUp?: string;
  _id?: string;
}

interface Client {
  id: string;
  name: string;
  issue: string;
  lastSession: string;
  status: "active" | "completed";
}

interface CounselorStats {
  activeClients: number;
  todaysSessions: number;
  thisWeekSessions: number;
  completionRate: number;
}

export default function CounsellorDashboard() {
  const [appointments, setAppointments] = useState<ClientAppointment[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<ClientAppointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<ClientAppointment[]>([]);
  const [recentNotes, setRecentNotes] = useState<ClientNote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<CounselorStats>({
    activeClients: 0,
    todaysSessions: 0,
    thisWeekSessions: 0,
    completionRate: 0
  });

  const [showNewNote, setShowNewNote] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [noteMood, setNoteMood] = useState("Stable");
  const [loading, setLoading] = useState(true);
  const [savingNote, setSavingNote] = useState(false);
  const [counselorName, setCounselorName] = useState("Dr. Priya Sharma");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Get counselor profile
      const profileRes = await fetch("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        setCounselorName(profile.name);
      }

      // Get stats
      const statsRes = await fetch("/api/counselor/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }

      // Get today's appointments
      const todayRes = await fetch("/api/counselor/appointments/today", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (todayRes.ok) {
        const todayAppts = await todayRes.json();
        const mappedToday = todayAppts.map((apt: any) => ({
          _id: apt._id,
          clientName: apt.userId?.name || "Unknown",
          clientId: apt.userId?._id,
          date: "Today",
          time: apt.time,
          type: apt.type || "video-call",
          notes: apt.type || "Appointment",
          status: "upcoming"
        }));
        setTodayAppointments(mappedToday);
      }

      // Get upcoming appointments
      const upcomingRes = await fetch("/api/counselor/appointments/upcoming", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (upcomingRes.ok) {
        const upcomingAppts = await upcomingRes.json();
        const mappedUpcoming = upcomingAppts.map((apt: any) => ({
          _id: apt._id,
          clientName: apt.userId?.name || "Unknown",
          clientId: apt.userId?._id,
          date: new Date(apt.date).toLocaleDateString(),
          time: apt.time,
          type: apt.type || "video-call",
          notes: apt.type || "Appointment",
          status: "upcoming"
        }));
        setUpcomingAppointments(mappedUpcoming);
      }

      // Get clients
      const clientsRes = await fetch("/api/counselor/clients", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (clientsRes.ok) {
        const clientData = await clientsRes.json();
        const mappedClients = clientData.map((c: any) => ({
          id: c.clientId._id,
          name: c.clientId.name,
          issue: c.primaryIssue,
          lastSession: c.lastSessionDate ? new Date(c.lastSessionDate).toLocaleDateString() : "No session yet",
          status: c.status
        }));
        setClients(mappedClients);
      }

      // Get recent notes
      const notesRes = await fetch("/api/counselor/notes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (notesRes.ok) {
        const notesData = await notesRes.json();
        const mappedNotes = notesData.map((note: any) => ({
          _id: note._id,
          clientName: note.clientId?.name || "Unknown",
          date: new Date(note.sessionDate).toLocaleDateString(),
          content: note.content,
          followUp: note.followUp
        }));
        setRecentNotes(mappedNotes);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    if (!selectedClient || !noteContent.trim()) {
      alert("Please select a client and enter notes");
      return;
    }

    try {
      setSavingNote(true);
      const token = localStorage.getItem("token");

      const response = await fetch("/api/counselor/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          clientId: selectedClient,
          content: noteContent,
          followUp: followUp,
          mood: noteMood
        })
      });

      if (response.ok) {
        // Reload notes
        await loadDashboardData();
        setShowNewNote(false);
        setSelectedClient("");
        setNoteContent("");
        setFollowUp("");
        setNoteMood("Stable");
      } else {
        alert("Failed to save note");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Error saving note");
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <h1 className="text-lg font-bold text-foreground">Counsellor Dashboard</h1>
          <div className="text-sm text-muted-foreground">{counselorName}</div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-soft border-primary/20">
            <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
            <p className="text-3xl font-bold text-primary mt-2">{stats.activeClients}</p>
          </Card>
          <Card className="p-6 bg-gradient-soft border-primary/20">
            <p className="text-sm font-medium text-muted-foreground">Today's Sessions</p>
            <p className="text-3xl font-bold text-primary mt-2">{stats.todaysSessions}</p>
          </Card>
          <Card className="p-6 bg-gradient-soft border-primary/20">
            <p className="text-sm font-medium text-muted-foreground">This Week</p>
            <p className="text-3xl font-bold text-primary mt-2">{stats.thisWeekSessions}</p>
          </Card>
          <Card className="p-6 bg-gradient-soft border-secondary/20">
            <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
            <p className="text-3xl font-bold text-secondary mt-2">{stats.completionRate}%</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Appointments */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">Today's Appointments</h2>
              {todayAppointments.length === 0 ? (
                <Card className="p-4 text-center text-muted-foreground">
                  No appointments today
                </Card>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map((apt) => (
                    <Card key={apt._id} className="p-4 border-primary/20 bg-gradient-soft hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-foreground">{apt.clientName}</h3>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              {apt.type === "video-call" ? "📹" : apt.type === "in-person" ? "🏢" : "☎️"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{apt.notes}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-foreground flex items-center gap-1">
                            <Clock className="h-4 w-4 text-primary" />
                            {apt.time}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          Start Session
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          Reschedule
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Upcoming Appointments */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Appointments</h2>
              {upcomingAppointments.length === 0 ? (
                <Card className="p-4 text-center text-muted-foreground">
                  No upcoming appointments
                </Card>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.slice(0, 3).map((apt) => (
                    <Card key={apt._id} className="p-4 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{apt.clientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {apt.date} at {apt.time}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Add Client Notes */}
            {showNewNote && (
              <Card className="p-6 space-y-4 animate-slide-up">
                <h2 className="text-lg font-bold text-foreground">Add Session Note</h2>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="client-select" className="text-sm font-medium text-foreground block mb-2">
                      Select Client
                    </label>
                    <select
                      id="client-select"
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Choose a client...</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} - {c.issue}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Session Notes
                    </label>
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Document key points from session..."
                      className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                    />
                  </div>

                  <div>
                    <label htmlFor="mood-select" className="text-sm font-medium text-foreground block mb-2">
                      Client Mood
                    </label>
                    <select
                      id="mood-select"
                      value={noteMood}
                      onChange={(e) => setNoteMood(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Stable">Stable</option>
                      <option value="Improved">Improved</option>
                      <option value="Declined">Declined</option>
                      <option value="Crisis">Crisis</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Follow-up Notes (Optional)
                    </label>
                    <textarea
                      value={followUp}
                      onChange={(e) => setFollowUp(e.target.value)}
                      placeholder="Next steps or action items..."
                      className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none h-16"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={saveNote}
                      disabled={savingNote}
                      className="flex-1 bg-gradient-calm hover:opacity-90 text-white"
                    >
                      {savingNote ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Note"
                      )}
                    </Button>
                    <Button onClick={() => setShowNewNote(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Recent Session Notes */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Session Notes</h2>
                <Button
                  onClick={() => setShowNewNote(!showNewNote)}
                  size="sm"
                  className="bg-primary hover:opacity-90 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Note
                </Button>
              </div>
              {recentNotes.length === 0 ? (
                <Card className="p-4 text-center text-muted-foreground">
                  No session notes yet
                </Card>
              ) : (
                <div className="space-y-3">
                  {recentNotes.map((note) => (
                    <Card key={note._id} className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">{note.clientName}</h3>
                          <p className="text-xs text-muted-foreground">{note.date}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{note.content}</p>
                      {note.followUp && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-xs text-blue-700">
                            <span className="font-medium">Follow-up:</span> {note.followUp}
                          </p>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Alerts */}
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">Alerts & Actions</h2>
              <div className="space-y-2">
                <Card className="p-3 border-red-200 bg-red-50">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-red-900">Total Clients</p>
                      <p className="text-xs text-red-700 mt-1">{clients.filter(c => c.status === "active").length} active client{clients.filter(c => c.status === "active").length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-3 border-yellow-200 bg-yellow-50">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-yellow-900">This Week</p>
                      <p className="text-xs text-yellow-700 mt-1">{stats.thisWeekSessions} sessions scheduled</p>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* Client List */}
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">Your Clients</h2>
              {clients.length === 0 ? (
                <Card className="p-3 text-center text-sm text-muted-foreground">
                  No clients assigned
                </Card>
              ) : (
                <div className="space-y-2">
                  {clients.map((client) => (
                    <Card key={client.id} className="p-3 hover:border-primary/50 cursor-pointer transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{client.name}</p>
                          <p className="text-xs text-muted-foreground">{client.issue}</p>
                          <p className="text-xs text-muted-foreground mt-1">Last: {client.lastSession}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                            client.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {client.status === "active" ? "Active" : "Completed"}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Resources for Counsellor */}
            <Card className="p-4 bg-gradient-calm text-white space-y-3">
              <h3 className="font-bold">📚 Resources</h3>
              <ul className="text-xs space-y-2 opacity-90">
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>CBT Worksheets Library</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Crisis Protocol Guide</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Referral Directory</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Assessment Tools</span>
                </li>
              </ul>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
