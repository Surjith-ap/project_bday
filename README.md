# Birthday Reminder Application

A production-ready full-stack web application that helps you manage friends' birthdays with automated reminders and AI-powered gift and event suggestions.

## 🎯 Features

- 🎂 **Birthday Management**: Add, edit, and delete friends with automatic age calculation
- 🔔 **Smart Reminders**: Automatic notifications 2 days before birthdays
- ✨ **AI Suggestions**: Personalized gift and event ideas powered by Google Gemini
- 🔐 **Secure Authentication**: User accounts with Supabase Auth
- 🌙 **Dark Mode**: Beautiful dark mode support
- 📱 **Responsive Design**: Works seamlessly on all devices
- 🎨 **Modern UI**: Glassmorphism effects with Tailwind CSS

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS for styling
- Axios for API calls
- Supabase client for authentication

**Backend:**
- Flask (Python) REST API
- Supabase (PostgreSQL) for database
- Google Gemini AI for suggestions
- JWT authentication

**Database:**
- PostgreSQL via Supabase
- Row-Level Security (RLS) policies

## 📁 Project Structure

```
Bday/
├── backend/          # Flask REST API
│   ├── app/
│   │   ├── routes/   # API endpoints
│   │   ├── services/ # Business logic
│   │   ├── utils/    # Helpers & validators
│   │   └── middleware/ # Auth middleware
│   ├── requirements.txt
│   └── README.md
│
└── frontend/         # React application
    ├── src/
    │   ├── components/ # UI components
    │   ├── pages/      # Page components
    │   ├── services/   # API & auth services
    │   ├── hooks/      # Custom React hooks
    │   └── utils/      # Helper functions
    ├── package.json
    └── README.md
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- Supabase account
- Google Gemini API key

### 1. Clone the Repository

```bash
cd d:\Bday
```

### 2. Set Up Supabase Database

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the following:

```sql
-- Create friends table
CREATE TABLE friends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_dob CHECK (date_of_birth <= CURRENT_DATE),
    CONSTRAINT name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

-- Create indexes
CREATE INDEX idx_friends_user_id ON friends(user_id);
CREATE INDEX idx_friends_dob ON friends(date_of_birth);

-- Enable Row Level Security
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own friends"
    ON friends FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own friends"
    ON friends FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own friends"
    ON friends FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own friends"
    ON friends FOR DELETE USING (auth.uid() = user_id);
```

3. Get your Supabase URL and anon key from Project Settings > API

### 3. Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key

### 4. Set Up Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env  # On Windows
# cp .env.example .env  # On macOS/Linux

# Edit .env with your credentials:
# - SUPABASE_URL
# - SUPABASE_KEY
# - GEMINI_API_KEY

# Run the server
python run.py
```

Backend will run at `http://localhost:5000`

### 5. Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
copy .env.example .env  # On Windows
# cp .env.example .env  # On macOS/Linux

# Edit .env with your credentials:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_API_URL (default: http://localhost:5000/api/v1)

# Run the development server
npm run dev
```

Frontend will run at `http://localhost:5173`

### 6. Create an Account

1. Open `http://localhost:5173` in your browser
2. Click "Don't have an account? Sign up"
3. Enter your email and password
4. Check your email for verification link
5. Sign in and start adding friends!

## 📖 Usage

### Adding a Friend

1. Click "Add Friend" button
2. Enter name, date of birth (YYYY-MM-DD), and optional notes
3. Click "Add Friend" to save

### Getting AI Suggestions

1. Click "✨ AI Suggestions" on any friend card
2. Toggle between "Gift Ideas" and "Event Ideas"
3. View personalized suggestions based on age and context

### Filtering Friends

- **All Friends**: View all your friends
- **🔔 Reminders**: Friends with birthdays in 2 days or less
- **📅 Upcoming**: Friends with birthdays in the next 30 days

## 🔧 API Endpoints

### Health Check
- `GET /api/v1/health` - Check API status

### Friends
- `GET /api/v1/friends` - Get all friends
- `GET /api/v1/friends/:id` - Get single friend
- `POST /api/v1/friends` - Create friend
- `PUT /api/v1/friends/:id` - Update friend
- `DELETE /api/v1/friends/:id` - Delete friend

### AI Suggestions
- `POST /api/v1/friends/:id/suggestions` - Get AI suggestions

All endpoints (except health check) require authentication via Bearer token.

## 🎨 Design Features

- **Glassmorphism**: Modern frosted glass effect on cards
- **Gradient Backgrounds**: Smooth color transitions
- **Dark Mode**: Automatic dark mode support
- **Animations**: Smooth transitions and micro-interactions
- **Responsive Grid**: Adapts to any screen size
- **Custom Badges**: Visual indicators for reminders

## 🔒 Security

- JWT-based authentication
- Row-Level Security in database
- Input validation on client and server
- CORS protection
- Environment variable management
- No sensitive data sent to AI

## 📝 License

This project is open source and available for personal use.

## 🙏 Acknowledgments

- Built with React, Flask, Supabase, and Google Gemini AI
- Styled with Tailwind CSS
- Icons from Unicode emoji
