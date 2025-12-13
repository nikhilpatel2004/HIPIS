import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, AlertCircle, TrendingDown } from "lucide-react";

type AssessmentType = "phq9" | "gad7" | "ghq12" | null;

interface AssessmentResult {
  type: string;
  score: number;
  severity: string;
  interpretation: string;
  recommendations: string[];
  date: string;
  _id?: string;
}

export default function Assessments() {
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentType>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const phq9Questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself or that you are a failure",
    "Trouble concentrating on things",
    "Moving or speaking so slowly or being fidgety/restless",
    "Thoughts that you would be better off dead or hurting yourself",
  ];

  const gad7Questions = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it's hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen",
  ];

  const ghq12Questions = [
    "Been able to concentrate on what you're doing?",
    "Lost much sleep over worry?",
    "Felt that you are playing a useful part in things?",
    "Felt capable of making decisions about things?",
    "Felt constantly under strain?",
    "Felt you couldn't overcome your difficulties?",
    "Been able to enjoy your normal day-to-day activities?",
    "Been able to face up to your problems?",
    "Been feeling unhappy and depressed?",
    "Been losing confidence in yourself?",
    "Been thinking of yourself as a worthless person?",
    "Been feeling reasonably happy, all things considered?",
  ];

  const getQuestions = () => {
    switch (currentAssessment) {
      case "phq9":
        return phq9Questions;
      case "gad7":
        return gad7Questions;
      case "ghq12":
        return ghq12Questions;
      default:
        return [];
    }
  };

  const calculateScore = () => {
    const score = answers.reduce((sum, val) => sum + val, 0);
    const maxScore = currentAssessment === "ghq12" ? 36 : currentAssessment === "gad7" ? 21 : 27;
    
    let severity = "";
    let interpretation = "";
    let recommendations: string[] = [];

    if (currentAssessment === "phq9") {
      if (score < 5) {
        severity = "Minimal";
        interpretation = "You have minimal depressive symptoms. Continue maintaining good mental health habits.";
      } else if (score < 10) {
        severity = "Mild";
        interpretation = "You have mild depressive symptoms. Consider lifestyle changes and monitor your mood.";
      } else if (score < 15) {
        severity = "Moderate";
        interpretation = "You have moderate depressive symptoms. Professional support may be helpful.";
      } else if (score < 20) {
        severity = "Moderately Severe";
        interpretation = "You have moderately severe depressive symptoms. Please reach out to a counselor.";
      } else {
        severity = "Severe";
        interpretation = "You have severe depressive symptoms. Professional support is recommended.";
      }
      recommendations = [
        "Connect with a counsellor",
        "Practice self-care routines",
        "Stay socially connected",
        "Maintain regular sleep schedule",
      ];
    } else if (currentAssessment === "gad7") {
      if (score < 5) {
        severity = "Minimal";
        interpretation = "You have minimal anxiety symptoms. Keep up your current coping strategies.";
      } else if (score < 10) {
        severity = "Mild";
        interpretation = "You have mild anxiety symptoms. Try relaxation techniques and stress management.";
      } else if (score < 15) {
        severity = "Moderate";
        interpretation = "You have moderate anxiety symptoms. Professional support is recommended.";
      } else {
        severity = "Severe";
        interpretation = "You have severe anxiety symptoms. Please reach out to a counselor.";
      }
      recommendations = [
        "Practice breathing exercises",
        "Try mindfulness meditation",
        "Limit caffeine intake",
        "Seek professional help",
      ];
    } else if (currentAssessment === "ghq12") {
      if (score < 12) {
        severity = "Good";
        interpretation = "You appear to be in good mental health.";
      } else if (score < 24) {
        severity = "Fair";
        interpretation = "You may be experiencing some psychological distress. Consider support.";
      } else {
        severity = "Poor";
        interpretation = "You appear to be experiencing significant psychological distress.";
      }
      recommendations = [
        "Reach out to a counselor",
        "Practice self-care",
        "Build a support network",
        "Seek professional assessment",
      ];
    }

    return { score, severity, interpretation, recommendations };
  };

  // Load past results
  useEffect(() => {
    const fetchResults = async () => {
      if (!token || !userId) {
        setError("Please sign in to view and save assessments.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/assessments/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load assessments");
        } else {
          setResults(data.data || []);
        }
      } catch (_err) {
        setError("Network error while loading assessments");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [token, userId]);

  const startAssessment = (type: AssessmentType) => {
    setCurrentAssessment(type);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < getQuestions().length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Assessment complete
      const { score, severity, interpretation, recommendations } = calculateScore();
      const assessmentMap: Record<AssessmentType, string> = {
        phq9: "PHQ-9",
        gad7: "GAD-7",
        ghq12: "GHQ-12",
        null: "",
      };

      const newResult: AssessmentResult = {
        type: assessmentMap[currentAssessment!],
        score,
        severity,
        interpretation,
        recommendations,
        date: new Date().toISOString(),
      };

      const saveResult = async () => {
        if (!token || !userId) {
          setError("Please sign in to save your assessment results.");
          setResults([newResult, ...results]);
          resetAssessment();
          return;
        }

        try {
          setSaving(true);
          const res = await fetch("/api/assessments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              type: newResult.type,
              score: newResult.score,
              severity: newResult.severity,
              interpretation: newResult.interpretation,
              recommendations: newResult.recommendations,
              answers: newAnswers,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            setError(data.message || "Failed to save assessment");
            setResults([newResult, ...results]); // still show locally
          } else {
            setResults([data.data, ...results]);
          }
        } catch (_err) {
          setError("Network error while saving assessment");
          setResults([newResult, ...results]);
        } finally {
          setSaving(false);
          resetAssessment();
        }
      };

      const resetAssessment = () => {
        setCurrentAssessment(null);
        setCurrentQuestion(0);
        setAnswers([]);
      };

      saveResult();
    }
  };

  const skipAnswer = () => {
    handleAnswer(0);
  };

  const disableActions = useMemo(() => !token || !userId, [token, userId]);

  if (currentAssessment) {
    const questions = getQuestions();
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
        <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <button
              onClick={() => setCurrentAssessment(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <h1 className="text-lg font-bold text-foreground">
              {currentAssessment === "phq9" && "PHQ-9 Depression Assessment"}
              {currentAssessment === "gad7" && "GAD-7 Anxiety Assessment"}
              {currentAssessment === "ghq12" && "GHQ-12 Wellness Assessment"}
            </h1>
            <div className="text-sm text-muted-foreground">
              {currentQuestion + 1} / {questions.length}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-calm transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}% Complete</p>
          </div>

          {/* Question */}
          <Card className="p-8 space-y-6 animate-slide-up">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">
                Question {currentQuestion + 1}
              </h2>
              <p className="text-lg text-foreground">{questions[currentQuestion]}</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentAssessment === "phq9" || currentAssessment === "gad7" ? (
                [
                  { value: 0, label: "Not at all", color: "text-green-600" },
                  { value: 1, label: "Several days", color: "text-yellow-600" },
                  { value: 2, label: "More than half the days", color: "text-orange-600" },
                  { value: 3, label: "Nearly every day", color: "text-red-600" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      answers[currentQuestion] === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className={`font-medium ${option.color}`}>{option.label}</span>
                  </button>
                ))
              ) : (
                [
                  { value: 3, label: "Better than usual", color: "text-green-600" },
                  { value: 2, label: "Same as usual", color: "text-yellow-600" },
                  { value: 1, label: "Worse than usual", color: "text-orange-600" },
                  { value: 0, label: "Much worse than usual", color: "text-red-600" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      answers[currentQuestion] === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className={`font-medium ${option.color}`}>{option.label}</span>
                  </button>
                ))
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={skipAnswer} variant="outline" className="flex-1">
                Skip
              </Button>
              <Button
                onClick={() => handleAnswer(answers[currentQuestion] ?? 0)}
                className="flex-1 bg-primary hover:opacity-90 text-white"
              >
                {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
              </Button>
            </div>

            {saving && (
              <p className="text-xs text-muted-foreground text-center">Saving your result...</p>
            )}
            {disableActions && (
              <p className="text-xs text-red-600 text-center">
                Sign in to save your progress and results.
              </p>
            )}
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-8 h-16">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-lg font-bold text-foreground">Mental Health Assessments</h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Info */}
        <Card className="p-6 bg-blue-50 border-blue-200 space-y-2">
          <p className="font-medium text-blue-900 text-sm">
            ℹ️ These assessments are screening tools, not diagnoses
          </p>
          <p className="text-xs text-blue-700">
            For professional evaluation and treatment, please consult with a qualified mental health professional. Results are for your personal reference.
          </p>
        </Card>

        {error && (
          <Card className="p-3 border border-red-200 bg-red-50 text-sm text-red-700">
            {error}
          </Card>
        )}

        {/* Available Assessments */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Available Assessments</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                id: "phq9",
                title: "PHQ-9 Depression Scale",
                description: "Assess depressive symptoms and severity",
                questions: 9,
                icon: "💙",
                color: "from-blue-400 to-blue-600",
              },
              {
                id: "gad7",
                title: "GAD-7 Anxiety Scale",
                description: "Evaluate anxiety symptoms and levels",
                questions: 7,
                icon: "🌿",
                color: "from-green-400 to-green-600",
              },
              {
                id: "ghq12",
                title: "GHQ-12 Wellness Check",
                description: "Overall psychological well-being assessment",
                questions: 12,
                icon: "⭐",
                color: "from-yellow-400 to-yellow-600",
              },
            ].map((assessment) => (
              <Card
                key={assessment.id}
                className="p-6 hover:shadow-lg transition-all cursor-pointer group animate-slide-up"
              >
                <div className={`h-20 rounded-lg bg-gradient-to-br ${assessment.color} flex items-center justify-center mb-4`}>
                  <span className="text-4xl">{assessment.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {assessment.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">{assessment.description}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  {assessment.questions} questions • ~5 minutes
                </p>
                <Button
                  onClick={() => startAssessment(assessment.id as AssessmentType)}
                  className="w-full mt-4 bg-primary hover:opacity-90 text-white"
                  disabled={disableActions}
                >
                  {disableActions ? "Sign in to start" : "Start Assessment"}
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Past Results */}
        {loading ? (
          <Card className="p-6">Loading your results...</Card>
        ) : results.length > 0 ? (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Assessment Results</h2>
            <div className="space-y-4">
              {results.map((result, index) => (
                <Card key={index} className="p-6 space-y-4 animate-slide-up">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{result.type}</h3>
                      <p className="text-sm text-muted-foreground">{result.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">{result.score}</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                          result.severity === "Minimal" || result.severity === "Good"
                            ? "bg-green-100 text-green-700"
                            : result.severity === "Mild" || result.severity === "Fair"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {result.severity}
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-foreground">{result.interpretation}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Recommendations:</p>
                    <ul className="space-y-1">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ) : (
          <Card className="p-6 text-sm text-muted-foreground">No assessments yet. Start one above to see your progress.</Card>
        )}

        {/* Resources */}
        <Card className="p-6 bg-gradient-calm text-white space-y-4">
          <h3 className="text-lg font-bold">💬 Need Support?</h3>
          <p className="text-sm opacity-90">
            If your assessment results indicate significant symptoms, please reach out to a counselor or mental health professional.
          </p>
          <Button
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            onClick={async () => {
              if (!token || !userId) {
                setError("Please sign in to contact a counselor.");
                return;
              }
              setSaving(true);
              setError("");
              try {
                const res = await fetch("/api/support/contact", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ source: "assessments" }),
                });
                const data = await res.json();
                if (!res.ok) {
                  setError(data.message || "Failed to send request");
                } else {
                  alert("Request sent. An admin counselor will reach out soon.");
                }
              } catch (_err) {
                setError("Network error while sending request");
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
          >
            {saving ? "Sending..." : "Contact a Counselor"}
          </Button>
        </Card>
      </main>
    </div>
  );
}
