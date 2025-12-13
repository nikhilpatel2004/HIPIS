import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, TrendingUp, AlertCircle, Plus } from "lucide-react";

interface MoodEntry {
  date: string;
  mood: string;
  stress: number;
  sleep: number;
  notes: string;
  energy: number;
  exercise: boolean;
}

export default function Wellness() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    { date: "Today", mood: "😐", stress: 6, sleep: 6, notes: "Feeling neutral, bit stressed about exams", energy: 5, exercise: false },
    { date: "Yesterday", mood: "😊", stress: 4, sleep: 7, notes: "Had a good day, productive session", energy: 8, exercise: true },
    { date: "2 days ago", mood: "😟", stress: 8, sleep: 4, notes: "Couldn't sleep much, anxious", energy: 3, exercise: false },
    { date: "3 days ago", mood: "🙂", stress: 5, sleep: 7, notes: "Better day overall", energy: 7, exercise: true },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [selectedMood, setSelectedMood] = useState("😐");
  const [stressLevel, setStressLevel] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [exerciseDone, setExerciseDone] = useState(false);
  const [notes, setNotes] = useState("");

  const moods = ["😢", "😟", "😐", "🙂", "😊"];

  const addMoodEntry = () => {
    const newEntry: MoodEntry = {
      date: "Today",
      mood: selectedMood,
      stress: stressLevel,
      sleep: sleepHours,
      notes,
      energy: energyLevel,
      exercise: exerciseDone,
    };
    setMoodEntries([newEntry, ...moodEntries]);
    setShowForm(false);
    setNotes("");
    setStressLevel(5);
    setSleepHours(7);
    setEnergyLevel(5);
    setExerciseDone(false);
    setSelectedMood("😐");
  };

  const averageStress = Math.round(
    moodEntries.reduce((sum, entry) => sum + entry.stress, 0) / moodEntries.length
  );
  const averageSleep = (
    moodEntries.reduce((sum, entry) => sum + entry.sleep, 0) / moodEntries.length
  ).toFixed(1);
  const averageEnergy = Math.round(
    moodEntries.reduce((sum, entry) => sum + entry.energy, 0) / moodEntries.length
  );
  const exerciseCount = moodEntries.filter((e) => e.exercise).length;

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
          <h1 className="text-lg font-bold text-foreground">Wellness Tracker</h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:opacity-90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Log Mood</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-5 gap-4">
          <Card className="p-6 bg-gradient-soft border-primary/20">
            <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
            <p className="text-3xl font-bold text-primary mt-2">{moodEntries.length}</p>
          </Card>
          <Card className="p-6 bg-gradient-soft border-primary/20">
            <p className="text-sm font-medium text-muted-foreground">Avg Stress</p>
            <p className="text-3xl font-bold text-primary mt-2">{averageStress}/10</p>
          </Card>
          <Card className="p-6 bg-gradient-soft border-primary/20">
            <p className="text-sm font-medium text-muted-foreground">Avg Sleep</p>
            <p className="text-3xl font-bold text-primary mt-2">{averageSleep}h</p>
          </Card>
          <Card className="p-6 bg-gradient-soft border-primary/20">
            <p className="text-sm font-medium text-muted-foreground">Avg Energy</p>
            <p className="text-3xl font-bold text-primary mt-2">{averageEnergy}/10</p>
          </Card>
          <Card className="p-6 bg-gradient-soft border-secondary/20">
            <p className="text-sm font-medium text-muted-foreground">Workouts</p>
            <p className="text-3xl font-bold text-secondary mt-2">{exerciseCount}</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mood Log Form */}
          {showForm && (
            <Card className="lg:col-span-1 p-6 sticky top-20 space-y-4 animate-slide-up">
              <h2 className="text-xl font-bold text-foreground">Log Your Mood</h2>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium block mb-3">How are you feeling?</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {moods.map((mood) => (
                      <button
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        className={`text-3xl p-3 rounded-lg transition-all ${
                          selectedMood === mood
                            ? "ring-2 ring-primary scale-110"
                            : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium block mb-2">
                    Stress Level: <span className="text-primary font-bold">{stressLevel}/10</span>
                  </Label>
                  <input
                    id="stress-level"
                    title="Adjust stress level"
                    type="range"
                    min="1"
                    max="10"
                    value={stressLevel}
                    onChange={(e) => setStressLevel(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="sleep" className="text-sm font-medium block mb-2">
                    Sleep Last Night: <span className="text-primary font-bold">{sleepHours}h</span>
                  </Label>
                  <input
                    id="sleep"
                    title="Hours of sleep"
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="energy-level" className="text-sm font-medium block mb-2">
                    Energy Level: <span className="text-primary font-bold">{energyLevel}/10</span>
                  </Label>
                  <input
                    id="energy-level"
                    title="Adjust energy level"
                    type="range"
                    min="1"
                    max="10"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exerciseDone}
                    onChange={(e) => setExerciseDone(e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm font-medium text-foreground">Did exercise today 💪</span>
                </label>

                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Notes (optional)
                  </Label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full mt-1 p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                  />
                </div>

                <Button
                  onClick={addMoodEntry}
                  className="w-full bg-gradient-calm hover:opacity-90 text-white"
                >
                  Save Entry
                </Button>
              </div>
            </Card>
          )}

          {/* Main Content */}
          <div className={`${showForm ? "lg:col-span-2" : "lg:col-span-3"} space-y-6`}>
            {/* Trend Chart */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Stress & Sleep Trends (Last 7 Days)
              </h2>

              <div className="space-y-6">
                {/* Stress Chart */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-foreground">Stress Levels</p>
                    <p className="text-xs text-muted-foreground">Lower is better</p>
                  </div>
                  <div className="flex items-end gap-2 h-32">
                    {moodEntries.slice(0, 7).map((entry, i) => (
                      <div key={i} className="flex-1 group">
                        <div
                          className="w-full bg-gradient-to-t from-red-400 to-red-300 rounded-t cursor-pointer transition-all hover:opacity-80"
                          style={{ height: `${(entry.stress / 10) * 100}%`, minHeight: "20px" }}
                          title={`${entry.date}: Stress ${entry.stress}/10`}
                        />
                        <p className="text-xs text-center text-muted-foreground mt-2">
                          {entry.date.split(" ")[0]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sleep Chart */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-foreground">Sleep Hours</p>
                    <p className="text-xs text-muted-foreground">Target: 7-9 hours</p>
                  </div>
                  <div className="flex items-end gap-2 h-32">
                    {moodEntries.slice(0, 7).map((entry, i) => (
                      <div key={i} className="flex-1 group">
                        <div
                          className={`w-full rounded-t cursor-pointer transition-all hover:opacity-80 ${
                            entry.sleep >= 7
                              ? "bg-gradient-to-t from-green-400 to-green-300"
                              : "bg-gradient-to-t from-yellow-400 to-yellow-300"
                          }`}
                          style={{ height: `${(entry.sleep / 12) * 100}%`, minHeight: "20px" }}
                          title={`${entry.date}: ${entry.sleep}h sleep`}
                        />
                        <p className="text-xs text-center text-muted-foreground mt-2">
                          {entry.date.split(" ")[0]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Energy Chart */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-foreground">Energy Levels</p>
                    <p className="text-xs text-muted-foreground">Higher is better</p>
                  </div>
                  <div className="flex items-end gap-2 h-32">
                    {moodEntries.slice(0, 7).map((entry, i) => (
                      <div key={i} className="flex-1 group">
                        <div
                          className="w-full bg-gradient-to-t from-purple-400 to-purple-300 rounded-t cursor-pointer transition-all hover:opacity-80"
                          style={{ height: `${(entry.energy / 10) * 100}%`, minHeight: "20px" }}
                          title={`${entry.date}: Energy ${entry.energy}/10`}
                        />
                        <p className="text-xs text-center text-muted-foreground mt-2">
                          {entry.date.split(" ")[0]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Mood History */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">Recent Entries</h2>
              <div className="space-y-3">
                {moodEntries.map((entry, i) => (
                  <Card key={i} className="p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-3xl">{entry.mood}</div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{entry.date}</p>
                          {entry.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs">
                            {entry.exercise && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">💪 Exercise</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm space-y-1">
                        <p className="text-muted-foreground">
                          Stress: <span className="text-foreground font-medium">{entry.stress}/10</span>
                        </p>
                        <p className="text-muted-foreground">
                          Energy: <span className="text-foreground font-medium">{entry.energy}/10</span>
                        </p>
                        <p className="text-muted-foreground">
                          Sleep: <span className="text-foreground font-medium">{entry.sleep}h</span>
                        </p>
                      </div>
                    </div>

                    {/* Alerts */}
                    {entry.stress >= 8 && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-700">
                          High stress detected. Consider using relaxation techniques or reaching out for support.
                        </p>
                      </div>
                    )}

                    {entry.sleep < 5 && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-yellow-700">
                          Low sleep detected. Aim for 7-9 hours for better mental health.
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </section>

            {/* Tips */}
            <Card className="p-6 bg-gradient-calm text-white space-y-4">
              <h3 className="text-lg font-bold">💡 Wellness Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Maintain consistent sleep schedule - Aim for 7-9 hours nightly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Regular exercise reduces stress and improves mood</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Track patterns - Notice what triggers stress or improves mood</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Practice mindfulness - Just 5-10 minutes daily can help</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
