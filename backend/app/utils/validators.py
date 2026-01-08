"""
Input validation utilities.
Provides functions to validate user inputs for the birthday reminder application.
"""
import re
from datetime import datetime
from typing import Tuple, Optional


def validate_date_format(date_string: str) -> Tuple[bool, Optional[str]]:
    """
    Validate that a date string is in YYYY-MM-DD format and represents a valid date.
    
    Args:
        date_string: Date string to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not date_string:
        return False, "Date is required"
    
    # Check format with regex
    if not re.match(r'^\d{4}-\d{2}-\d{2}$', date_string):
        return False, "Date must be in YYYY-MM-DD format"
    
    # Try to parse the date
    try:
        date_obj = datetime.strptime(date_string, '%Y-%m-%d').date()
    except ValueError:
        return False, "Invalid date (e.g., 2023-02-30 is not valid)"
    
    # Check if date is in the future
    if date_obj > datetime.now().date():
        return False, "Date of birth cannot be in the future"
    
    # Check if date is too far in the past (e.g., before 1900)
    if date_obj.year < 1900:
        return False, "Date of birth must be after 1900"
    
    return True, None


def validate_name(name: str) -> Tuple[bool, Optional[str]]:
    """
    Validate friend's name.
    
    Args:
        name: Name string to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not name:
        return False, "Name is required"
    
    # Check if name is not just whitespace
    if not name.strip():
        return False, "Name cannot be empty or just whitespace"
    
    # Check length
    if len(name) > 255:
        return False, "Name must be 255 characters or less"
    
    return True, None


def validate_notes(notes: Optional[str]) -> Tuple[bool, Optional[str]]:
    """
    Validate optional notes field.
    
    Args:
        notes: Notes string to validate (can be None)
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if notes is None or notes == "":
        return True, None
    
    # Check length
    if len(notes) > 5000:
        return False, "Notes must be 5000 characters or less"
    
    return True, None


def validate_friend_data(data: dict, is_update: bool = False) -> Tuple[bool, Optional[str]]:
    """
    Validate friend data for create/update operations.
    
    Args:
        data: Dictionary containing friend data
        is_update: If True, all fields are optional (for updates)
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not is_update:
        # For create operations, name and date_of_birth are required
        if 'name' not in data:
            return False, "Name is required"
        if 'date_of_birth' not in data:
            return False, "Date of birth is required"
    
    # Validate name if provided
    if 'name' in data:
        is_valid, error = validate_name(data['name'])
        if not is_valid:
            return False, error
    
    # Validate date_of_birth if provided
    if 'date_of_birth' in data:
        is_valid, error = validate_date_format(data['date_of_birth'])
        if not is_valid:
            return False, error
    
    # Validate notes if provided
    if 'notes' in data:
        is_valid, error = validate_notes(data['notes'])
        if not is_valid:
            return False, error
    
    return True, None
