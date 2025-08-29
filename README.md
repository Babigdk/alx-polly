# PollApp - Modern Polling Application

A modern, responsive polling application built with Next.js 15, TypeScript, and Tailwind CSS. Create, share, and participate in polls with real-time results.

## Features

- **User Authentication** - Sign up and sign in functionality (placeholder)
- **Create Polls** - Easy-to-use interface for creating new polls
- **View Polls** - Browse and discover polls from the community
- **Vote on Polls** - Participate in polls and see real-time results
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern UI** - Built with Shadcn UI components and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Icons**: Lucide React
- **State Management**: React hooks (ready for expansion)

## Project Structure

```
alx-polly/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   └── page.tsx             # Sign in/sign up page
│   ├── polls/                    # Poll-related pages
│   │   ├── page.tsx             # Polls listing page
│   │   ├── create/              # Create poll functionality
│   │   │   └── page.tsx         # Create new poll page
│   │   └── [id]/                # Dynamic poll pages
│   │       └── page.tsx         # Individual poll view
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn UI components
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card components
│   │   ├── input.tsx            # Input component
│   │   ├── label.tsx            # Label component
│   │   └── progress.tsx         # Progress bar component
│   └── navigation.tsx           # Main navigation component
├── lib/                         # Utility functions
│   └── utils.ts                 # Utility functions (cn, etc.)
└── public/                      # Static assets
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Available Routes

- `/` - Home page with featured polls and app overview
- `/auth` - Authentication page (sign in/sign up)
- `/polls` - Browse all polls
- `/polls/create` - Create a new poll
- `/polls/[id]` - View and vote on a specific poll

## Components Overview

### UI Components (Shadcn)
- **Button** - Versatile button component with multiple variants
- **Card** - Container component for content sections
- **Input** - Form input component
- **Label** - Form label component
- **Progress** - Progress bar for poll results

### Custom Components
- **Navigation** - Main app navigation with links to key pages

## Development Notes

### Current State
- ✅ Basic folder structure implemented
- ✅ UI components set up with Shadcn
- ✅ Placeholder pages for all major features
- ✅ Responsive design with Tailwind CSS
- ✅ Mock data for demonstration

### Next Steps
- [ ] Implement user authentication (NextAuth.js recommended)
- [ ] Add database integration (Prisma + PostgreSQL)
- [ ] Implement real-time voting with WebSockets
- [ ] Add user profiles and poll management
- [ ] Implement search and filtering for polls
- [ ] Add analytics and poll insights

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
