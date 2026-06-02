import asyncio
import json
import os
from twikit import Client
from datetime import datetime

# Search queries for relevant student issues
SEARCH_QUERIES = [
    "CBSE OSM",
    "CBSE evaluation issues",
    "CBSE answer sheet scan",
    "CBSE security vulnerability",
    "CBSE result anomaly"
]

JSON_PATH = 'src/queries.json'

async def fetch_tweets():
    print("Starting fetch script...")
    client = Client('en-US')
    
    # Check for cookies first (most reliable for headless)
    cookies_json = os.getenv('X_COOKIES')
    if cookies_json:
        print("Cookies found in environment. Attempting to load...")
        try:
            # Save to a temp file because twikit expects a file path
            with open('cookies.json', 'w') as f:
                f.write(cookies_json)
            client.load_cookies('cookies.json')
            print("Cookies loaded successfully!")
        except Exception as e:
            print(f"Failed to load cookies: {e}")
            cookies_json = None # Fallback to login
    
    if not cookies_json:
        # Credentials fallback
        username = os.getenv('X_USERNAME')
        email = os.getenv('X_EMAIL')
        password = os.getenv('X_PASSWORD')

        if not all([username, email, password]):
            print("Error: No cookies and no credentials found.")
            return

        try:
            print(f"Attempting login for user: {username}")
            await client.login(
                auth_info_1=username,
                auth_info_2=email,
                password=password
            )
            print("Login successful!")
            # Optional: client.save_cookies('cookies.json') 
        except Exception as e:
            print(f"Login failed critically: {e}")
            print("TIP: Use the Cookie method to bypass this.")
            return

    # Load existing queries
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, 'r', encoding='utf-8') as f:
            queries = json.load(f)
        print(f"Loaded {len(queries)} existing queries from {JSON_PATH}")
    else:
        queries = []
        print(f"No existing JSON found at {JSON_PATH}, starting fresh.")

    existing_ids = {str(q['id']) for q in queries}
    new_tweets_count = 0

    for query in SEARCH_QUERIES:
        print(f"--- Searching for query: '{query}' ---")
        try:
            tweets = await client.search_tweet(query, 'Latest')
            print(f"Found {len(tweets)} total tweets for this query.")
            
            for tweet in tweets:
                tweet_id_str = str(tweet.id)
                if tweet_id_str not in existing_ids:
                    print(f"New tweet found! ID: {tweet_id_str} | User: {tweet.user.screen_name}")
                    new_query = {
                        "id": tweet_id_str,
                        "text": tweet.text,
                        "handle": f"@{tweet.user.screen_name}",
                        "date": str(tweet.created_at),
                        "category": "Uncategorized"
                    }
                    queries.insert(0, new_query)
                    existing_ids.add(tweet_id_str)
                    new_tweets_count += 1
                else:
                    # Skip logging duplicates to avoid log bloat
                    pass
        except Exception as e:
            print(f"Search failed for '{query}': {e}")

    # Keep only the last 100
    queries = queries[:100]

    if new_tweets_count > 0:
        with open(JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(queries, f, indent=2, ensure_ascii=False)
        print(f"SUCCESS: Saved {new_tweets_count} new tweets to {JSON_PATH}")
    else:
        print("No new unique tweets were found in this run.")

    print("Script finished.")

if __name__ == "__main__":
    asyncio.run(fetch_tweets())
