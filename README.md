# ClarityWeb - Text Simplification Platform

Make any text accessible to everyone through AI-powered simplification.

## Features

- **Three Simplification Modes**: Simple, Accessible, Summary
- **Text-to-Speech**: Natural voice synthesis with word highlighting
- **Dyslexia-Friendly**: OpenDyslexic font and optimized layouts
- **URL Extraction**: Simplify content from any website
- **History Management**: Save and organize simplifications
- **Accessibility First**: WCAG AA compliant

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Styling**: Tailwind CSS v4 (CSSfirst with @theme directive)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Redux Toolkit + React Query (TanStack Query)
- **Forms**: TanStack Form + Zod v4 validation
- **Auth**: NextAuth v5 (Auth.js beta)
- **Database**: MongoDB with Mongoose ODM
- **Icons**: lucide-react
- **Notifications**: Sonner (toast notifications)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/clarity-web.git
   cd clarity-web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. Fill in the environment variables in `.env.local`:

   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)

5. Run the development server:

   ```bash
   npm run dev
   ```

   **Note for Windows Users**: Next.js 16+ uses Turbopack which requires symlink permissions. If you encounter "A required privilege is not held by the client" errors, either:

   - Enable Developer Mode in Windows Settings > Privacy & security > For developers
   - Run VS Code/terminal as Administrator
   - Use WSL (Windows Subsystem for Linux)

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── simplify/          # Simplification features
│   └── shared/            # Public shared links
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   ├── simplify/          # Simplification components
│   ├── accessibility/     # Accessibility features
│   └── ...
├── lib/
│   ├── actions/           # Server Actions
│   ├── db/                # Database models and connection
│   ├── stores/            # Redux store and slices
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript types
└── public/
    └── fonts/             # OpenDyslexic fonts
```

## Configuration

This project uses Tailwind CSS v4 with CSS-first configuration.

### Key Configuration Files:

- `app/index.css` - Tailwind theme and global styles
- `lib/config.ts` - Environment validation with Zod
- `lib/utils/constants.ts` - App constants and configuration

## Themes

ClarityWeb supports multiple themes for accessibility:

- **Normal**: Default light theme
- **Dark**: Dark mode
- **High Contrast**: Maximum contrast for visibility
- **Cream**: Warm background for dyslexia support

## Accessibility

- WCAG AA compliant
- Keyboard navigation support
- Screen reader optimized
- Reduced motion support
- OpenDyslexic font option
- Adjustable font sizes (12-32px)
- Text-to-speech with word highlighting
