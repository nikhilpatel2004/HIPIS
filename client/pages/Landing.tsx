import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MessageCircle,
  Calendar,
  TrendingUp,
  Users,
  BookOpen,
  Heart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Landing() {
  const faqs = [
    {
      question: "Is HIPIS really confidential?",
      answer:
        "Yes. Conversations, appointments, and assessments are encrypted. You control what you share with counselors and peers.",
    },
    {
      question: "Do I need to pay for sessions?",
      answer:
        "Students access AI support free. Counselor sessions follow your institution's policy; many are subsidized or free.",
    },
    {
      question: "Which languages are supported?",
      answer:
        "English and Hindi by default, with regional language rollouts planned. Resources include bilingual explainers.",
    },
    {
      question: "How fast can I book an appointment?",
      answer:
        "Most students book within minutes and get a slot within 24-72 hours depending on counselor load.",
    },
  ];
  const features = [
    {
      icon: MessageCircle,
      title: "AI Chatbot Support",
      description:
        "24/7 mental health guidance with CBT-based coping strategies and emotion detection",
    },
    {
      icon: Calendar,
      title: "Appointment Booking",
      description:
        "Schedule confidential sessions with on-campus counsellors or helpline support",
    },
    {
      icon: BookOpen,
      title: "Resource Hub",
      description:
        "Multilingual psychoeducational materials on stress, anxiety, depression, and more",
    },
    {
      icon: Users,
      title: "Peer Support Forum",
      description:
        "Safe, anonymous community space for students to share and support each other",
    },
    {
      icon: TrendingUp,
      title: "Wellness Tracker",
      description:
        "Monitor mood, stress levels, and complete validated assessments (PHQ-9, GAD-7)",
    },
    {
      icon: Heart,
      title: "Analytics Dashboard",
      description:
        "Data-driven insights for institutions to improve student mental health services",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-calm">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-primary">HIPIS</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-gradient-calm hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Your Mental Health,{" "}
                <span className="bg-gradient-calm bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                A secure, culturally-aware mental health support system designed specifically for
                Indian college students. Access AI-guided support, counselling appointments, peer
                community, and wellness tracking—all in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-calm hover:opacity-90 text-white font-semibold"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Already Have an Account
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>100% Confidential & Anonymous</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>24/7 Support Available</span>
              </div>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative animate-fade-in">
            <div className="absolute inset-0 bg-gradient-calm rounded-2xl opacity-10 blur-3xl" />
            <div className="relative bg-gradient-soft rounded-2xl border border-border p-8 sm:p-12">
              <div className="aspect-video bg-gradient-calm rounded-xl flex items-center justify-center">
                <Heart className="h-20 w-20 text-white opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support & Help */}
      <section id="help-center" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-8 bg-gradient-soft border-primary/20">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide">Support</p>
              <h2 className="text-3xl font-bold text-foreground">Need help right now?</h2>
              <p className="text-muted-foreground">
                Chat instantly, book a counselor, or browse our help center. If you're in crisis, please reach out to your campus helpline immediately.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link to="/chatbot">
                  <Button className="w-full bg-gradient-calm text-white hover:opacity-90">Open Chatbot</Button>
                </Link>
                <Link to="/appointments">
                  <Button variant="outline" className="w-full">Book Appointment</Button>
                </Link>
                <Link to="/resources">
                  <Button variant="secondary" className="w-full">Help Center</Button>
                </Link>
                <a href="mailto:support@hipis.app">
                  <Button variant="ghost" className="w-full">Contact Us</Button>
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-8 border-border/60">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Live status</p>
                <p className="text-sm text-muted-foreground">Services are online. Average counselor response: under 2 hours.</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-muted-foreground">Appointments this week</p>
                <p className="text-2xl font-bold text-foreground">118</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-muted-foreground">Resources viewed</p>
                <p className="text-2xl font-bold text-foreground">2,430</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-muted-foreground">Forum replies</p>
                <p className="text-2xl font-bold text-foreground">540</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-muted-foreground">AI chats today</p>
                <p className="text-2xl font-bold text-foreground">860</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">FAQ</p>
          <h2 className="text-3xl font-bold text-foreground">Answers for students & counselors</h2>
          <p className="text-muted-foreground">
            Quick answers to the most common questions from Indian college students using HIPIS.
          </p>
        </div>
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {faqs.map((item, idx) => (
            <Card key={idx} className="p-6 bg-muted/40 border-border/60">
              <h3 className="font-semibold text-foreground mb-2">{item.question}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Legal & Privacy Highlights */}
      <section id="legal" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <Card id="privacy" className="p-6 border-border/60">
            <h3 className="text-lg font-semibold text-foreground mb-2">Privacy Policy (Summary)</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We do not sell data. We encrypt chats and store clinical data securely. You can request data export or deletion anytime via support@hipis.app.
            </p>
          </Card>
          <Card id="terms" className="p-6 border-border/60">
            <h3 className="text-lg font-semibold text-foreground mb-2">Terms of Service (Summary)</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              HIPIS is a wellbeing tool, not a substitute for emergency care. Use campus helplines in crisis. By using HIPIS you agree to responsible, respectful use.
            </p>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Comprehensive Support, All in One Place
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From instant AI support to professional counselling, we provide all the tools you
              need for better mental health
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-soft flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <Card className="p-8 sm:p-12 bg-gradient-soft border-primary/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Built for Your Safety & Privacy
              </h2>
              <ul className="space-y-4">
                {[
                  "End-to-end encrypted communications",
                  "Complete anonymity options for all features",
                  "HIPAA-compliant data storage",
                  "No data sharing without consent",
                  "Regular security audits",
                  "Multilingual support (English, Hindi & Regional)",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-calm rounded-2xl p-8 sm:p-12 text-white">
              <h3 className="text-2xl font-bold mb-4">Why Students Choose Us</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-lg font-semibold">85%+ Students</p>
                  <p className="opacity-90">Report improved mental health outcomes</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">24/7 Availability</p>
                  <p className="opacity-90">Always someone to listen and help</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">Culturally Relevant</p>
                  <p className="opacity-90">Designed for Indian student life</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="rounded-2xl bg-gradient-calm p-8 sm:p-12 text-center text-white space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Take the First Step Today
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of students already taking control of their mental health
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-opacity-90 font-semibold"
            >
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded bg-gradient-calm">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-foreground">HIPIS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Mental health support for Indian college students
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/chatbot" className="hover:text-primary">
                    Chatbot
                  </Link>
                </li>
                <li>
                  <Link to="/appointments" className="hover:text-primary">
                    Appointments
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="hover:text-primary">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#help-center" className="hover:text-primary">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="mailto:support@hipis.app" className="hover:text-primary">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-primary">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#privacy" className="hover:text-primary">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-primary">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 HIPIS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
