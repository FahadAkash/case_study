# Case Study Platform (Northfold Aesthetic)

A high-performance, minimalist engineering case study and portfolio website inspired by the Northfold design aesthetic (monochrome off-white/near-black palette, halftone/dotted imagery, grotesk typography with serif body, pill tags, and smooth GSAP animations). Powered by **Next.js 15 App Router**, **Neon Serverless Postgres**, and **Mermaid.js**.

---

## Key Features

- **Public Portfolio & Archive**:
  - **Home**: Headline statement, halftone hero orb, featured case studies, and capabilities strip.
  - **Work Catalog (`/work`)**: Real-time topic filter pills (Game Development, AR/VR, Backend Systems, AI/ML, DevTools, Forward Deployed Engineering, Cloud Infrastructure), keyword & stack search, and live "Showing X of Y" counter.
  - **Case Study Detail (`/work/[slug]`)**: Header facts specification table (Domain, Role, Duration, Year, Status, Stack), hero media with lightbox zoom, block-based sections, and next/previous project navigation.
  - **About (`/about`)**: Engineering story & creed, toolchain matrix, and downloadable CV.
  - **FAQ (`/faq`)**: Categorized accessible accordion.
  - **Contact (`/contact`)**: Inquiries form with anti-spam honeypot, direct social links, and Neon DB persistence.
- **Interactive Mermaid.js Diagram System**:
  - System topology flowcharts (`flowchart TD`, `flowchart LR`).
  - Database entity-relationship schemas (`erDiagram`).
  - Sequence flows (`sequenceDiagram`).
  - Zoom controls, diagram vs. source code toggling, and one-click copy.
- **No-Code Admin CMS (`/admin`)**:
  - Protected by server-side middleware and HMAC-signed HTTP-only session cookies (`/admin/login`).
  - **Discipline Templates**: Pre-fills structured prompts tailored to Game Development, AR/VR, Backend Systems, AI/ML, DevTools, Forward Deployed Engineering (FDE), Cloud Infrastructure, or Blank.
  - **Block-Based Section Editor**: Add, remove, and reorder Rich Text, Image, Gallery, Video, Code Snippets, Stat Metric Cards, Architecture/Database Diagrams (Mermaid), and Quotes.
  - **Google Drive Media Resolver**: Converts pasted Drive links to direct `lh3.googleusercontent.com` CDN images and embeddable previews with public sharing warnings.
  - **Live Preview Tab**: Toggle to view exact public layout rendering in real-time.
  - **Autosave & On-Demand Revalidation**: Publishes changes immediately to the live site with zero redeployments.
  - **Topic Manager, Site Settings, FAQ Manager, Inquiries Inbox, and Full JSON Backup Export**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, React 19) |
| **Styling & UI** | Tailwind CSS, Shadcn UI, Radix UI Primitives, Lucide Icons |
| **Animations** | GSAP (GreenSock) + ScrollTrigger (prefers-reduced-motion safe) |
| **Database** | Neon Serverless Postgres (`@neondatabase/serverless`) |
| **Diagrams** | Mermaid.js |
| **Language** | TypeScript |

---

## Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node.js 22)
- npm or pnpm
- Neon Postgres database

### 2. Installation
```bash
git clone https://github.com/FahadAkash/case_study.git
cd case_study
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the project root (see `.env.example`):
```bash
# Neon Postgres Connection String (Pooler recommended)
DATABASE_URL="postgresql://neondb_owner:password@ep-your-endpoint-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Admin Access Credentials
ADMIN_PASSWORD="your-secure-admin-password"
ADMIN_SESSION_SECRET="your-secret-session-salt"
```

### 4. Database Setup & Seeding
Run migrations to initialize the tables in Neon Postgres, then seed sample case studies:
```bash
# Run database schema migrations
npm run db:migrate

# Seed realistic case studies, topics, FAQs, and site settings
npm run db:seed
```

### 5. Running Locally
```bash
# Start development server
npm run dev

# Or build and start production server
npm run build
npm run start
```
Open [http://localhost:3000](http://localhost:3000) to view the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the Admin CMS.

---

## Verification & Testing

Run automated tests against the database, Drive resolver, and HTTP endpoints:
```bash
# Test Neon queries, Drive parser, and contact message persistence
npx tsx scripts/test-e2e.ts

# Test all HTTP endpoints
npx tsx scripts/test-http.ts
```

---

## License
MIT
