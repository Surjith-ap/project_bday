# Birthday Reminder Backend

Flask-based REST API for the Birthday Reminder application.

## Setup Instructions

### 1. Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On macOS/Linux
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
copy .env.example .env  # On Windows
# cp .env.example .env  # On macOS/Linux
```

Edit `.env` with your actual values:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon/public key
- `GEMINI_API_KEY`: Your Google Gemini API key

### 4. Set Up Supabase Database

Run this SQL in your Supabase SQL Editor:

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
CREATE INDEX idx_friends_user_dob ON friends(user_id, date_of_birth);

-- Enable Row Level Security
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own friends"
    ON friends FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own friends"
    ON friends FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own friends"
    ON friends FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own friends"
    ON friends FOR DELETE
    USING (auth.uid() = user_id);
```

### 5. Run the Application

```bash
python run.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/v1/health` - Check API status

### Friends
- `GET /api/v1/friends` - Get all friends
  - Query params: `upcoming=true`, `reminders=true`
- `GET /api/v1/friends/<id>` - Get single friend
- `POST /api/v1/friends` - Create friend
- `PUT /api/v1/friends/<id>` - Update friend
- `DELETE /api/v1/friends/<id>` - Delete friend

### AI Suggestions
- `POST /api/v1/friends/<id>/suggestions` - Get AI suggestions
  - Body: `{"suggestion_type": "gifts"}` or `{"suggestion_type": "events"}`

## Authentication

All endpoints (except `/health`) require a Supabase JWT token in the Authorization header:

```
Authorization: Bearer <your_supabase_jwt_token>
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── config.py            # Configuration
│   ├── middleware/
│   │   └── auth.py          # JWT authentication
│   ├── models/              # Data models (future)
│   ├── routes/
│   │   ├── health.py        # Health check
│   │   └── friends.py       # Friends CRUD + AI
│   ├── services/
│   │   ├── supabase_service.py  # Database operations
│   │   ├── birthday_service.py  # Birthday calculations
│   │   └── ai_service.py        # Gemini AI integration
│   └── utils/
│       └── validators.py    # Input validation
├── tests/                   # Unit tests
├── requirements.txt         # Python dependencies
├── .env.example            # Environment template
└── run.py                  # Application entry point
```

## Development

Run in debug mode (auto-reload enabled):
```bash
python run.py
```

## Testing

```bash
pytest tests/ -v
pytest --cov=app --cov-report=html
```
