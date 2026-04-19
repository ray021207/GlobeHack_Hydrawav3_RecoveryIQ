# RecoveryIQ - GlobeHack Hydrawav3 Recovery Platform

A comprehensive web application for managing patient recovery and rehabilitation through integrated assessment, gamification, and practitioner management features. Built with modern web technologies for real-time patient monitoring and clinical insights.

## Overview

RecoveryIQ is a dual-role platform designed for both patients and healthcare practitioners. Patients can track their recovery progress, complete assessments, and engage with gamified recovery protocols. Practitioners can manage multiple patients, monitor recovery metrics, and provide personalized treatment recommendations.

## Features

### Patient Portal
- **Dashboard** - Personalized recovery overview and quick stats
- **Assessment** - Guided recovery and health assessments
- **Check-in** - Daily progress tracking and symptom reporting
- **Avatar System** - Personalized patient avatar representation
- **Lifestyle Tracking** - Monitor diet, exercise, and wellness habits
- **Leaderboard** - Gamified competition to motivate recovery goals
- **Body Scan** - Visual body mapping for injury/condition tracking
- **Recovery Score** - Real-time progress metrics and milestones

### Practitioner Portal
- **Client Management** - Monitor multiple patients and their progress
- **Patient Profiles** - Detailed patient information and history
- **Device Integration** - Connect and manage external health devices
- **Session Management** - Schedule and track therapy sessions
- **Protocol Recommendations** - AI-powered recovery protocol suggestions
- **Gamification Engine** - Design custom challenges and rewards for patients

### Core Technology
- **Hydrawav Integration** - Advanced signal processing for biometric data
- **Computer Vision Engine** - Body mapping and posture analysis
- **Protocol Intelligence** - Smart recovery protocol matching
- **Gamification System** - Engagement and adherence optimization

## Project Structure

```
recoveryiq/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── login/                   # Authentication
│   │   └── page.tsx
│   ├── patient/                 # Patient portal
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Dashboard
│   │   ├── assessment/          # Health assessments
│   │   ├── avatar/              # Avatar customization
│   │   ├── checkin/             # Daily check-ins
│   │   ├── leaderboard/         # Gamification leaderboard
│   │   ├── lifestyle/           # Wellness tracking
│   │   └── scan/                # Body mapping
│   └── practitioner/            # Practitioner portal
│       ├── layout.tsx
│       ├── page.tsx             # Dashboard
│       ├── clients/             # Client management
│       ├── devices/             # Device integration
│       ├── patient/             # Patient details
│       └── session/             # Session management
│
├── components/                  # Reusable React components
│   ├── AvatarCard.tsx          # Avatar display component
│   ├── BodyMap.tsx             # Interactive body mapping
│   ├── Brand.tsx               # Logo & branding
│   ├── RecoveryScore.tsx        # Recovery metrics display
│   ├── Sidebar.tsx             # Navigation sidebar
│   └── Topbar.tsx              # Top navigation bar
│
├── lib/                         # Core utilities & business logic
│   ├── cv-engine.ts            # Computer vision functionality
│   ├── gamification.ts         # Gamification scoring system
│   ├── hydrawav.ts             # Hydrawav signal processing
│   ├── mock-data.ts            # Development mock data
│   ├── protocol-recs.ts        # Protocol recommendation engine
│   └── protocols.ts            # Recovery protocol definitions
│
└── public/                      # Static assets

```

## Tech Stack

### Frontend Framework
- **Next.js 14+** - React framework with App Router, SSR, and optimized performance
- **TypeScript** - Type-safe JavaScript for better code quality
- **React** - Component-based UI library

### Styling & UI
- **CSS Modules** - Scoped styling for components
- **PostCSS** - CSS transformations and preprocessing

### Development Tools
- **ESLint** - Code quality and style enforcement
- **Node.js** - JavaScript runtime environment

### Architecture
- **App Router** - Modern Next.js routing with nested layouts
- **Component-Based Design** - Modular, reusable components
- **Utility Libraries** - Dedicated modules for business logic

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ray021207/GlobeHack_Hydrawav3_RecoveryIQ.git
cd recoveryiq
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Development

- Modify pages in the `app/` directory - changes auto-update in the browser
- Create new components in the `components/` directory
- Add business logic to the `lib/` directory
- Styling is located in `globals.css` and component-level CSS

## Build & Production

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

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
