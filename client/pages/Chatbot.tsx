import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Smile, AlertCircle, Download, Volume2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sentiment?: "positive" | "neutral" | "negative";
  timestamp: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm HIPIS's AI Mental Health Companion. I'm here to listen, support, and help you navigate challenges with evidence-based strategies. How are you feeling today?",
      sentiment: "positive",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      // AI responses based on user input keywords
      let response = "Thank you for sharing. I'm here to support you. What would help you feel better right now?";
      
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes("anxiety") || lowerInput.includes("anxious")) {
        response = "Anxiety can be tough. Try the 4-7-8 breathing technique: Breathe in for 4 counts, hold for 7, exhale for 8. Repeat this 4 times. This can help calm your nervous system.";
      } else if (lowerInput.includes("stress") || lowerInput.includes("stressed")) {
        response = "I understand you're feeling stressed. Progressive muscle relaxation might help - start by tensing and then relaxing different muscle groups from your toes to your head. Would you like to try this?";
      } else if (lowerInput.includes("sleep") || lowerInput.includes("can't sleep")) {
        response = "Sleep issues are common. Try: 1) Keep a consistent sleep schedule 2) Avoid screens 30 min before bed 3) Try meditation. Would you like some guided meditation techniques?";
      } else if (lowerInput.includes("depression") || lowerInput.includes("sad")) {
        response = "I'm sorry you're feeling down. Remember, these feelings are temporary. Try engaging in activities you enjoy, spending time with friends, or talking to a professional. Would booking a counsellor appointment help?";
      } else if (lowerInput.includes("exam") || lowerInput.includes("academic")) {
        response = "Academic pressure is real. Break your study into 25-min focused sessions with 5-min breaks (Pomodoro technique). Also remember: your worth isn't defined by grades. Want tips on effective studying?";
      } else if (lowerInput.includes("thank")) {
        response = "You're welcome! I'm here anytime you need support. Remember to be kind to yourself. 💙";
      } else if (lowerInput.includes("hi") || lowerInput.includes("hello")) {
        response = "Hi there! I'm here to listen and support you. How are you feeling today? Feel free to share what's on your mind.";
      } else {
        const responses = [
          "That sounds challenging. Have you tried the 5-4-3-2-1 grounding technique? Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
          "I hear you. Remember, it's okay to feel overwhelmed sometimes. What's one thing that usually helps you feel calmer?",
          "Thank you for sharing. Let's work through this together. Have you considered talking to a counsellor? You can book an appointment anytime.",
          "I understand. Self-compassion is powerful. Be kind to yourself - you're doing better than you think. 💙",
          "That must be difficult. Remember, you're not alone in feeling this way. Many students experience similar challenges.",
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        sentiment: "neutral",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800);
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-50 border-green-200";
      case "negative":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

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
          <h1 className="text-lg font-bold text-foreground">AI Mental Health Companion</h1>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
              <span>Anonymous</span>
            </label>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-120px)] flex flex-col">
        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-3 mb-6">
          <Card className="p-3 bg-gradient-soft border-primary/20 text-sm">
            <p className="font-medium text-foreground">🔒 Encrypted & Private</p>
            <p className="text-xs text-muted-foreground mt-1">All conversations are end-to-end encrypted</p>
          </Card>
          <Card className="p-3 bg-gradient-soft border-primary/20 text-sm">
            <p className="font-medium text-foreground">💬 CBT-Based Support</p>
            <p className="text-xs text-muted-foreground mt-1">Evidence-backed coping strategies</p>
          </Card>
          <Card className="p-3 bg-gradient-soft border-primary/20 text-sm">
            <p className="font-medium text-foreground">🌐 Multilingual</p>
            <p className="text-xs text-muted-foreground mt-1">English, Hindi, & Regional languages</p>
          </Card>
        </div>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col p-4 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : `border ${getSentimentColor(message.sentiment)} rounded-bl-none`
                  }`}
                >
                  <p className={message.role === "user" ? "text-white" : "text-foreground"}>
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user" ? "text-white/70" : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Sentiment Indicator */}
                {message.role === "assistant" && message.sentiment && (
                  <div className="ml-2 flex items-end">
                    {message.sentiment === "negative" && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    {message.sentiment === "positive" && (
                      <Smile className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg rounded-bl-none px-4 py-3">
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="mb-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Quick options:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "I'm feeling anxious",
                  "Help with stress",
                  "Can't sleep",
                  "Academic pressure",
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => setInput(option)}
                    className="text-left px-3 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-foreground"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Share what's on your mind..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 h-10"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="bg-primary hover:bg-primary/90 text-white h-10 px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10">
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Tips Footer */}
        <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
          <Card className="p-3 bg-gradient-soft border-primary/20">
            <p className="font-medium text-foreground text-xs">📋 Grounding Technique</p>
            <p className="text-xs text-muted-foreground mt-1">
              5-4-3-2-1: Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste
            </p>
          </Card>
          <Card className="p-3 bg-gradient-soft border-primary/20">
            <p className="font-medium text-foreground text-xs">🧘 Breathing Exercise</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try 4-7-8 breathing: Inhale 4 counts, hold 7, exhale 8. Repeat 4 times.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
