"""
Supabase service module.
Provides a wrapper around the Supabase client for database operations.
"""
from supabase import create_client, Client
from flask import current_app
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)


class SupabaseService:
    """Service for interacting with Supabase database."""
    
    _client: Optional[Client] = None
    
    @classmethod
    def get_client(cls) -> Client:
        """
        Get or create Supabase client instance.
        
        Returns:
            Supabase client instance
        """
        if cls._client is None:
            url = current_app.config['SUPABASE_URL']
            key = current_app.config['SUPABASE_KEY']
            cls._client = create_client(url, key)
        return cls._client
    
    @classmethod
    def get_friends(cls, user_id: str, filters: Optional[Dict] = None) -> List[Dict]:
        """
        Get all friends for a user with optional filters.
        
        Args:
            user_id: User ID from Supabase auth
            filters: Optional filters (upcoming, reminders)
            
        Returns:
            List of friend dictionaries
        """
        try:
            client = cls.get_client()
            query = client.table('friends').select('*').eq('user_id', user_id)
            
            response = query.execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching friends: {e}")
            raise
    
    @classmethod
    def get_friend_by_id(cls, friend_id: str, user_id: str) -> Optional[Dict]:
        """
        Get a single friend by ID.
        
        Args:
            friend_id: Friend ID
            user_id: User ID (for authorization check)
            
        Returns:
            Friend dictionary or None if not found
        """
        try:
            client = cls.get_client()
            response = client.table('friends').select('*').eq('id', friend_id).eq('user_id', user_id).execute()
            
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error fetching friend {friend_id}: {e}")
            raise
    
    @classmethod
    def create_friend(cls, user_id: str, friend_data: Dict) -> Dict:
        """
        Create a new friend record.
        
        Args:
            user_id: User ID from Supabase auth
            friend_data: Friend data (name, date_of_birth, notes)
            
        Returns:
            Created friend dictionary
        """
        try:
            client = cls.get_client()
            
            # Add user_id to friend data
            data_to_insert = {
                'user_id': user_id,
                **friend_data
            }
            
            response = client.table('friends').insert(data_to_insert).execute()
            return response.data[0]
        except Exception as e:
            logger.error(f"Error creating friend: {e}")
            raise
    
    @classmethod
    def update_friend(cls, friend_id: str, user_id: str, friend_data: Dict) -> Optional[Dict]:
        """
        Update an existing friend record.
        
        Args:
            friend_id: Friend ID
            user_id: User ID (for authorization check)
            friend_data: Updated friend data
            
        Returns:
            Updated friend dictionary or None if not found
        """
        try:
            client = cls.get_client()
            
            response = client.table('friends').update(friend_data).eq('id', friend_id).eq('user_id', user_id).execute()
            
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error updating friend {friend_id}: {e}")
            raise
    
    @classmethod
    def delete_friend(cls, friend_id: str, user_id: str) -> bool:
        """
        Delete a friend record.
        
        Args:
            friend_id: Friend ID
            user_id: User ID (for authorization check)
            
        Returns:
            True if deleted, False if not found
        """
        try:
            client = cls.get_client()
            
            response = client.table('friends').delete().eq('id', friend_id).eq('user_id', user_id).execute()
            
            return len(response.data) > 0
        except Exception as e:
            logger.error(f"Error deleting friend {friend_id}: {e}")
            raise
