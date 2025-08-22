# LinguaLearn - AI-Powered Language Learning Platform

## Overview

LinguaLearn is a modern language learning application designed to help users learn English through culturally-aware, AI-powered content. The platform adapts articles to the user's proficiency level and provides click-to-define functionality with cultural context. Built as a full-stack web application with a React frontend and Express backend, it leverages OpenAI for intelligent content adaptation and PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **UI Components**: Shadcn/ui component library with Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful endpoints organized by resource (users, articles, vocabulary, progress)
- **Development**: Hot reload with Vite integration for seamless development experience

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Database**: PostgreSQL with Neon serverless hosting for scalable data storage
- **Schema Design**: 
  - Users table for profile and progress tracking
  - Articles table for content storage with difficulty levels and categories
  - User progress tracking for completed articles and comprehension scores
  - Vocabulary table for personal word collections
- **Migrations**: Drizzle Kit for database schema versioning

### AI Integration
- **Provider**: OpenAI GPT-4o for content adaptation and word definitions
- **Features**:
  - Article adaptation to user's proficiency level
  - Cultural context-aware word definitions
  - Comprehension question generation
  - Native language translation support

### Authentication & User Management
- **Session Management**: Express sessions with PostgreSQL session store
- **User Profiles**: Support for multiple native languages (Spanish, French, Mandarin)
- **Progress Tracking**: Streak counters, vocabulary counts, and achievement systems

### Content Management
- **Article Categories**: Business, Technology, Culture, Travel, Science, General
- **Difficulty Levels**: CEFR standard (A1-C2) for consistent proficiency mapping
- **Interactive Features**: Click-to-define functionality with cultural context
- **Progress Metrics**: Reading time estimation and comprehension scoring

## External Dependencies

- **Database**: Neon PostgreSQL for serverless database hosting
- **AI Services**: OpenAI API for content adaptation and natural language processing
- **UI Framework**: Radix UI for accessible component primitives
- **Styling**: Tailwind CSS for utility-first styling approach
- **Icons**: Lucide React for consistent iconography
- **Development**: Replit-specific plugins for deployment and error handling
- **Session Storage**: connect-pg-simple for PostgreSQL-backed session management
- **Validation**: Zod for runtime type validation and schema parsing
- **Date Handling**: date-fns for date manipulation and formatting