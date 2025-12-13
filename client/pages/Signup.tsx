import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    role: "student",
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      setStep(2);
    } else {
      // Submit registration
      setLoading(true);

      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            university: formData.university
          })
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Registration failed");
          setLoading(false);
          return;
        }

        // Save token and user info
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userId", data.data.user._id);
        localStorage.setItem("userName", data.data.user.name);
        localStorage.setItem("userEmail", data.data.user.email);
        localStorage.setItem("userRole", data.data.user.role);

        // Navigate based on role
        if (data.data.user.role === "student") {
          navigate("/dashboard");
        } else if (data.data.user.role === "counsellor") {
          navigate("/counsellor-dashboard");
        } else {
          navigate("/admin-dashboard");
        }
      } catch (err) {
        console.error("Signup error:", err);
        setError("Network error. Please try again.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center px-4 py-8">
      {/* Back button */}
      <Link
        to="/"
        className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="hidden sm:inline">Back</span>
      </Link>

      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        <div className="mb-6 flex items-center gap-2">
          <div
            className={`h-2 flex-1 rounded-full transition-colors ${
              step >= 1 ? "bg-primary" : "bg-border"
            }`}
          />
          <div
            className={`h-2 flex-1 rounded-full transition-colors ${
              step >= 2 ? "bg-primary" : "bg-border"
            }`}
          />
        </div>

        <Card className="p-8 sm:p-10 space-y-6 animate-slide-up">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl bg-gradient-calm">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {step === 1 ? "Create Your Account" : "Complete Your Profile"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {step === 1
                ? "Join thousands of students taking control of their mental health"
                : "Help us personalize your experience"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                {/* Step 1: Basic Info */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters with uppercase, lowercase, and numbers
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">
                    I am a
                  </Label>
                  <select
                                        title="Select your role"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="student">Student</option>
                    <option value="counsellor">Counsellor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                {/* Step 2: University Info */}
                <div className="space-y-2">
                  <Label htmlFor="university" className="text-sm font-medium">
                    University / Institution (Optional)
                  </Label>
                  <Input
                    id="university"
                    name="university"
                    type="text"
                    placeholder="e.g., Delhi University"
                    value={formData.university}
                    onChange={handleChange}
                    className="h-10"
                  />
                </div>

                {/* Safety & Privacy */}
                <div className="space-y-3 bg-gradient-soft rounded-lg p-4 border border-primary/20">
                  <p className="text-sm font-medium text-foreground">Your Privacy is Protected</p>
                  <ul className="space-y-2">
                    {[
                      "All conversations are encrypted",
                      "Anonymous options available",
                      "No data sharing without consent",
                      "Compliant with privacy laws",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                  <input type="checkbox" className="mt-1" required />
                  <span>
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-calm hover:opacity-90 text-white font-semibold h-10"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : step === 1 ? (
                "Continue"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
