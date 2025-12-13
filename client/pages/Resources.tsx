import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Search, Play, BookOpen, Headphones, Image as ImageIcon, Heart, MessageCircle, Bookmark, Download, Share2, X, Send, Clock, ExternalLink } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "video" | "article" | "audio" | "infographic";
  language: "en" | "hi";
  icon: string;
  duration?: string;
  likes: number;
  content?: string;
  contentUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  imageUrl?: string;
  author: string;
  publishedDate: string;
}

interface Comment {
  id: string;
  resourceId: string;
  author: string;
  text: string;
  timestamp: string;
}

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [likedResources, setLikedResources] = useState<Set<string>>(new Set());
  const [bookmarkedResources, setBookmarkedResources] = useState<Set<string>>(new Set());
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userName] = useState(localStorage.getItem("userName") || "Guest");

  const categories = [
    { id: "all", label: "All Topics", icon: "📚" },
    { id: "stress", label: "Stress Management", icon: "🧘" },
    { id: "anxiety", label: "Anxiety Relief", icon: "🌿" },
    { id: "depression", label: "Depression Support", icon: "💙" },
    { id: "sleep", label: "Sleep Hygiene", icon: "😴" },
    { id: "academic", label: "Academic Pressure", icon: "📖" },
    { id: "confidence", label: "Self-Confidence", icon: "⭐" },
  ];

  const resources: Resource[] = [
  {
    id: "1",
    title: "5-Minute Breathing Exercise for Anxiety",
    description: "4-7-8 breathing technique to calm anxiety.",
    category: "anxiety",
    type: "video",
    language: "en",
    icon: "📹",
    duration: "5:20",
    likes: 234,
    videoUrl: "https://www.youtube.com/embed/tybOi4hjZFQ", // REAL (Dr. Weil breathing)
    content: "Follow the 4-7-8 pattern: inhale 4 seconds, hold 7, exhale 8 to quickly lower anxiety.",
    author: "Dr. Andrew Weil",
    publishedDate: "Dec 1, 2025",
  },

  {
    id: "2",
    title: "Understanding Stress: A Comprehensive Guide",
    description: "What stress is and how to manage it.",
    category: "stress",
    type: "article",
    language: "en",
    icon: "📄",
    likes: 156,
    contentUrl: "https://www.apa.org/topics/stress", // REAL ARTICLE (APA)
    content: "In-depth APA explainer on stress triggers, body responses, and practical coping techniques.",
    author: "American Psychological Association",
    publishedDate: "Nov 28, 2025",
  },

  {
    id: "3",
    title: "Guided Meditation for Sleep (30 Minutes)",
    description: "Relaxing guided meditation for deep sleep.",
    category: "sleep",
    type: "audio",
    language: "en",
    icon: "🎵",
    duration: "30:00",
    likes: 312,
    audioUrl: "https://www.youtube.com/embed/aEqlQvczMJQ", // REAL sleep meditation
    content: "Guided meditation: settle in a quiet space, focus on breath, and follow the narrator to unwind for sleep.",
    author: "The Honest Guys",
    publishedDate: "Nov 25, 2025",
  },

  {
    id: "4",
    title: "Depression: Breaking the Stigma",
    description: "Myths vs Facts about depression.",
    category: "depression",
    type: "article",
    language: "en",
    icon: "📄",
    likes: 189,
    contentUrl: "https://www.who.int/news-room/fact-sheets/detail/depression", // REAL (WHO)
    content: "WHO fact sheet debunking depression myths, outlining symptoms, and summarizing treatment options.",
    author: "World Health Organization",
    publishedDate: "Nov 22, 2025",
  },

  {
    id: "5",
    title: "Academic Stress & Exam Anxiety (Hindi)",
    description: "परीक्षा की चिंता को कैसे संभालें",
    category: "academic",
    type: "video",
    language: "hi",
    icon: "📹",
    duration: "13:10",
    likes: 278,
    videoUrl: "https://www.youtube.com/embed/inpok4MKVLM", // REAL Hindi meditation
    content: "Hindi talk on handling exam anxiety with mindset shifts, breathing drills, and consistent study routines.",
    author: "Sandeep Maheshwari",
    publishedDate: "Nov 20, 2025",
  },

  {
    id: "6",
    title: "Building Self-Confidence",
    description: "Psychology-based confidence guide.",
    category: "confidence",
    type: "article",
    language: "en",
    icon: "📄",
    likes: 267,
    contentUrl: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/self-esteem/", // REAL
    content: "CBT-informed strategies from Mind UK to challenge negative self-talk and build everyday confidence.",
    author: "Mind UK",
    publishedDate: "Nov 18, 2025",
  },

  {
    id: "7",
    title: "Progressive Muscle Relaxation",
    description: "PMR technique to reduce stress.",
    category: "stress",
    type: "audio",
    language: "en",
    icon: "🎵",
    duration: "15:00",
    likes: 198,
    audioUrl: "https://www.youtube.com/embed/86HUcX8ZtAk", // REAL PMR
    content: "Step-by-step progressive muscle relaxation: tense then release each muscle group from feet to face.",
    author: "Johns Hopkins Medicine",
    publishedDate: "Nov 15, 2025",
  },

  {
    id: "8",
    title: "Sleep Hygiene Tips for Students",
    description: "Improve sleep quality with science-based tips.",
    category: "sleep",
    type: "article",
    language: "en",
    icon: "📄",
    likes: 421,
    contentUrl: "https://www.sleepfoundation.org/sleep-hygiene", // REAL
    content: "Science-backed sleep hygiene checklist covering light, caffeine timing, and consistent wind-down routines.",
    author: "Sleep Foundation",
    publishedDate: "Nov 12, 2025",
  },
];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesType = selectedType === "all" || resource.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const toggleLike = (resourceId: string) => {
    const newLiked = new Set(likedResources);
    if (newLiked.has(resourceId)) {
      newLiked.delete(resourceId);
    } else {
      newLiked.add(resourceId);
    }
    setLikedResources(newLiked);
  };

  const toggleBookmark = (resourceId: string) => {
    const newBookmarked = new Set(bookmarkedResources);
    if (newBookmarked.has(resourceId)) {
      newBookmarked.delete(resourceId);
    } else {
      newBookmarked.add(resourceId);
    }
    setBookmarkedResources(newBookmarked);
  };

  const openResource = (resource: Resource) => {
    setSelectedResource(resource);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setSelectedResource(null);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedResource) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      resourceId: selectedResource.id,
      author: userName,
      text: newComment,
      timestamp: new Date().toLocaleString(),
    };
    
    setComments([...comments, comment]);
    setNewComment("");
  };

  const downloadResource = (resource: Resource) => {
    alert(`Downloading: ${resource.title}\n\nIn a real app, this would download the resource file.`);
  };

  const shareResource = (resource: Resource) => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href,
      });
    } else {
      alert(`Share: ${resource.title}\n\nCopy this link to share with friends!`);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />;
      case "article":
        return <BookOpen className="h-4 w-4" />;
      case "audio":
        return <Headphones className="h-4 w-4" />;
      case "infographic":
        return <ImageIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-8 h-16">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <h1 className="text-lg font-bold text-foreground">Resource Library</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search resources, topics, or guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Topics</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === cat.id
                      ? "bg-primary text-white"
                      : "bg-muted text-foreground border border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <p className="text-xs mt-1">{cat.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-3">Format</p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All", icon: "📚" },
                { id: "video", label: "Videos", icon: "📹" },
                { id: "article", label: "Articles", icon: "📄" },
                { id: "audio", label: "Audio", icon: "🎵" },
                { id: "infographic", label: "Infographics", icon: "🎨" },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedType === type.id
                      ? "bg-primary text-white"
                      : "bg-muted text-foreground border border-border hover:border-primary/50"
                  }`}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Found {filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""}
          </p>

          {filteredResources.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => (
                <Card
                  key={resource.id}
                  className="overflow-hidden hover:shadow-lg transition-all group animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Resource Header */}
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative overflow-hidden">
                    <span className="text-6xl opacity-30">{resource.icon}</span>
                    {resource.type === "video" && (
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-foreground">
                        {resource.duration}
                      </div>
                    )}
                    {resource.type === "audio" && (
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-foreground">
                        {resource.duration}
                      </div>
                    )}
                    {resource.language === "hi" && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                        हिन्दी
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                    </div>

                    {/* Type Badge */}
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                        {getTypeIcon(resource.type)}
                        <span className="capitalize">{resource.type}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleLike(resource.id)}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              likedResources.has(resource.id) ? "fill-current text-primary" : ""
                            }`}
                          />
                          <span>{resource.likes + (likedResources.has(resource.id) ? 1 : 0)}</span>
                        </button>
                        <button
                          onClick={() => toggleBookmark(resource.id)}
                          className="text-muted-foreground hover:text-primary transition-colors"
                          title="Bookmark"
                        >
                          <Bookmark
                            className={`h-4 w-4 ${
                              bookmarkedResources.has(resource.id) ? "fill-current text-primary" : ""
                            }`}
                          />
                        </button>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => openResource(resource)}>
                        {resource.type === "video" || resource.type === "audio" ? "Play" : "Read"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No resources found matching your filters.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedType("all");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </Card>
          )}
        </div>

        {/* Featured Section */}
        <Card className="p-8 bg-gradient-calm text-white space-y-4">
          <h2 className="text-2xl font-bold">📚 Popular Collections</h2>
          <p className="opacity-90">Curated resource bundles for common challenges faced by students</p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              { title: "Exam Anxiety Toolkit", resources: 12 },
              { title: "Better Sleep Guide", resources: 8 },
              { title: "Depression Recovery", resources: 15 },
            ].map((collection, i) => (
              <Button key={i} variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                {collection.title}
                <span className="ml-2 text-xs opacity-75">({collection.resources})</span>
              </Button>
            ))}
          </div>
        </Card>
      </main>

      {/* Resource Viewer Modal */}
      {viewerOpen && selectedResource && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{selectedResource.title}</h2>
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    {getTypeIcon(selectedResource.type)}
                    <span className="capitalize">{selectedResource.type}</span>
                  </span>
                  {selectedResource.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedResource.duration}
                    </span>
                  )}
                  <span>By {selectedResource.author}</span>
                  <span>{selectedResource.publishedDate}</span>
                </div>
              </div>
              <button
                onClick={closeViewer}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close resource viewer"
                title="Close resource viewer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Media Player */}
              {selectedResource.type === "video" && selectedResource.videoUrl && (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={selectedResource.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    title={selectedResource.title}
                  />
                </div>
              )}

              {selectedResource.type === "audio" && selectedResource.audioUrl && (
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6">
                  <audio controls className="w-full">
                    <source src={selectedResource.audioUrl} type="audio/mpeg" />
                    Your browser does not support audio playback.
                  </audio>
                </div>
              )}

              {selectedResource.type === "infographic" && selectedResource.imageUrl && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={selectedResource.imageUrl}
                    alt={selectedResource.title}
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedResource.description}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Content</h3>
                  {selectedResource.content && (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {selectedResource.content}
                    </p>
                  )}
                  {selectedResource.contentUrl && (
                    <a
                      href={selectedResource.contentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                      aria-label="Open full resource in a new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open full resource
                    </a>
                  )}
                  {!selectedResource.content && !selectedResource.contentUrl && (
                    <p className="text-muted-foreground text-sm">No additional content available.</p>
                  )}
                </div>
              </div>

              {/* Actions Bar */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleLike(selectedResource.id)}
                  className={likedResources.has(selectedResource.id) ? "text-primary" : ""}
                >
                  <Heart className={likedResources.has(selectedResource.id) ? "fill-current" : ""} />
                  {selectedResource.likes + (likedResources.has(selectedResource.id) ? 1 : 0)}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleBookmark(selectedResource.id)}
                  className={bookmarkedResources.has(selectedResource.id) ? "text-primary" : ""}
                >
                  <Bookmark className={bookmarkedResources.has(selectedResource.id) ? "fill-current" : ""} />
                  Bookmark
                </Button>
                <Button variant="outline" size="sm" onClick={() => shareResource(selectedResource)}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadResource(selectedResource)}>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>

              {/* Comments Section */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Comments ({comments.filter((c) => c.resourceId === selectedResource.id).length})
                </h3>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Share your thoughts or ask questions..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 min-h-[80px]"
                  />
                  <Button onClick={handleAddComment} size="sm" disabled={!newComment.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Display Comments */}
                <div className="space-y-3">
                  {comments
                    .filter((comment) => comment.resourceId === selectedResource.id)
                    .map((comment) => (
                      <Card key={comment.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm text-foreground">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{comment.text}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  {comments.filter((c) => c.resourceId === selectedResource.id).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first to share your thoughts!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
