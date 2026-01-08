"""
Birthday calculation service.
Handles all birthday-related calculations including age, next birthday, and reminder status.
"""
from datetime import datetime, date, timedelta
from typing import Dict


class BirthdayService:
    """Service for birthday-related calculations."""
    
    # Number of days before birthday to trigger reminder
    REMINDER_DAYS = 2
    
    @staticmethod
    def calculate_age(date_of_birth: date) -> int:
        """
        Calculate current age based on date of birth.
        
        Args:
            date_of_birth: Date of birth
            
        Returns:
            Current age in years
        """
        today = date.today()
        age = today.year - date_of_birth.year
        
        # Adjust if birthday hasn't occurred this year yet
        if (today.month, today.day) < (date_of_birth.month, date_of_birth.day):
            age -= 1
        
        return age
    
    @staticmethod
    def calculate_next_birthday(date_of_birth: date) -> date:
        """
        Calculate the next occurrence of a birthday.
        
        Args:
            date_of_birth: Date of birth
            
        Returns:
            Date of next birthday
        """
        today = date.today()
        current_year = today.year
        
        # Try this year's birthday
        try:
            next_birthday = date(current_year, date_of_birth.month, date_of_birth.day)
        except ValueError:
            # Handle Feb 29 in non-leap years - celebrate on Feb 28
            next_birthday = date(current_year, 2, 28)
        
        # If birthday has already passed this year, use next year
        if next_birthday < today:
            try:
                next_birthday = date(current_year + 1, date_of_birth.month, date_of_birth.day)
            except ValueError:
                # Handle Feb 29 in non-leap years
                next_birthday = date(current_year + 1, 2, 28)
        
        return next_birthday
    
    @staticmethod
    def calculate_days_until_birthday(next_birthday: date) -> int:
        """
        Calculate days remaining until next birthday.
        
        Args:
            next_birthday: Date of next birthday
            
        Returns:
            Number of days until birthday
        """
        today = date.today()
        delta = next_birthday - today
        return delta.days
    
    @staticmethod
    def is_reminder_due(days_until_birthday: int) -> bool:
        """
        Check if reminder should be triggered.
        
        Args:
            days_until_birthday: Days until birthday
            
        Returns:
            True if reminder should be shown (2 days or less)
        """
        return 0 <= days_until_birthday <= BirthdayService.REMINDER_DAYS
    
    @staticmethod
    def enrich_friend_data(friend_data: Dict) -> Dict:
        """
        Enrich friend data with calculated birthday fields.
        
        Args:
            friend_data: Dictionary containing at least 'date_of_birth'
            
        Returns:
            Enriched dictionary with age, next_birthday, days_until_birthday, is_reminder_due
        """
        # Parse date_of_birth if it's a string
        dob = friend_data['date_of_birth']
        if isinstance(dob, str):
            dob = datetime.strptime(dob, '%Y-%m-%d').date()
        
        # Calculate all birthday-related fields
        age = BirthdayService.calculate_age(dob)
        next_birthday = BirthdayService.calculate_next_birthday(dob)
        days_until = BirthdayService.calculate_days_until_birthday(next_birthday)
        reminder_due = BirthdayService.is_reminder_due(days_until)
        
        # Add calculated fields to friend data
        enriched_data = friend_data.copy()
        enriched_data.update({
            'age': age,
            'next_birthday': next_birthday.isoformat(),
            'days_until_birthday': days_until,
            'is_reminder_due': reminder_due
        })
        
        return enriched_data
