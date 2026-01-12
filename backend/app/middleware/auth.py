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
        logger.warning("No Authorization header found")
        return None
    
    # Extract token from "Bearer <token>"
    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != 'bearer':
        logger.warning(f"Invalid Authorization header format: {auth_header[:20]}...")
        return None
    
    token = parts[1]
    logger.info(f"Token received (first 20 chars): {token[:20]}...")
    
    try:
        # Verify token with Supabase
        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = current_app.config['SUPABASE_KEY']
        
        logger.info(f"Creating Supabase client with URL: {supabase_url}")
        logger.info(f"Using API key (first 20 chars): {supabase_key[:20]}...")
        
        client = create_client(supabase_url, supabase_key)
        
        # Get user from token - pass JWT as parameter
        logger.info("Calling client.auth.get_user() with JWT token")
        response = client.auth.get_user(jwt=token)
        
        logger.info(f"Response type: {type(response)}")
        logger.info(f"Response: {response}")
        
        if response and response.user:
            user_id = response.user.id
            logger.info(f"Successfully verified user: {user_id}")
            return user_id
        
        logger.warning("No user found in response")
        return None
        
    except Exception as e:
        logger.error(f"Token verification failed: {type(e).__name__}: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
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
