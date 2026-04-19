# RecoveryIQ - Advanced Recovery Management Platform

A comprehensive web application for managing patient recovery and rehabilitation through integrated assessment, AI-driven recommendations, pose detection, and practitioner management. Built with Next.js 16 and modern web technologies.

## Overview

RecoveryIQ is a dual-role platform designed for both patients and healthcare practitioners. Patients can track recovery progress through ROM measurements, movement scans, daily check-ins, and gamified engagement. Practitioners can manage patients, review detailed assessments, and monitor recovery metrics with AI-generated clinical insights.

## Key Features

### Patient Portal
- **Pre-Assessment** - Guided intake with body region selection and ROM capture (5/10-second countdown timer)
- **Movement Scan** - Track recovery progress with live video feed and pose detection during timer countdown
- **Daily Check-ins** - Symptom tracking, lifestyle habits, and function assessment
- **Avatar System** - Personalized gamified character with unlockable accessories and engagement tracking
- **Lifestyle Tracking** - Monitor diet, exercise, sleep, and wellness habits
- **Leaderboard** - Compete with other patients to boost engagement and recovery adherence
- **Recovery Score** - Real-time metrics, symmetry analysis, compensation index, and ROM progress
- **Kinetic Report** - Comprehensive report with AI-generated clinical summary and personalized recommendations
- **Recovery Plan** - 4-week Ayurveda-based personalized recovery plan with exercises, diet, and lifestyle guidance
- **Plan Tracking** - Monitor adherence, earn points/gems, unlock accessories, maintain recovery streaks
- **Plan Export** - Download recovery plan as text file for offline reference

### Practitioner Portal
- **Patient Management** - View all patients, their assessments, and recovery progress
- **Assessment Reports** - Detailed kinetic analysis with AI clinical insights
- **Device Integration** - Manage connected health devices
- **Session Tracking** - Schedule and monitor therapy sessions
- **AI Recommendations** - Claude Sonnet 3.5 powered clinical recommendations based on complete assessment data

### Technology Features
- **Pose Detection** - MediaPipe PoseLandmarker for body position analysis
- **ROM Tracking** - Range of motion measurement for 15+ joint pairs
- **Symmetry Analysis** - Left/right body balance calculation
- **Compensation Index** - Identifies adaptive movement patterns
- **Claude AI Integration** - Intelligent report generation with personalized clinical recommendations
- **Local Data Persistence** - localStorage for offline-first patient data

## Project Structure

```
recoveryiq/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with Sidebar/Topbar
│   ├── page.tsx                  # Home redirect
│   ├── globals.css               # Global styling with Hydrawav color scheme
│   ├── login/page.tsx            # Authentication (4 test users)
│   ├── api/
│   │   └── generate-report/      # Claude API endpoint for AI recommendations
│   ├── patient/                  # Patient portal
│   │   ├── page.tsx              # Dashboard
│   │   ├── assessment/           # Pre-assessment (ROM capture, body regions)
│   │   ├── avatar/               # Avatar customization
│   │   ├── checkin/              # Daily check-ins
│   │   ├── leaderboard/          # Gamification leaderboard
│   │   ├── lifestyle/            # Wellness tracking
│   │   ├── posture-check/        # Pre-assessment posture analysis
│   │   ├── recovery-plan/        # Treatment recommendations
│   │   └── scan/                 # Movement scan with progress tracking
│   └── practitioner/             # Practitioner portal
│       ├── page.tsx              # Dashboard
│       ├── clients/              # Client management
│       ├── devices/              # Device integration
│       ├── patient/[id]/         # Patient detail views
│       ├── session/              # Session management
│       └── settings/             # Practitioner settings
│
├── components/                   # Reusable React components
│   ├── BodyMap.tsx              # Interactive body mapping (front/back views)
│   ├── KineticReportDisplay.tsx # Report visualization with AI sections
│   ├── RecoveryScore.tsx        # Recovery metrics and ROM display
│   ├── Sidebar.tsx              # Navigation sidebar
│   ├── Topbar.tsx               # Top navigation
│   ├── Brand.tsx                # Logo component
│   └── AvatarCard.tsx           # Avatar display
│
├── lib/                          # Core business logic
│   ├── cv-engine.ts             # Computer vision (pose detection, ROM, symmetry)
│   ├── gamification.ts          # Scoring system, streak tracking, badge unlocking
│   ├── mock-data.ts             # Test data for 4 patients + recovery plan system
│   ├── protocol-recs.ts         # Recovery protocol recommendations
│   ├── protocols.ts             # Protocol definitions
│   ├── hydrawav.ts              # Hydrawav signal processing
│   └── helpers.ts               # Utility functions
│
├── public/                       # Static assets
├── package.json                  # Dependencies (Next.js 16, Anthropic SDK, etc.)
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── postcss.config.mjs            # PostCSS configuration
└── eslint.config.mjs             # ESLint rules
```

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16.2.4 (Turbopack) |
| **Language** | TypeScript 5+ |
| **UI Library** | React 19 |
| **AI/ML** | Claude Sonnet 3.5 (Anthropic) |
| **Pose Detection** | MediaPipe Vision (CDN) |
| **Data Visualization** | Recharts |
| **UI Components** | Lucide Icons |
| **Styling** | Tailwind CSS + CSS Modules |
| **State Management** | React Hooks (useState, useEffect, useRef) |
| **Storage** | localStorage for client-side persistence |

## Getting Started

### Prerequisites
- Node.js 18.0+
- npm or yarn
- Anthropic API key (for Claude AI features)

### Installation

1. **Clone and navigate**
```bash
cd recoveryiq
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create `.env` file:
```env
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_api_key_here
```

4. **Start development server**
```bash
npm run dev
```
Navigate to http://localhost:3000

### Test Accounts

| Username | Password | Role | Condition |
|----------|----------|------|-----------|
| maria | maria123 | Patient | Shoulder recovery |
| james | james123 | Patient | Low back pain |
| sarah | sarah123 | Patient | Athletic knee recovery |
| alex | alex123 | Patient | Postural neck correction |
| practitioner | hydra2026 | Practitioner | Staff access |

## Build & Production

### Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Features in Detail

### ROM (Range of Motion) Capture
- **5/10-Second Self-Capture Timer** - Patients can capture movement independently without assistance
- **Automated Detection** - Pose detection automatically initiates at timer end
- **Joint Measurement** - Measures 15+ joint pairs: shoulder, elbow, hip, knee, wrist, ankle
- **Confidence Scoring** - Shows detection quality (0-100%)
- **Baseline Comparison** - Tracks progress from pre-assessment baseline

### Movement Scan Tracking
- **Exercise Selection** - Squat, Forward Bend, Shoulder Flexion, Overhead Reach, Lunge
- **Symmetry Analysis** - Left/right body balance percentage
- **Compensation Index** - Detects adaptive patterns (0-100 scale)
- **Progress Badges** - Gamified rewards for consistent scanning
- **ROM History** - Compare current ROM to last scan with visual indicators (↑ improved, ↓ declined, → stable)

### AI-Generated Reports
- **Clinical Summary** - AI analysis of assessment data and recovery status
- **Personalized Recommendations** - Claude-generated recommendations based on affected regions and discomfort levels
- **Treatment Priorities** - Ranked action items for recovery
- **Clinical Insights** - Advanced analysis of patterns and progressions
- **PDF Export** - Download complete kinetic report

### AI-Generated Recovery Plans
- **4-Week Personalized Plan** - Claude Opus generates Ayurveda-based recovery protocols
- **Structured Content** - Weekly focus areas, daily exercises, nutrition guidance, lifestyle tips
- **Dosha Assessment** - Ayurvedic body constitution analysis and imbalance identification
- **Progress Tracking** - Daily checklist for exercises, diet adherence, and lifestyle scoring
- **Adherence Metrics** - Calculate completion rates (exercises 40%, diet 35%, lifestyle 25%)
- **Plan Export** - Download as text file for offline reference and printing
- **Real-Time Dashboard Widget** - Recovery plan widget appears on dashboard immediately after generation

### Gamification System
- **Points & Gems** - Earned from exercises, diet adherence, lifestyle tracking, and recovery plan completion
- **Recovery Plan Bonuses** - 100 points + 20 gems awarded upon plan generation
- **Daily Streaks** - Track consecutive days of recovery plan adherence with 🔥 streak indicator
- **Achievement Accessories** - Unlock equipment and avatar customization items based on milestones:
  - 7-day streak → Yoga Mat
  - 14-day streak → Meditation Cushion
  - Week 1 complete → Resistance Band
  - Week 4 complete → Master Recovery Badge
  - 500+ points → Champion Crown
  - Perfect weeks (100% adherence) → Week-specific achievement badges
- **Leaderboard** - Compare points and streaks with other patients
- **Real-Time Updates** - Cross-tab synchronization for live streak and point tracking

## API Endpoints

### POST /api/generate-recovery-plan
Generates a personalized 4-week Ayurveda-based recovery plan using Claude Opus 4

**Request Body:**
```json
{
  "patientName": "John Doe",
  "affectedRegions": ["shoulder", "knee"],
  "severityLevel": "moderate",
  "recoveryScore": 62,
  "primaryComplaint": "Post-surgical rehabilitation",
  "duration": "3 months",
  "lifestyle": "sedentary"
}
```

**Response:**
```json
{
  "overviewSummary": "4-week personalized recovery plan...",
  "ayurvedicAssessment": {
    "dosha": "Vata-Pitta",
    "imbalance": "Description of imbalance...",
    "recommendations": [...]
  },
  "weeks": [
    {
      "week": 1,
      "focus": "Foundation & Pain Management",
      "exercises": [...],
      "diet": [...],
      "lifestyle": [...]
    },
    ...
  ],
  "supplementaryTips": {
    "mobility": [...],
    "nutrition": [...],
    "lifestyle": [...]
  }
}
```

## Design & Styling

### Color Scheme (Hydrawav Palette)
- **Primary Navy** (`#072847`) - Deep navy for sidebar and primary surfaces
- **Warm Clay** (`#d17d5d`) - Warm tan accent for CTAs and highlights
- **Success Green** (`#00bb7f`) - Positive indicators, achievements
- **Cream** (`#f9f5f1`) - Light backgrounds and cards
- **Dark Text** (`#1a1a1a`) - Primary text content
- **Light Border** (`#e0e0e0`) - UI dividers and borders

### Responsive Design
- Mobile-first responsive layout
- Touch-friendly buttons and controls
- Optimized for 6-8 feet camera distance on mobile
- Full-body frame requirements for pose detection

## Development Notes

### State Management & Data Persistence
- Uses React Hooks (useState, useEffect, useRef) for component state
- localStorage for persistence across sessions with keys:
  - `riq_userId` - Current user session
  - `recovery_plan_${userId}` - Personalized 4-week recovery plan
  - `recovery_plan_progress_${userId}` - Weekly completion tracking and adherence data
  - `gamification_${userId}` - Points, gems, streak counters, accessories
- StorageEvent listeners for cross-tab real-time synchronization
- No external state library (optimized for performance)

### Recovery Plan System
- Plans generated via `/api/generate-recovery-plan` endpoint (Claude Opus)
- Includes weekly schedules with exercises, diet, and lifestyle guidance
- Tracks daily completion with checkbox system
- Calculates adherence percentage (exercises 40%, diet 35%, lifestyle 25%)
- Awards points: 25 per exercise, 15 for diet adherence, up to 20 bonus for lifestyle
- Maintains streaks and unlocks milestone-based accessories

### Pose Detection
- MediaPipe model loaded from CDN for smaller bundle size
- Requires camera permissions and proper lighting
- Full body must be visible (6-8 feet from camera recommended)
- Supports rear-facing cameras on mobile devices
- Live video feed visible during movement capture with timer below

### Data Flow
1. Patient completes assessment → data saved to localStorage
2. Assessment data sent to `/api/generate-recovery-plan`
3. Claude Opus analyzes and returns personalized 4-week plan
4. Plan displayed in RecoveryPlanDisplay with real-time tracker
5. Gamification system awards points and tracks streaks
6. Plan export available as text file for offline reference

## Performance

- **Build Time**: ~3.5s with Turbopack
- **Dev Server Startup**: ~360ms
- **Route Compilation**: 70-370ms
- **Page Load**: 25-180ms (varies by page complexity)
- **TypeScript**: 0 errors (strict mode enabled)

## Known Considerations

- LocalStorage limited to ~5-10MB per domain (sufficient for patient data)
- Pose detection performance varies with camera quality and lighting
- MediaPipe model (~20MB) loaded on-demand from CDN
- Recommends HTTPS for production deployment

## Future Enhancements

- Real-time practitioner dashboards with patient alerts
- Integration with wearable devices (heart rate, sleep data)
- Video recording of movements for detailed analysis
- Multi-language support
- Mobile app native version
- Advanced analytics and trend forecasting
- Telehealth appointment scheduling

## Support & Documentation

For issues, feature requests, or documentation: See project structure and component comments for detailed implementation notes.

---

**Last Updated:** April 2026 | **Status:** Production Ready with Recovery Plan System

## Key Features Implementation

### Gamification Engine (`lib/gamification.ts`)
- Point tracking and reward system
- Leaderboard calculations
- Badge and achievement management
- Engagement metrics

### Protocol Intelligence (`lib/protocol-recs.ts`, `lib/protocols.ts`)
- Recovery protocol matching based on conditions
- Personalized treatment recommendations
- Progress-based protocol adjustments

### Computer Vision (`lib/cv-engine.ts`)
- Body mapping and posture analysis
- Exercise form validation
- Recovery progress visualization

### Hydrawav Integration (`lib/hydrawav.ts`)
- Biometric data processing
- Signal analysis and interpretation
- Real-time health metrics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is part of the GlobeHack Hackathon Challenge.

## Contact & Support

For questions or support, please reach out to the development team or open an issue on GitHub.

---

**Project Repository:** [https://github.com/ray021207/GlobeHack_Hydrawav3_RecoveryIQ](https://github.com/ray021207/GlobeHack_Hydrawav3_RecoveryIQ)
