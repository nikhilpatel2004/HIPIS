# 🎯 Quick Start Guide - Admin & Dashboards

## 🌐 Access the Application

**URL**: [http://localhost:8082](http://localhost:8082)

---

## 👥 Three User Roles

### 1️⃣ Student Dashboard
**For**: Regular students/users

```
Login → Student Role → /dashboard
├─ Quick Actions
│  ├─ Chat with AI Chatbot
│  ├─ Book Appointment
│  ├─ Track Wellness
│  ├─ Browse Resources
│  ├─ Join Peer Forum
│  └─ View Assessments
├─ Recent Activity
├─ Upcoming Appointments
└─ Daily Wellness Tips
```

**Features**: Chatbot, Appointments, Wellness tracking, Resources, Forum, Assessments

---

### 2️⃣ Counselor Dashboard  
**For**: Counseling professionals

```
Login → Counselor Role → /counsellor-dashboard
├─ Dashboard Statistics
│  ├─ Active Clients
│  ├─ Today's Sessions
│  └─ Completion Rate
├─ Client Management
│  ├─ View all assigned students
│  ├─ View client details
│  └─ Add new clients
├─ Appointment Management
│  ├─ Today's appointments
│  └─ Upcoming sessions (7 days)
└─ Session Notes
   ├─ Create notes with mood
   ├─ Add follow-ups
   └─ Track key points
```

**Features**: Client tracking, Appointment scheduling, Session notes, Statistics

---

### 3️⃣ Admin Dashboard
**For**: Institution administrators

```
Login → Admin Role → /admin-dashboard
├─ System Alerts
├─ Key Statistics
│  ├─ Total Students
│  ├─ Total Counselors
│  ├─ Today's Appointments
│  └─ Completion Rate
├─ Wellness Monitoring
│  ├─ Anxiety Index
│  ├─ Depression Index
│  ├─ Stress Level
│  └─ Wellbeing Score
├─ High-Risk Alerts
│  └─ Critical & warning flags
├─ Resource Analytics
│  └─ Top resources by engagement
└─ Forum Analytics
   └─ Activity by category
```

**Features**: Statistics, Wellness metrics, High-risk alerts, Resource tracking, Forum monitoring

---

## 🔓 Test Logins

Create accounts with these details:

| Role | Email | Features |
|------|-------|----------|
| **Student** | student@test.edu | Chatbot, Appointments, Wellness, Resources |
| **Counselor** | counselor@test.edu | Clients, Session notes, Appointments |
| **Admin** | admin@test.edu | Statistics, Wellness, Alerts, Analytics |

---

## ⚙️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                  │
│  ┌──────────────┬──────────────┬──────────────┐    │
│  │   Student    │  Counselor   │    Admin     │    │
│  │  Dashboard   │  Dashboard   │  Dashboard   │    │
│  └──────────────┴──────────────┴──────────────┘    │
└──────────────────────┬──────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │                           │
    ┌────▼────┐              ┌──────▼──────┐
    │ Express │              │   MongoDB   │
    │  API    │◄────────────►│   Atlas     │
    └─────────┘              └─────────────┘
         │
    ┌────▼────────────────────┐
    │  10 Admin Endpoints     │
    │  8 Counselor Endpoints  │
    │  6 Core Auth Routes     │
    │  + Other Features       │
    └─────────────────────────┘
```

---

## 🔐 Authentication Flow

```
1. User visits http://localhost:8082
   │
2. Clicks Login
   │
3. Enters email & password
   │
4. Server validates → Issues JWT Token
   │
5. Token stored in localStorage
   │
6. Profile check → Determines role
   │
7. Router redirects based on role:
   ├─ student → /dashboard
   ├─ counsellor → /dashboard (+ /counsellor-dashboard available)
   └─ admin → /dashboard (+ /admin-dashboard available)
```

---

## 📊 Data Flow Example

### Admin Dashboard Loading

```
Admin visits /admin-dashboard
         │
         ▼
Fetch /api/admin/stats
├─ Total students: 150
├─ Total counselors: 12
├─ Today's appointments: 8
└─ Completion rate: 94%
         │
Fetch /api/admin/wellness
├─ Anxiety: 5.2/10
├─ Depression: 4.1/10
├─ Stress: 6.4/10
└─ Wellbeing: 7.1/10
         │
Fetch /api/admin/flags
├─ High-risk student alerts
└─ Severity classification
         │
Display on Dashboard with Charts
```

---

## 🎨 Visual Layout

### Admin Dashboard Sections
```
┌────────────────────────────────────────────────────┐
│  HEADER: Admin Analytics  [Export]                 │
├────────────────────────────────────────────────────┤
│                                                    │
│  Date Range: [This Week] [This Month] [Semester]  │
│                                                    │
│  ┌─────────┬──────────┬──────────┬───────────┐   │
│  │Students │Counselors│Appt Today│Completion│   │
│  │  150    │   12     │    8     │   94%     │   │
│  └─────────┴──────────┴──────────┴───────────┘   │
│                                                    │
│  ┌──────────────────┐  ┌──────────────────┐      │
│  │ High-Risk Alerts │  │ Wellness Metrics │      │
│  │ • Alert 1        │  │ Anxiety:  ████░  │      │
│  │ • Alert 2        │  │ Depress:  ███░░  │      │
│  │ • Alert 3        │  │ Stress:   █████░ │      │
│  └──────────────────┘  └──────────────────┘      │
│                                                    │
│  ┌────────────────────────────────────────────┐  │
│  │ Top Resources                               │  │
│  │ • Breathing Exercise  [1234 views]         │  │
│  │ • Sleep Tips          [987 views]          │  │
│  │ • Depression Guide    [654 views]          │  │
│  └────────────────────────────────────────────┘  │
│                                                    │
│  ┌────────────────────────────────────────────┐  │
│  │ Forum Activity                              │  │
│  │ Stress & Anxiety: 234 posts, 1205 comments│  │
│  │ Academic Pressure: 189 posts, 876 comments│  │
│  └────────────────────────────────────────────┘  │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 🚀 Live Endpoints

### Currently Working Endpoints

**Auth**
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login  
- `GET /api/auth/profile` - Get profile (Protected)

**Admin** (Protected + Admin role required)
- `GET /api/admin/stats` ✅ Working
- `GET /api/admin/wellness` ✅ Working
- `GET /api/admin/appointments` ✅ Working
- `GET /api/admin/resources` ✅ Working
- `GET /api/admin/forum` ✅ Working
- `GET /api/admin/flags` ✅ Working
- `GET /api/admin/alerts` ✅ Working

**Counselor** (Protected)
- `GET /api/counselor/clients` ✅ Working
- `GET /api/counselor/appointments/today` ✅ Working
- `GET /api/counselor/appointments/upcoming` ✅ Working
- `POST /api/counselor/notes` ✅ Working
- `GET /api/counselor/stats` ✅ Working

---

## 🧪 Quick Test

### Test Admin Dashboard
1. Go to http://localhost:8082
2. Login with admin credentials
3. Click "Admin Analytics" in sidebar
4. See real stats, alerts, metrics

### Test Counselor Dashboard
1. Login with counselor credentials  
2. Click "Counselor Dashboard" in sidebar
3. View assigned clients
4. Create a session note

### Test Student Dashboard
1. Login with student credentials
2. Book an appointment
3. Log your mood
4. View resources

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Page blank after login | Check localStorage for token, refresh page |
| Admin endpoints 403 error | Verify user role is "admin" in database |
| No data showing | Check MongoDB connection (see terminal) |
| Port already in use | App auto-switches to 8082, 8083, etc. |
| Logout not working | Clear browser cache and localStorage |

---

## 📚 Documentation Files

- **DASHBOARDS_SETUP.md** - Complete technical setup guide
- **ADMIN_SETUP_COMPLETE.md** - Full feature summary
- **AGENTS.md** - Project structure (original)

---

## ✨ Key Highlights

✅ **3 Complete Dashboards**
- Student, Counselor, Admin
- All role-based with automatic routing
- Real MongoDB data integration

✅ **10 Admin API Endpoints**
- Statistics, users, wellness, appointments, resources, forum, flags, alerts, user status, assign counselor

✅ **Security**
- JWT authentication
- Role-based access control
- Admin middleware verification

✅ **Real Data**
- All dashboards pull from MongoDB
- No mock data
- Live statistics and metrics

✅ **User-Friendly**
- Responsive design
- Quick actions
- System alerts and notifications

---

## 🎯 Next Steps

1. **Test Login** with different roles
2. **Explore Dashboards** - navigate each section
3. **Create Test Data** - add appointments, notes
4. **Monitor Alerts** - check high-risk system
5. **Use All Features** - test each dashboard fully

---

**Status**: 🟢 Production Ready  
**Server**: Running on http://localhost:8082  
**Database**: MongoDB Atlas ✅ Connected  
**Last Updated**: December 13, 2025

---

💡 **Need Help?** Check DASHBOARDS_SETUP.md for detailed documentation!
