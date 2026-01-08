"""
Gemini AI service module.
Provides AI-powered gift and event suggestions using Google's Gemini API.
"""
import google.generativeai as genai
from flask import current_app
from typing import List, Dict, Optional
import json
import logging

logger = logging.getLogger(__name__)


class AIService:
    """Service for AI-powered suggestions using Gemini."""
    
    _model = None
    
    @classmethod
    def get_model(cls):
        """
        Get or create Gemini model instance.
        
        Returns:
            Gemini generative model
        """
        if cls._model is None:
            api_key = current_app.config['GEMINI_API_KEY']
            genai.configure(api_key=api_key)
            cls._model = genai.GenerativeModel('gemini-pro')
        return cls._model
    
    @classmethod
    def generate_gift_suggestions(cls, friend_name: str, age: int, notes: Optional[str] = None) -> List[Dict]:
        """
        Generate personalized gift suggestions using Gemini AI.
        
        Args:
            friend_name: Name of the friend
            age: Current age (turning age+1)
            notes: Optional relationship context
            
        Returns:
            List of gift suggestion dictionaries
        """
        try:
            model = cls.get_model()
            
            # Build the prompt
            prompt = f"""You are a thoughtful gift recommendation assistant. Based on the following information about a friend, suggest 5 personalized gift ideas for their upcoming birthday.

Friend Details:
- Name: {friend_name}
- Age: {age} (turning {age + 1})
- Relationship Context: {notes if notes else 'No additional context provided'}

Requirements:
1. Suggest gifts appropriate for their age and interests
2. Include a mix of price ranges (budget-friendly to premium)
3. Provide brief reasoning for each suggestion
4. Format as JSON array with fields: title, description, reasoning, estimated_price_range

Output ONLY valid JSON in this exact format:
[
  {{
    "title": "Gift name",
    "description": "Brief description",
    "reasoning": "Why this gift fits",
    "estimated_price_range": "$X-$Y"
  }}
]"""
            
            # Generate response
            response = model.generate_content(prompt)
            
            # Parse JSON response
            try:
                # Extract JSON from response text
                text = response.text.strip()
                # Remove markdown code blocks if present
                if text.startswith('```'):
                    text = text.split('```')[1]
                    if text.startswith('json'):
                        text = text[4:]
                    text = text.strip()
                
                suggestions = json.loads(text)
                return suggestions[:5]  # Ensure max 5 suggestions
            except json.JSONDecodeError:
                logger.error(f"Failed to parse AI response as JSON: {response.text}")
                return cls._get_fallback_gift_suggestions(age)
                
        except Exception as e:
            logger.error(f"Error generating gift suggestions: {e}")
            return cls._get_fallback_gift_suggestions(age)
    
    @classmethod
    def generate_event_suggestions(cls, friend_name: str, age: int, notes: Optional[str] = None) -> List[Dict]:
        """
        Generate personalized event/celebration suggestions using Gemini AI.
        
        Args:
            friend_name: Name of the friend
            age: Current age (turning age+1)
            notes: Optional relationship context
            
        Returns:
            List of event suggestion dictionaries
        """
        try:
            model = cls.get_model()
            
            # Build the prompt
            prompt = f"""You are a creative event planning assistant. Based on the following information about a friend, suggest 5 small celebration or surprise ideas for their upcoming birthday.

Friend Details:
- Name: {friend_name}
- Age: {age} (turning {age + 1})
- Relationship Context: {notes if notes else 'No additional context provided'}

Requirements:
1. Suggest events ranging from intimate to small group activities
2. Include both in-person and virtual options
3. Consider age-appropriate activities
4. Provide brief planning tips for each
5. Format as JSON array with fields: title, description, planning_tips, estimated_budget

Output ONLY valid JSON in this exact format:
[
  {{
    "title": "Event name",
    "description": "Brief description",
    "planning_tips": "How to execute this",
    "estimated_budget": "$X-$Y or Free"
  }}
]"""
            
            # Generate response
            response = model.generate_content(prompt)
            
            # Parse JSON response
            try:
                # Extract JSON from response text
                text = response.text.strip()
                # Remove markdown code blocks if present
                if text.startswith('```'):
                    text = text.split('```')[1]
                    if text.startswith('json'):
                        text = text[4:]
                    text = text.strip()
                
                suggestions = json.loads(text)
                return suggestions[:5]  # Ensure max 5 suggestions
            except json.JSONDecodeError:
                logger.error(f"Failed to parse AI response as JSON: {response.text}")
                return cls._get_fallback_event_suggestions(age)
                
        except Exception as e:
            logger.error(f"Error generating event suggestions: {e}")
            return cls._get_fallback_event_suggestions(age)
    
    @staticmethod
    def _get_fallback_gift_suggestions(age: int) -> List[Dict]:
        """Fallback gift suggestions if AI fails."""
        return [
            {
                "title": "Personalized Photo Album",
                "description": "A custom photo album with memorable moments",
                "reasoning": "Thoughtful and personal gift suitable for any age",
                "estimated_price_range": "$20-$50"
            },
            {
                "title": "Gift Card",
                "description": "Gift card to their favorite store or restaurant",
                "reasoning": "Flexible option that lets them choose what they want",
                "estimated_price_range": "$25-$100"
            },
            {
                "title": "Book or E-Reader",
                "description": "A bestselling book or Kindle device",
                "reasoning": "Great for readers of all ages",
                "estimated_price_range": "$15-$150"
            }
        ]
    
    @staticmethod
    def _get_fallback_event_suggestions(age: int) -> List[Dict]:
        """Fallback event suggestions if AI fails."""
        return [
            {
                "title": "Surprise Birthday Dinner",
                "description": "Organize a dinner at their favorite restaurant",
                "planning_tips": "Make a reservation, invite close friends, coordinate arrival time",
                "estimated_budget": "$30-$100 per person"
            },
            {
                "title": "Virtual Birthday Party",
                "description": "Host a video call celebration with friends and family",
                "planning_tips": "Send calendar invites, prepare games or activities, arrange for cake delivery",
                "estimated_budget": "Free-$50"
            },
            {
                "title": "Movie Night",
                "description": "Host a movie marathon with their favorite films",
                "planning_tips": "Prepare snacks, create cozy atmosphere, let them choose movies",
                "estimated_budget": "$20-$50"
            }
        ]
