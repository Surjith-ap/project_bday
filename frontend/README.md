# Birthday Reminder - Frontend

React frontend for the Birthday Reminder application with AI-powered suggestions.

## Features

- 🎂 Manage friends' birthdays with ease
- 🔔 Automatic reminders 2 days before birthdays
- ✨ AI-powered gift and event suggestions
- 🌙 Dark mode support
- 📱 Responsive design with glassmorphism effects
- 🎨 Beautiful Tailwind CSS styling

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
copy .env.example .env  # On Windows
# cp .env.example .env  # On macOS/Linux
```

Edit `.env` with your actual values:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api/v1)

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── FriendCard.jsx
│   │   ├── FriendForm.jsx
│   │   ├── FriendList.jsx
│   │   ├── AISuggestions.jsx
│   │   └── Layout.jsx
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   └── Dashboard.jsx
│   ├── services/        # API services
│   │   ├── auth.js      # Supabase auth
│   │   └── api.js       # Backend API client
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useFriends.js
│   ├── utils/           # Utility functions
│   │   ├── dateHelpers.js
│   │   └── validators.js
│   ├── styles/          # CSS styles
│   │   └── index.css    # Tailwind + custom styles
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Key Features

### Authentication
- Sign up / Sign in with Supabase Auth
- Automatic session management
- Protected routes

### Friend Management
- Add, edit, delete friends
- Automatic age calculation
- Birthday countdown
- Filter by reminders or upcoming birthdays

### AI Suggestions
- Gift ideas powered by Gemini AI
- Event/celebration suggestions
- Personalized based on age and notes

### Design
- Glassmorphism effects
- Dark mode support
- Smooth animations
- Responsive grid layout
- Custom Tailwind theme

## Technologies

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Supabase** - Authentication
- **Axios** - HTTP client
- **Google Fonts (Inter)** - Typography
