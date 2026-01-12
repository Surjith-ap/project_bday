"""
Test script to debug Supabase authentication.
Run this to see detailed error messages.
"""
import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

print("="*60)
print("SUPABASE AUTHENTICATION TEST")
print("="*60)
print(f"\nSupabase URL: {SUPABASE_URL}")
print(f"API Key (first 30 chars): {SUPABASE_KEY[:30] if SUPABASE_KEY else 'NOT SET'}...")
print(f"API Key length: {len(SUPABASE_KEY) if SUPABASE_KEY else 0}")

# Test 1: Create client
print("\n" + "="*60)
print("TEST 1: Creating Supabase client")
print("="*60)
try:
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✓ Client created successfully")
    print(f"Client type: {type(client)}")
except Exception as e:
    print(f"✗ Failed to create client: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

# Test 2: Test with a sample JWT token
print("\n" + "="*60)
print("TEST 2: Testing get_user() with JWT")
print("="*60)
print("\nTo test with a real token:")
print("1. Open browser console at http://localhost:5173")
print("2. Run: supabase.auth.getSession().then(s => console.log(s.data.session.access_token))")
print("3. Copy the token and paste it below when prompted")

token = input("\nPaste your JWT token (or press Enter to skip): ").strip()

if token:
    print(f"\nToken (first 30 chars): {token[:30]}...")
    print(f"Token length: {len(token)}")
    
    try:
        print("\nCalling client.auth.get_user(jwt=token)...")
        response = client.auth.get_user(jwt=token)
        print(f"✓ get_user() succeeded")
        print(f"Response type: {type(response)}")
        print(f"Response: {response}")
        
        if hasattr(response, 'user') and response.user:
            print(f"\n✓ User found!")
            print(f"User ID: {response.user.id}")
            print(f"User email: {response.user.email if hasattr(response.user, 'email') else 'N/A'}")
        else:
            print("\n✗ No user in response")
            
    except Exception as e:
        print(f"\n✗ get_user() failed: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
else:
    print("\nSkipping token test")

print("\n" + "="*60)
print("TEST COMPLETE")
print("="*60)
