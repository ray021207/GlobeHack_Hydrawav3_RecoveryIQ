# RecoveryIQ - Advanced Recovery Management Platform

A comprehensive web application for managing patient recovery and rehabilitation through integrated assessment, AI-driven recommendations, pose detection, and practitioner management. Built with Next.js 16 and modern web technologies.

## Overview

RecoveryIQ is a dual-role platform designed for both patients and healthcare practitioners. Patients can track recovery progress through ROM measurements, movement scans, daily check-ins, and gamified engagement. Practitioners can manage patients, review detailed assessments, and monitor recovery metrics with AI-generated clinical insights.

## Key Features

### Patient Portal
- **Pre-Assessment** - Guided intake with body region selection and ROM capture (5/10-second countdown timer)
- **Movement Scan** - Track recovery progress with pose detection and joint ROM measurements
- **Daily Check-ins** - Symptom tracking, lifestyle habits, and function assessment
- **Avatar System** - Personalized gamified character with accessories and engagement tracking
- **Lifestyle Tracking** - Monitor diet, exercise, sleep, and wellness habits
- **Leaderboard** - Compete with other patients to boost engagement and recovery adherence
- **Recovery Score** - Real-time metrics, symmetry analysis, compensation index, and ROM progress
- **Kinetic Report** - Comprehensive PDF report with AI-generated clinical summary and personalized recommendations

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
│   ├── kinetic-analysis.ts      # Report generation and analysis
│   ├── gamification.ts          # Scoring system and badge logic
│   ├── mock-data.ts             # Test data for 4 patients (maria, james, sarah, alex)
│   ├── protocol-recs.ts         # Recovery protocol recommendations
│   ├── protocols.ts             # Protocol definitions
│   ├── hydrawav.ts              # Hydrawav signal processing
│   └── claude-report-generator.ts # Claude API wrapper
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

### Gamification System
- **Points & Gems** - Earned from check-ins, scans, and milestones
- **Daily Streaks** - Motivate consistent engagement
- **Achievement Badges** - first_checkin, movement_pioneer, week_warrior, symmetry_star, etc.
- **Leaderboard** - Compare progress with other patients
- **Avatar Customization** - Personalize with animals and accessories

## API Endpoints

### POST /api/generate-report
Generates AI-powered clinical report using Claude Sonnet 3.5

**Request Body:**
```json
{
  "assessmentData": {
    "affectedRegions": ["shoulder", "knee"],
    "discomfortLevels": {"shoulder": 6, "knee": 4},
    "romScores": {"shoulder_flexion": 130},
    ...
  }
}
```

**Response:**
```json
{
  "executiveSummary": "Clinical summary from Claude...",
  "recommendations": [...],
  "insights": [...],
  "treatmentPriorities": [...]
}
```

## Development Notes

### State Management
- Uses React Hooks (useState, useEffect, useRef) for component state
- localStorage for persistence across sessions
- No external state library (optimized for performance)

### Pose Detection
- MediaPipe model loaded from CDN for smaller bundle size
- Requires camera permissions and proper lighting
- Full body must be visible (6-8 feet from camera recommended)
- Supports rear-facing cameras on mobile devices

### Data Flow
1. Patient completes assessment → data saved to localStorage
2. Assessment data sent to `/api/generate-report`
3. Claude analyzes and returns personalized recommendations
4. Report displayed in KineticReportDisplay component
5. PDF export via browser print dialog

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

**Last Updated:** April 2026 | **Status:** Production Ready

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
