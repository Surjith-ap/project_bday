"""
Authentication middleware.
Handles JWT token verification using Supabase auth.
"""
from functools import wraps
from flask import request, jsonify, current_app
from supabase import create_client
import logging

logger = logging.getLogger(__name__)


def get_user_from_token():
    """
    Extract and verify user from JWT token in Authorization header.
    
    Returns:
        User ID if valid, None otherwise
    """
    auth_header = request.headers.get('Authorization')
    
    if not auth_header:
        return None
    
    # Extract token from "Bearer <token>"
    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != 'bearer':
        return None
    
    token = parts[1]
    
    try:
        # Verify token with Supabase
        client = create_client(
            current_app.config['SUPABASE_URL'],
            current_app.config['SUPABASE_KEY']
        )
        
        # Get user from token
        user = client.auth.get_user(token)
        
        if user and user.user:
            return user.user.id
        return None
        
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        return None


def require_auth(f):
    """
    Decorator to require authentication for routes.
    Adds user_id to kwargs if authentication succeeds.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = get_user_from_token()
        
        if not user_id:
            return jsonify({
                'error': 'Unauthorized',
                'message': 'Valid authentication token required'
            }), 401
        
        # Add user_id to kwargs
        kwargs['user_id'] = user_id
        return f(*args, **kwargs)
    
    return decorated_function
