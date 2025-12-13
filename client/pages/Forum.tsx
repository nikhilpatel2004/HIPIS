import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, MessageCircle, ThumbsUp, Eye, Filter, Search } from "lucide-react";

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  category: string;
  replies: number | { content: string }[];
  views?: number;
  likes?: number;
  anonymous: boolean;
  tags: string[];
  authorName?: string;
  createdAt?: string;
}

export default function Forum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);

  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("stress");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const categories = [
    { id: "all", label: "All Topics", emoji: "💬" },
    { id: "stress", label: "Stress & Anxiety", emoji: "😟" },
    { id: "anxiety", label: "Anxiety", emoji: "🌿" },
    { id: "depression", label: "Depression", emoji: "💙" },
    { id: "academic", label: "Academic", emoji: "📚" },
    { id: "sleep", label: "Sleep", emoji: "😴" },
    { id: "motivation", label: "Motivation", emoji: "⭐" },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/forum");
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Failed to load forum posts");
          setLoading(false);
          return;
        }
        setPosts(data.data || []);
        setLoading(false);
      } catch (err) {
        setError("Network error while loading forum");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(search) ||
      post.content.toLowerCase().includes(search) ||
      (post.tags || []).some((tag) => tag.toLowerCase().includes(search));
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const likesA = a.likes ?? 0;
    const likesB = b.likes ?? 0;
    const repliesA = Array.isArray(a.replies) ? a.replies.length : a.replies;
    const repliesB = Array.isArray(b.replies) ? b.replies.length : b.replies;

    if (sortBy === "popular") return likesB - likesA;
    if (sortBy === "active") return (repliesB ?? 0) - (repliesA ?? 0);
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const addPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      setError("Title and description are required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please sign in to post");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const response = await fetch("/api/forum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
          category: newPostCategory,
          anonymous: isAnonymous,
          tags: [],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to publish post");
        setSubmitting(false);
        return;
      }

      setPosts([data.data, ...posts]);
      setShowNewPost(false);
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostCategory("stress");
      setSubmitting(false);
    } catch (err) {
      setError("Network error while publishing");
      setSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please sign in to like posts");
      return;
    }

    try {
      const response = await fetch(`/api/forum/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Unable to like post");
        return;
      }
      setPosts((prev) => prev.map((p) => (p._id === id ? data.data : p)));
    } catch (err) {
      setError("Network error while liking post");
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
          <h1 className="text-lg font-bold text-foreground">Peer Support Forum</h1>
          <Button
            onClick={() => setShowNewPost(!showNewPost)}
            className="bg-primary hover:opacity-90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">New Post</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Safety Notice */}
        <Card className="p-4 bg-blue-50 border-blue-200 flex items-start gap-3">
          <span className="text-lg mt-0.5">🔒</span>
          <div>
            <p className="font-medium text-blue-900 text-sm">
              Safe, Moderated Community
            </p>
            <p className="text-xs text-blue-700 mt-1">
              All posts are moderated to ensure a supportive environment. Harassment, self-harm content, and spam are removed. If you're in crisis, please reach out to our helpline.
            </p>
          </div>
        </Card>

        {/* New Post Form */}
        {showNewPost && (
          <Card className="p-6 space-y-4 animate-slide-up">
            <h2 className="text-xl font-bold text-foreground">Start a Discussion</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Title</label>
                <Input
                  type="text"
                  placeholder="What's on your mind?"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="h-10"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Share your thoughts, experiences, or ask for advice..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none h-32"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Category
                  </label>
                  <select
                                                            title="Select a category"
                                        id="category"
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mt-6">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-border"
                    />
                    <span>Post Anonymously</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={addPost}
                  className="flex-1 bg-gradient-calm hover:opacity-90 text-white"
                  disabled={submitting}
                >
                  {submitting ? "Publishing..." : "Publish"}
                </Button>
                <Button
                  onClick={() => setShowNewPost(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="space-y-4">
          {error && (
            <Card className="p-3 border-red-200 bg-red-50 text-sm text-red-700">
              {error}
            </Card>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-white"
                    : "bg-muted text-foreground border border-border hover:border-primary/50"
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              id="sort-select"
              title="Sort forum posts"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="active">Most Active</option>
            </select>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {loading ? (
            <Card className="p-12 text-center text-muted-foreground">Loading posts...</Card>
          ) : sortedPosts.length > 0 ? (
            sortedPosts.map((post, index) => (
              <Card
                key={post._id}
                className="p-6 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {post.anonymous ? "Anonymous" : post.authorName || "Member"} •
                        {" "}
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "Just now"}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary whitespace-nowrap">
                      {categories.find((c) => c.id === post.category)?.emoji}{" "}
                      {categories.find((c) => c.id === post.category)?.label}
                    </span>
                  </div>

                  {/* Content Preview */}
                  <p className="text-muted-foreground line-clamp-2">{post.content}</p>

                  {/* Tags */}
                  {(post.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(post.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-6 pt-3 border-t border-border text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>{Array.isArray(post.replies) ? post.replies.length : post.replies || 0} replies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{post.views ?? 0} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      <button
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => handleLike(post._id)}
                      >
                        {post.likes ?? 0} likes
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No posts found. {searchTerm && "Try adjusting your search."}
              </p>
            </Card>
          )}
        </div>

        {/* Community Guidelines */}
        <Card className="p-6 bg-gradient-soft border-primary/20 space-y-3">
          <h3 className="font-bold text-foreground">📋 Community Guidelines</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>✓ Be respectful and supportive of others</li>
            <li>✓ Share your experiences, not medical advice</li>
            <li>✓ Respect privacy - don't share others' information</li>
            <li>✗ No harassment, hate speech, or discrimination</li>
            <li>✗ No self-harm content or crisis encouragement</li>
            <li>✗ No spam or promotional content</li>
          </ul>
        </Card>
      </main>
    </div>
  );
}
