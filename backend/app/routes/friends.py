"""
Friends API endpoints.
Handles CRUD operations for friends and AI suggestions.
"""
from flask import Blueprint, request, jsonify
from app.middleware.auth import require_auth
from app.services.supabase_service import SupabaseService
from app.services.birthday_service import BirthdayService
from app.services.ai_service import AIService
from app.utils.validators import validate_friend_data
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

friends_bp = Blueprint('friends', __name__)


@friends_bp.route('/friends', methods=['GET'])
@require_auth
def get_friends(user_id):
    """
    Get all friends for the authenticated user.
    
    Query Parameters:
        upcoming (bool): Filter friends with upcoming birthdays (within 30 days)
        reminders (bool): Filter friends needing reminders (2 days or less)
    
    Returns:
        JSON response with list of friends
    """
    try:
        # Get query parameters
        show_upcoming = request.args.get('upcoming', '').lower() == 'true'
        show_reminders = request.args.get('reminders', '').lower() == 'true'
        
        # Fetch friends from database
        friends = SupabaseService.get_friends(user_id)
        
        # Enrich with birthday data
        enriched_friends = []
        for friend in friends:
            enriched = BirthdayService.enrich_friend_data(friend)
            
            # Apply filters
            if show_upcoming and enriched['days_until_birthday'] > 30:
                continue
            if show_reminders and not enriched['is_reminder_due']:
                continue
            
            enriched_friends.append(enriched)
        
        # Sort by days until birthday
        enriched_friends.sort(key=lambda x: x['days_until_birthday'])
        
        return jsonify({
            'friends': enriched_friends,
            'count': len(enriched_friends)
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching friends: {e}")
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'Failed to fetch friends'
        }), 500


@friends_bp.route('/friends/<friend_id>', methods=['GET'])
@require_auth
def get_friend(friend_id, user_id):
    """
    Get a single friend by ID.
    
    Args:
        friend_id: Friend UUID
    
    Returns:
        JSON response with friend data
    """
    try:
        friend = SupabaseService.get_friend_by_id(friend_id, user_id)
        
        if not friend:
            return jsonify({
                'error': 'Not Found',
                'message': 'Friend not found'
            }), 404
        
        # Enrich with birthday data
        enriched = BirthdayService.enrich_friend_data(friend)
        
        return jsonify(enriched), 200
        
    except Exception as e:
        logger.error(f"Error fetching friend {friend_id}: {e}")
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'Failed to fetch friend'
        }), 500


@friends_bp.route('/friends', methods=['POST'])
@require_auth
def create_friend(user_id):
    """
    Create a new friend.
    
    Request Body:
        name (str): Friend's name
        date_of_birth (str): Date of birth in YYYY-MM-DD format
        notes (str, optional): Additional notes
    
    Returns:
        JSON response with created friend data
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'Bad Request',
                'message': 'Request body must be JSON'
            }), 400
        
        # Validate input
        is_valid, error_message = validate_friend_data(data, is_update=False)
        if not is_valid:
            return jsonify({
                'error': 'Bad Request',
                'message': error_message
            }), 400
        
        # Create friend in database
        friend_data = {
            'name': data['name'].strip(),
            'date_of_birth': data['date_of_birth'],
            'notes': data.get('notes', '').strip() if data.get('notes') else None
        }
        
        created_friend = SupabaseService.create_friend(user_id, friend_data)
        
        # Enrich with birthday data
        enriched = BirthdayService.enrich_friend_data(created_friend)
        
        return jsonify(enriched), 201
        
    except Exception as e:
        logger.error(f"Error creating friend: {e}")
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'Failed to create friend'
        }), 500


@friends_bp.route('/friends/<friend_id>', methods=['PUT'])
@require_auth
def update_friend(friend_id, user_id):
    """
    Update an existing friend.
    
    Args:
        friend_id: Friend UUID
    
    Request Body:
        name (str, optional): Friend's name
        date_of_birth (str, optional): Date of birth in YYYY-MM-DD format
        notes (str, optional): Additional notes
    
    Returns:
        JSON response with updated friend data
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'Bad Request',
                'message': 'Request body must be JSON'
            }), 400
        
        # Validate input
        is_valid, error_message = validate_friend_data(data, is_update=True)
        if not is_valid:
            return jsonify({
                'error': 'Bad Request',
                'message': error_message
            }), 400
        
        # Prepare update data
        update_data = {}
        if 'name' in data:
            update_data['name'] = data['name'].strip()
        if 'date_of_birth' in data:
            update_data['date_of_birth'] = data['date_of_birth']
        if 'notes' in data:
            update_data['notes'] = data['notes'].strip() if data['notes'] else None
        
        # Add updated_at timestamp
        update_data['updated_at'] = datetime.utcnow().isoformat()
        
        # Update friend in database
        updated_friend = SupabaseService.update_friend(friend_id, user_id, update_data)
        
        if not updated_friend:
            return jsonify({
                'error': 'Not Found',
                'message': 'Friend not found'
            }), 404
        
        # Enrich with birthday data
        enriched = BirthdayService.enrich_friend_data(updated_friend)
        
        return jsonify(enriched), 200
        
    except Exception as e:
        logger.error(f"Error updating friend {friend_id}: {e}")
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'Failed to update friend'
        }), 500


@friends_bp.route('/friends/<friend_id>', methods=['DELETE'])
@require_auth
def delete_friend(friend_id, user_id):
    """
    Delete a friend.
    
    Args:
        friend_id: Friend UUID
    
    Returns:
        204 No Content on success
    """
    try:
        deleted = SupabaseService.delete_friend(friend_id, user_id)
        
        if not deleted:
            return jsonify({
                'error': 'Not Found',
                'message': 'Friend not found'
            }), 404
        
        return '', 204
        
    except Exception as e:
        logger.error(f"Error deleting friend {friend_id}: {e}")
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'Failed to delete friend'
        }), 500


@friends_bp.route('/friends/<friend_id>/suggestions', methods=['POST'])
@require_auth
def get_suggestions(friend_id, user_id):
    """
    Get AI-powered gift or event suggestions for a friend.
    
    Args:
        friend_id: Friend UUID
    
    Request Body:
        suggestion_type (str): 'gifts' or 'events'
    
    Returns:
        JSON response with AI suggestions
    """
    try:
        data = request.get_json()
        
        if not data or 'suggestion_type' not in data:
            return jsonify({
                'error': 'Bad Request',
                'message': 'suggestion_type is required (gifts or events)'
            }), 400
        
        suggestion_type = data['suggestion_type'].lower()
        if suggestion_type not in ['gifts', 'events']:
            return jsonify({
                'error': 'Bad Request',
                'message': 'suggestion_type must be "gifts" or "events"'
            }), 400
        
        # Get friend data
        friend = SupabaseService.get_friend_by_id(friend_id, user_id)
        
        if not friend:
            return jsonify({
                'error': 'Not Found',
                'message': 'Friend not found'
            }), 404
        
        # Enrich with birthday data
        enriched = BirthdayService.enrich_friend_data(friend)
        
        # Generate AI suggestions
        if suggestion_type == 'gifts':
            suggestions = AIService.generate_gift_suggestions(
                enriched['name'],
                enriched['age'],
                enriched.get('notes')
            )
        else:
            suggestions = AIService.generate_event_suggestions(
                enriched['name'],
                enriched['age'],
                enriched.get('notes')
            )
        
        return jsonify({
            'friend_name': enriched['name'],
            'age': enriched['age'],
            'suggestion_type': suggestion_type,
            'suggestions': suggestions,
            'generated_at': datetime.utcnow().isoformat() + 'Z'
        }), 200
        
    except Exception as e:
        logger.error(f"Error generating suggestions for friend {friend_id}: {e}")
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'Failed to generate suggestions'
        }), 500
