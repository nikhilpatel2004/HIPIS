import "dotenv/config";
import { connectDB } from "./config/database";
import { Resource } from "./models/Resource";
import { User } from "./models/User";
import { Appointment } from "./models/Appointment";
import { Assessment } from "./models/Assessment";
import { ForumPost } from "./models/ForumPost";

const ResourceModel = Resource as any;
const UserModel = User as any;
const AppointmentModel = Appointment as any;
const AssessmentModel = Assessment as any;
const ForumPostModel = ForumPost as any;

const sampleResources = [
  {
    title: "5-Minute Breathing Exercise for Anxiety",
    description: "Learn the 4-7-8 breathing technique to calm your nervous system instantly.",
    category: "anxiety",
    type: "video",
    language: "en",
    icon: "📹",
    duration: "5:32",
    likes: 234,
    content: "This guided breathing exercise uses the 4-7-8 technique, a proven method to reduce anxiety and calm your nervous system. Breathe in for 4 counts, hold for 7, and exhale slowly for 8 counts. This technique activates your parasympathetic nervous system, helping you feel more relaxed and centered. Practice this daily for best results.\n\nHow to Practice:\n1. Exhale completely through your mouth\n2. Close your mouth and inhale through your nose for 4 counts\n3. Hold your breath for 7 counts\n4. Exhale completely through your mouth for 8 counts\n5. Repeat this cycle 3-4 times\n\nBenefits: Reduces anxiety, lowers blood pressure, improves focus, helps with sleep, calms racing thoughts.",
    videoUrl: "https://www.youtube.com/embed/tybOi4hjZFQ",
    author: "Dr. Sarah Johnson",
    publishedDate: "Dec 1, 2025",
  },
  {
    title: "Understanding Stress: A Comprehensive Guide",
    description: "Deep dive into what stress is, its effects on your body, and proven management strategies.",
    category: "stress",
    type: "article",
    language: "en",
    icon: "📄",
    likes: 156,
    content: "Stress is your body's natural response to challenges. While some stress can be motivating, chronic stress can harm your physical and mental health.\n\nWhat is Stress?\nStress triggers your 'fight or flight' response, releasing hormones like cortisol and adrenaline. Short-term stress can boost performance, but prolonged stress damages your immune system, heart, and mental health.\n\nCommon Stress Triggers:\n• Academic pressure and deadlines\n• Social conflicts and relationships\n• Financial worries\n• Major life changes\n• Perfectionism and self-criticism\n\nProven Management Strategies:\n1. Deep Breathing: Practice 4-7-8 breathing technique\n2. Physical Exercise: 30 minutes daily reduces cortisol\n3. Mindfulness Meditation: 10 minutes can reset your nervous system\n4. Time Management: Break tasks into smaller steps\n5. Social Support: Talk to friends, family, or counselors\n6. Healthy Sleep: 7-9 hours nightly\n7. Nutrition: Balanced meals stabilize mood\n8. Limit Caffeine: Reduces anxiety\n\nWhen to Seek Help:\nIf stress interferes with daily life, causes physical symptoms, or leads to substance use - reach out to a mental health professional. Remember: Asking for help is strength, not weakness.",
    author: "Prof. Michael Chen",
    publishedDate: "Nov 28, 2025",
  },
  {
    title: "Guided Meditation for Sleep",
    description: "30-minute relaxing meditation to help you fall asleep naturally and peacefully.",
    category: "sleep",
    type: "audio",
    language: "en",
    icon: "🎵",
    duration: "30:00",
    likes: 312,
    content: "This 30-minute guided meditation will help you relax deeply and prepare for restful sleep. Close your eyes, focus on your breath, and let go of the day's worries. The gentle guidance will help calm your racing thoughts and ease you into peaceful slumber.\n\nWhat You'll Experience:\n• Progressive body relaxation\n• Gentle breathing guidance\n• Visualization of peaceful scenes\n• Release of mental tension\n• Deep restorative rest\n\nBest Practices:\n- Use headphones for immersive experience\n- Lie comfortably in bed\n- Dim the lights\n- Set a comfortable room temperature\n- Don't worry if your mind wanders - gently bring focus back\n\nRegular practice improves sleep quality, reduces insomnia, and helps establish healthy sleep patterns.",
    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-relaxing-beach-music-132.mp3",
    author: "Meditation Masters",
    publishedDate: "Nov 25, 2025",
  },
  {
    title: "Depression: Breaking the Stigma",
    description: "Infographic explaining depression myths vs facts and when to seek help.",
    category: "depression",
    type: "infographic",
    language: "en",
    icon: "🎨",
    likes: 189,
    content: "Depression is a real medical condition, not a sign of weakness.\n\nMYTHS vs FACTS:\n\n❌ MYTH: 'Just snap out of it'\n✅ FACT: Depression requires proper treatment like any other illness\n\n❌ MYTH: 'Medication changes your personality'\n✅ FACT: It helps restore chemical balance in your brain\n\n❌ MYTH: 'Only weak people get depressed'\n✅ FACT: Depression can affect anyone regardless of strength\n\n❌ MYTH: 'Talking about it makes it worse'\n✅ FACT: Speaking up is the first step to recovery\n\nWarning Signs:\n• Persistent sadness or empty feeling\n• Loss of interest in activities you once enjoyed\n• Changes in appetite or weight\n• Sleep problems (too much or too little)\n• Fatigue and lack of energy\n• Feelings of worthlessness or guilt\n• Difficulty concentrating\n• Thoughts of death or suicide\n\nWhen to Seek Help:\nIf you experience 5+ symptoms for 2+ weeks, please reach out to a mental health professional. Depression is treatable, and recovery is possible!\n\nEmergency: If you have thoughts of self-harm, call a crisis helpline immediately.",
    imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=600&fit=crop",
    author: "Mental Health Foundation",
    publishedDate: "Nov 22, 2025",
  }
];

const sampleUsers = [
  { name: "Riya Student", email: "riya@student.edu", password: "Password@123", role: "student" },
  { name: "Arjun Counselor", email: "arjun@counselor.edu", password: "Password@123", role: "counsellor" },
  { name: "Admin One", email: "admin@campus.edu", password: "Password@123", role: "admin" },
];

async function seedDatabase() {
  try {
    await connectDB();
    
    console.log("🌱 Seeding database...");
    // Clear existing data
    await Promise.all([
      ResourceModel.deleteMany({}),
      UserModel.deleteMany({}),
      AppointmentModel.deleteMany({}),
      AssessmentModel.deleteMany({}),
      ForumPostModel.deleteMany({}),
    ]);
    console.log("🗑️ Cleared resources, users, appointments, assessments, forum posts");

    // Users (create triggers password hashing hook)
    const createdUsers = await UserModel.create(sampleUsers);
    const student = createdUsers.find((u: any) => u.role === "student");
    const counselor = createdUsers.find((u: any) => u.role === "counsellor");
    console.log("✅ Added sample users");

    // Resources
    await ResourceModel.insertMany(sampleResources as any);
    console.log(`✅ Added ${sampleResources.length} resources`);

    // Appointments
    if (student?._id && counselor?._id) {
      await AppointmentModel.create([
        {
          userId: student._id,
          counsellor: counselor._id,
          type: "video-call",
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          time: "14:00",
          status: "upcoming",
        },
        {
          userId: student._id,
          counsellor: counselor._id,
          type: "in-person",
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          time: "16:30",
          status: "upcoming",
        },
      ]);
      console.log("✅ Added sample appointments");
    }

    // Assessments
    if (student?._id) {
      await AssessmentModel.create([
        {
          userId: student._id,
          type: "PHQ-9",
          score: 12,
          severity: "moderate",
          interpretation: "Shows moderate depressive symptoms",
          recommendations: ["Consider scheduling a counseling session", "Practice daily mindfulness for 10 minutes"],
          answers: [2,1,1,1,2,1,1,1,2],
        },
      ]);
      console.log("✅ Added sample assessments");
    }

    // Forum posts
    if (student?._id) {
      await ForumPostModel.create([
        {
          title: "Exam stress tips",
          content: "How do you manage stress during finals?",
          category: "academic",
          tags: ["exams", "stress"],
          anonymous: false,
          authorId: student._id,
          authorName: student.name,
          likes: 3,
          views: 12,
        },
        {
          title: "Sleep issues affecting my grades",
          content: "I can't sleep properly at night and it's affecting my studies. Any suggestions?",
          category: "sleep",
          tags: ["sleep", "insomnia"],
          anonymous: true,
          authorId: student._id,
          authorName: "Anonymous",
          likes: 5,
          views: 28,
        },
      ]);
      console.log("✅ Added sample forum posts");
    }

    // Add more students with wellness data for admin dashboard
    const student2 = await UserModel.create({
      name: "Priya Sharma",
      email: "priya@student.edu",
      password: "Password@123",
      role: "student",
    });
    const student3 = await UserModel.create({
      name: "Ankit Kumar",
      email: "ankit@student.edu",
      password: "Password@123",
      role: "student",
    });
    console.log("✅ Added more sample students");

    // Add high-risk flags via assessments
    if (student3?._id) {
      await AssessmentModel.create({
        userId: student3._id,
        type: "GAD-7",
        score: 18,
        severity: "severe",
        interpretation: "Shows severe anxiety symptoms - requires immediate support",
        recommendations: ["Contact counselor immediately", "Consider medical evaluation"],
        answers: [3,3,3,2,3,2,2],
      });
      console.log("✅ Added high-risk assessment");
    }

    // Add mood entries for wellness metrics
    const MoodEntry = require("./models/MoodEntry").MoodEntry;
    const MoodEntryModel = MoodEntry as any;
    
    if (student?._id && student2?._id && student3?._id) {
      await MoodEntryModel.create([
        { userId: student._id, date: new Date(), mood: "🙂", stress: 5, sleep: 8, energy: 7, notes: "Feeling better today" },
        { userId: student._id, date: new Date(Date.now() - 24*60*60*1000), mood: "😐", stress: 6, sleep: 6, energy: 5, notes: "Regular day" },
        { userId: student2._id, date: new Date(), mood: "😟", stress: 8, sleep: 5, energy: 3, notes: "Anxious about exams" },
        { userId: student2._id, date: new Date(Date.now() - 24*60*60*1000), mood: "😢", stress: 9, sleep: 4, energy: 2, notes: "Very stressed" },
        { userId: student3._id, date: new Date(), mood: "😢", stress: 10, sleep: 3, energy: 1, notes: "Critical - needs help" },
      ]);
      console.log("✅ Added sample mood entries");
    }
    
    console.log("🎉 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
