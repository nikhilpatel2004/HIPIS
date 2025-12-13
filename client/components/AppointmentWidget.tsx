import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Plus, Edit2, Trash2, X } from "lucide-react";

interface Appointment {
  id: string;
  counsellor: string;
  specialization: string;
  date: string;
  time: string;
  type: "video-call" | "in-person" | "phone";
  status: "upcoming" | "completed" | "cancelled";
  avatar: string;
}

interface AppointmentWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultCounsellors = [
  { id: 1, name: "Dr. Priya Sharma", specialization: "Anxiety & Stress", avatar: "👩‍⚕️" },
  { id: 2, name: "Ms. Anjali Patel", specialization: "Academic Pressure", avatar: "👩‍🎓" },
  { id: 3, name: "Dr. Rajesh Kumar", specialization: "Depression Support", avatar: "👨‍⚕️" },
  { id: 4, name: "Ms. Neha Singh", specialization: "Sleep Issues", avatar: "👩‍⚕️" },
];

export default function AppointmentWidget({ isOpen, onClose }: AppointmentWidgetProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      counsellor: "Dr. Priya Sharma",
      specialization: "Anxiety & Stress",
      date: "Tomorrow",
      time: "2:00 PM",
      type: "video-call",
      status: "upcoming",
      avatar: "👩‍⚕️",
    },
    {
      id: "2",
      counsellor: "Ms. Anjali Patel",
      specialization: "Academic Pressure",
      date: "Friday",
      time: "4:00 PM",
      type: "in-person",
      status: "upcoming",
      avatar: "👩‍🎓",
    },
  ]);

  const [showBooking, setShowBooking] = useState(false);
  const [selectedCounsellor, setSelectedCounsellor] = useState("");
  const [selectedType, setSelectedType] = useState<"video-call" | "in-person" | "phone">("video-call");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

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

  const handleBookAppointment = () => {
    if (selectedCounsellor && selectedDate && selectedTime) {
      const counsellor = defaultCounsellors.find((c) => c.id.toString() === selectedCounsellor);
      if (counsellor) {
        const newAppointment: Appointment = {
          id: Date.now().toString(),
          counsellor: counsellor.name,
          specialization: counsellor.specialization,
          date: new Date(selectedDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          time: selectedTime,
          type: selectedType,
          status: "upcoming",
          avatar: counsellor.avatar,
        };
        setAppointments([...appointments, newAppointment]);
        setSelectedCounsellor("");
        setSelectedDate("");
        setSelectedTime("");
        setShowBooking(false);
      }
    }
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
  };

  if (!isOpen) return null;

  const upcomingAppointments = appointments.filter((a) => a.status === "upcoming");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-96 bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">My Appointments</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!showBooking ? (
            <>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAppointments.map((apt) => (
                    <Card key={apt.id} className="p-3 border-primary/20 bg-gradient-soft">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 flex-1">
                          <span className="text-2xl">{apt.avatar}</span>
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground text-sm">{apt.counsellor}</h3>
                            <p className="text-xs text-muted-foreground">{apt.specialization}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {apt.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {apt.time}
                              </span>
                              <span>{getTypeIcon(apt.type)}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCancelAppointment(apt.id)}
                          className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                          title="Cancel appointment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-sm">No upcoming appointments</p>
                </div>
              )}

              <Button
                onClick={() => setShowBooking(true)}
                className="w-full bg-gradient-calm hover:opacity-90 text-white mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Book New Appointment
              </Button>
            </>
          ) : (
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Select Counsellor</h3>
              <div className="space-y-2">
                {defaultCounsellors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCounsellor(c.id.toString())}
                    className={`w-full p-2 rounded-lg border text-left text-sm transition-all ${
                      selectedCounsellor === c.id.toString()
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-lg">{c.avatar}</span> {c.name}
                  </button>
                ))}
              </div>

              <div>
                <Label className="text-xs font-medium">Session Type</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[
                    { value: "video-call", icon: "📹" },
                    { value: "in-person", icon: "🏢" },
                    { value: "phone", icon: "☎️" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value as any)}
                      className={`p-2 rounded text-sm transition-all ${
                        selectedType === type.value
                          ? "bg-primary text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {type.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium">Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-8 text-sm mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-medium">Time</Label>
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="h-8 text-sm mt-1"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleBookAppointment}
                  className="flex-1 bg-gradient-calm hover:opacity-90 text-white text-sm h-8"
                >
                  Book
                </Button>
                <Button
                  onClick={() => setShowBooking(false)}
                  variant="outline"
                  className="flex-1 text-sm h-8"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
