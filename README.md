# WeeksToDie

A life visualization tool that displays your entire life as a grid of weeks (80 years x 52 weeks = 4,160 weeks). Track how many weeks you've lived and what's ahead.

## Features

- Visual grid showing all weeks of an 80-year lifespan
- Color-coded life stages (childhood, study, work, retirement)
- Track todos/goals for specific weeks
- Configure custom life stage boundaries
- Dark mode support
- High-performance Canvas rendering

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Auth & Database:** Supabase
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/weekstodie.git
cd weekstodie
```

### 2. Install dependencies

```bash
bun install
# or
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` - Your Supabase anon/public key
- `DATABASE_URL` - PostgreSQL connection string (optional, for direct DB access)

### 4. Set up the database

Go to your Supabase Dashboard > SQL Editor and run the contents of `supabase/schema.sql`.

This creates:
- `profiles` table (user settings and birth date)
- `week_todos` table (tasks linked to specific weeks)
- Auto-create profile trigger on user registration
- Row Level Security policies

### 5. Run the development server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── (auth)/          # Auth pages (login, register)
├── (protected)/     # Protected routes (dashboard)
├── components/      # React components
├── contexts/        # React contexts (Auth)
├── hooks/           # Custom hooks
├── interfaces/      # TypeScript interfaces
├── lib/             # Utilities (Supabase client, calculations)
├── repositories/    # Data access layer
├── services/        # Business logic layer
└── types/           # TypeScript types
```

## License

MIT
