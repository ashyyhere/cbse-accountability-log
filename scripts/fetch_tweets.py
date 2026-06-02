import asyncio
import json
import os
import random
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
    print("--- Starting Fetch Script (v5 - Hardened) ---")
    
    # Using a slightly older, more stable User-Agent
    client = Client(
        'en-US',
        user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    )
    
    cookies_json = os.getenv('X_COOKIES')
    if cookies_json:
        print("X_COOKIES found. Loading...")
        try:
            cookies_data = json.loads(cookies_json)
            if isinstance(cookies_data, list):
                cookie_dict = {c['name']: c['value'] for c in cookies_data}
            else:
                cookie_dict = cookies_data
            
            with open('cookies.json', 'w') as f:
                json.dump(cookie_dict, f)
            client.load_cookies('cookies.json')
            print("Cookies loaded.")
            
            # Try to initialize session tokens before searching
            print("Refreshing session tokens...")
            try:
                # This helps initialize the 'KEY_BYTE' and transaction keys
                await client.get_guest_token()
                print("Session tokens initialized.")
            except Exception as e:
                print(f"Note: Guest token refresh returned: {e}")

        except Exception as e:
            print(f"ERROR: Cookie processing failed: {e}")
    else:
        print("ERROR: X_COOKIES is missing.")
        return

    # Load existing queries
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, 'r', encoding='utf-8') as f:
            queries = json.load(f)
        print(f"Loaded {len(queries)} existing queries.")
    else:
        queries = []

    existing_ids = {str(q['id']) for q in queries}
    new_tweets_count = 0

    for query in SEARCH_QUERIES:
        print(f"\n--- Searching: '{query}' ---")
        # Add a random delay to look more human
        await asyncio.sleep(random.uniform(2, 5))
        
        try:
            # Attempt search with a fallback retry
            tweets = None
            for attempt in range(2):
                try:
                    tweets = await client.search_tweet(query, 'Latest')
                    if tweets is not None: break
                except Exception as e:
                    print(f"Attempt {attempt+1} failed: {e}")
                    await asyncio.sleep(5)
            
            if tweets:
                print(f"Found {len(tweets)} tweets.")
                for tweet in tweets:
                    tid = str(tweet.id)
                    if tid not in existing_ids:
                        print(f"New: {tid}")
                        queries.insert(0, {
                            "id": tid,
                            "text": tweet.text,
                            "handle": f"@{tweet.user.screen_name}",
                            "date": str(tweet.created_at),
                            "category": "Uncategorized"
                        })
                        existing_ids.add(tid)
                        new_tweets_count += 1
            else:
                print("No results.")
        except Exception as e:
            print(f"CRITICAL SEARCH FAILURE: {e}")

    if new_tweets_count > 0:
        queries = queries[:100]
        with open(JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(queries, f, indent=2, ensure_ascii=False)
        print(f"\nSUCCESS: Added {new_tweets_count} new tweets.")
    else:
        print("\nNo new tweets found.")

    print("--- Script Finished ---")

if __name__ == "__main__":
    asyncio.run(fetch_tweets())
