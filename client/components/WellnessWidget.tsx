import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface MoodEntry {
  _id?: string;
  userId?: string;
  date: string;
  mood: string;
  stress: number;
  sleep: number;
  notes: string;
  energy: number;
  exercise?: boolean;
  createdAt?: string;
}

interface WellnessWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WellnessWidget({ isOpen, onClose }: WellnessWidgetProps) {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [selectedMood, setSelectedMood] = useState("😐");
  const [stressLevel, setStressLevel] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [notes, setNotes] = useState("");
  const [exercise, setExercise] = useState(false);

  const moods = ["😢", "😟", "😐", "🙂", "😊"];

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const loadEntries = async () => {
      if (!isOpen) return;
      if (!token || !userId) {
        setError("Please sign in to track wellness");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/wellness/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load entries");
        } else {
          setMoodEntries(data.data || []);
        }
      } catch (_err) {
        setError("Network error while loading");
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, [isOpen, token, userId]);

  const addMoodEntry = async () => {
    if (!token || !userId) {
      setError("Please sign in to save entries");
      return;
    }

    setSaving(true);
    setError("");
    const newEntry: MoodEntry = {
      userId,
      date: new Date().toISOString(),
      mood: selectedMood,
      stress: stressLevel,
      sleep: sleepHours,
      notes,
      energy: energyLevel,
      exercise,
    };

    try {
      const res = await fetch("/api/wellness", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEntry),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to save entry");
      } else {
        setMoodEntries((prev) => [data.data, ...prev]);
        setNotes("");
        setStressLevel(5);
        setSleepHours(7);
        setEnergyLevel(5);
        setExercise(false);
        setSelectedMood("😐");
      }
    } catch (_err) {
      setError("Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  const averageStress = useMemo(() => {
    if (!moodEntries.length) return 0;
    return Math.round(moodEntries.reduce((sum, entry) => sum + entry.stress, 0) / moodEntries.length);
  }, [moodEntries]);

  const averageEnergy = useMemo(() => {
    if (!moodEntries.length) return 0;
    return Math.round(moodEntries.reduce((sum, entry) => sum + entry.energy, 0) / moodEntries.length);
  }, [moodEntries]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-96 bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Daily Wellness Check-in</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
            title="Close"
            aria-label="Close wellness widget"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <Card className="p-2 border border-red-200 bg-red-50 text-xs text-red-700">
              {error}
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-2 bg-gradient-soft rounded-lg">
              <p className="text-xs text-muted-foreground">Avg Stress</p>
              <p className="text-lg font-bold text-primary">{averageStress}/10</p>
            </div>
            <div className="p-2 bg-gradient-soft rounded-lg">
              <p className="text-xs text-muted-foreground">Avg Energy</p>
              <p className="text-lg font-bold text-primary">{averageEnergy}/10</p>
            </div>
          </div>

          {/* Mood Selection */}
          <div>
            <Label className="text-xs font-medium block mb-2">How are you feeling?</Label>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`text-2xl p-2 rounded transition-all ${
                    selectedMood === mood ? "ring-2 ring-primary scale-110" : "opacity-60"
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Stress Level */}
          <div>
            <Label className="text-xs font-medium block mb-2" htmlFor="stress-slider">
              Stress: <span className="text-primary">{stressLevel}/10</span>
            </Label>
            <input
              id="stress-slider"
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full"
              title="Stress level"
              aria-label="Stress level"
            />
          </div>

          {/* Energy Level */}
          <div>
            <Label className="text-xs font-medium block mb-2" htmlFor="energy-slider">
              Energy: <span className="text-primary">{energyLevel}/10</span>
            </Label>
            <input
              id="energy-slider"
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full"
              title="Energy level"
              aria-label="Energy level"
            />
          </div>

          {/* Sleep Hours */}
          <div>
            <Label className="text-xs font-medium block mb-2" htmlFor="sleep-slider">
              Sleep: <span className="text-primary">{sleepHours}h</span>
            </Label>
            <input
              id="sleep-slider"
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full"
              title="Sleep hours"
              aria-label="Sleep hours"
            />
          </div>

          {/* Exercise Toggle */}
          <div className="flex items-center gap-2 text-xs">
            <input
              id="exercise"
              type="checkbox"
              checked={exercise}
              onChange={(e) => setExercise(e.target.checked)}
              className="rounded border-border"
              title="Exercise today"
              aria-label="Exercise today"
            />
            <Label htmlFor="exercise">Did you exercise today?</Label>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-xs font-medium block mb-1">Notes</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none h-16"
            />
          </div>

          {/* Recent Entries Preview */}
          {loading ? (
            <div className="text-xs text-muted-foreground">Loading your recent entries...</div>
          ) : moodEntries.length > 0 ? (
            <div className="text-xs">
              <p className="font-medium text-foreground mb-2">Recent:</p>
              {moodEntries.slice(0, 2).map((entry, i) => (
                <div key={i} className="p-2 bg-muted rounded text-xs mb-1">
                  <span className="text-lg">{entry.mood}</span> {entry.date?.slice(0, 10) || "Today"} - Stress: {entry.stress}/10
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">No entries yet. Log your first check-in!</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-border">
          <Button
            onClick={addMoodEntry}
            className="flex-1 bg-gradient-calm hover:opacity-90 text-white text-sm h-8"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Entry"}
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1 text-sm h-8">
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}
