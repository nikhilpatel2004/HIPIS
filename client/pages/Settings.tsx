import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";

export default function Settings() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem("userName", userName);
    localStorage.setItem("userEmail", email);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleChangePassword = () => {
    if (newPassword.trim()) {
      // TODO: Implement actual password change in backend
      setSaveSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleSavePreferences = () => {
    localStorage.setItem("language", language);
    localStorage.setItem("notifications", notifications.toString());
    localStorage.setItem("theme", theme);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link to="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Page Title */}
        <section className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </section>

        {/* Success Message */}
        {saveSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            ✓ Changes saved successfully
          </div>
        )}

        {/* Profile Settings */}
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Profile Settings</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your full name"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@example.com"
                  className="h-10"
                />
              </div>

              <Button
                onClick={handleSaveProfile}
                className="bg-primary hover:opacity-90 text-white flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Password Settings */}
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Change Password</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                onClick={handleChangePassword}
                className="bg-primary hover:opacity-90 text-white flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Change Password
              </Button>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Preferences</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium">
                  Language
                </Label>
                <select
                  id="language"
                  title="Select language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme" className="text-sm font-medium">
                  Theme
                </Label>
                <select
                  id="theme"
                  title="Select theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="notifications"
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="rounded border-border cursor-pointer"
                />
                <label htmlFor="notifications" className="text-sm font-medium text-foreground cursor-pointer">
                  Enable notifications
                </label>
              </div>

              <Button
                onClick={handleSavePreferences}
                className="bg-primary hover:opacity-90 text-white flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Preferences
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
