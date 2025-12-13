import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, Clock, User, MapPin, Bell, Plus, Edit2, Trash2, CheckCircle2, Loader2 } from "lucide-react";

interface Appointment {
  _id: string;
  counsellor: any;
  userId: any;
  date: string;
  time: string;
  type: "video-call" | "in-person" | "phone" | "individual" | "group" | "crisis";
  status: "upcoming" | "completed" | "cancelled";
}

interface Counselor {
  _id: string;
  name: string;
  email: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [selectedType, setSelectedType] = useState<"video-call" | "in-person" | "phone">("video-call");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    loadAppointments();
    loadCounselors();
  }, []);

  const loadAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!userId) return;

      const response = await fetch(`/api/appointments/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.data || []);
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCounselors = async () => {
    try {
      // Fetch users with counselor role from backend
      const response = await fetch("/api/resources"); // Using resources as a temp way to get all users
      if (response.ok) {
        // For now, we'll use mock counselors since we don't have a dedicated endpoint
        setCounselors([
          { _id: "1", name: "Dr. Priya Sharma", email: "priya@university.edu" },
          { _id: "2", name: "Ms. Anjali Patel", email: "anjali@university.edu" },
          { _id: "3", name: "Dr. Rajesh Kumar", email: "rajesh@university.edu" },
          { _id: "4", name: "Ms. Neha Singh", email: "neha@university.edu" },
          { _id: "5", name: "Dr. Amit Verma", email: "amit@university.edu" }
        ]);
      }
    } catch (error) {
      console.error("Error loading counselors:", error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video-call":
        return "📹";
      case "in-person":
        return "🏢";
      case "phone":
        return "☎️";
      default:
        return "📅";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-green-50 border-green-200 text-green-700";
      case "completed":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "cancelled":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedCounselor || !selectedDate || !selectedTime) {
      alert("Please fill all fields");
      return;
    }

    try {
      setBookingLoading(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          counsellor: selectedCounselor,
          type: selectedType,
          date: new Date(selectedDate),
          time: selectedTime
        })
      });

      if (response.ok) {
        await loadAppointments();
        setShowBooking(false);
        setSelectedCounselor("");
        setSelectedDate("");
        setSelectedTime("");
        alert("Appointment booked successfully!");
      } else {
        alert("Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Error booking appointment");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/appointments/${appointmentId}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        await loadAppointments();
        alert("Appointment cancelled");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Error cancelling appointment");
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
            to="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-lg font-bold text-foreground">Appointment Booking</h1>
          <Button onClick={() => setShowBooking(!showBooking)} className="bg-primary hover:opacity-90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Book Now</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          {showBooking && (
            <div className="lg:col-span-1 animate-slide-up">
              <Card className="p-6 sticky top-20 space-y-4">
                <h2 className="text-xl font-bold text-foreground">Book an Appointment</h2>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="counselor" className="text-sm font-medium">
                      Select Counsellor
                    </Label>
                    <select
                                            title="Select a counsellor"
                      id="counselor"
                      value={selectedCounselor}
                      onChange={(e) => setSelectedCounselor(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                    >
                      <option value="">Choose a counsellor...</option>
                      {counselors.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Session Type</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {[
                        { value: "video-call", label: "Video Call", icon: "📹" },
                        { value: "in-person", label: "In-Person", icon: "🏢" },
                        { value: "phone", label: "Phone", icon: "☎️" },
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setSelectedType(type.value as any)}
                          className={`p-2 rounded-lg text-sm font-medium text-center transition-all ${
                            selectedType === type.value
                              ? "bg-primary text-white"
                              : "bg-muted text-foreground border border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="text-lg">{type.icon}</div>
                          <div className="text-xs">{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="date" className="text-sm font-medium">
                      Preferred Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="mt-1 h-10"
                    />
                  </div>

                  <div>
                    <Label htmlFor="time" className="text-sm font-medium">
                      Preferred Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="mt-1 h-10"
                    />
                  </div>

                  <Button 
                    onClick={handleBookAppointment}
                    disabled={bookingLoading}
                    className="w-full bg-gradient-calm hover:opacity-90 text-white"
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      "Book Appointment"
                    )}
                  </Button>
                </div>

                {/* Reminder Option */}
                <div className="border-t border-border pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-1" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Send Reminders</p>
                      <p className="text-xs text-muted-foreground">24h & 1h before appointment</p>
                    </div>
                  </label>
                </div>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className={`${showBooking ? "lg:col-span-2" : "lg:col-span-3"} space-y-8`}>
            {/* Upcoming Appointments */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">My Appointments</h2>

              <div className="space-y-4">
                {appointments.filter((a) => a.status === "upcoming").length > 0 ? (
                  appointments
                    .filter((a) => a.status === "upcoming")
                    .map((apt) => (
                      <Card
                        key={apt._id}
                        className="p-6 border-primary/20 bg-gradient-soft hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">👨‍⚕️</div>
                            <div>
                              <h3 className="text-lg font-bold text-foreground">
                                {typeof apt.counsellor === 'string' ? apt.counsellor : apt.counsellor?.name || "Counsellor"}
                              </h3>
                              <p className="text-sm text-muted-foreground">Professional Counselor</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-foreground">{new Date(apt.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-foreground">{apt.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-lg">{getTypeIcon(apt.type)}</span>
                            <span className="text-foreground capitalize">{apt.type.replace("-", " ")}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Reschedule
                          </Button>
                          <Button variant="outline" size="sm">
                            <Bell className="h-4 w-4 mr-2" />
                            Set Reminder
                          </Button>
                          <Button 
                            onClick={() => handleCancelAppointment(apt._id)}
                            variant="outline" 
                            size="sm" 
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </Card>
                    ))
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No upcoming appointments. Book one now!</p>
                  </Card>
                )}
              </div>
            </section>

            {/* Past Appointments */}
            {appointments.filter((a) => a.status === "completed").length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Past Appointments</h2>
                <div className="space-y-3">
                  {appointments
                    .filter((a) => a.status === "completed")
                    .map((apt) => (
                      <Card key={apt._id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium text-foreground">
                              {typeof apt.counsellor === 'string' ? apt.counsellor : apt.counsellor?.name || "Counsellor"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(apt.date).toLocaleDateString()} at {apt.time}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Notes
                        </Button>
                      </Card>
                    ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
