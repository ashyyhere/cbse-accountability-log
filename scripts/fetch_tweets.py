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
    print("--- Starting Fetch Script (v4) ---")
    
    # CRITICAL: User-Agent must be set to look like a real browser
    client = Client(
        'en-US',
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    )
    
    cookies_json = os.getenv('X_COOKIES')
    if cookies_json:
        print("X_COOKIES secret found. Processing...")
        try:
            cookies_data = json.loads(cookies_json)
            # Handle EditThisCookie format (list) or JSON format (dict)
            if isinstance(cookies_data, list):
                print("Converting cookie list to dictionary...")
                cookie_dict = {c['name']: c['value'] for c in cookies_data}
            else:
                cookie_dict = cookies_data
            
            # Save to file for twikit to load
            with open('cookies.json', 'w') as f:
                json.dump(cookie_dict, f)
            
            client.load_cookies('cookies.json')
            print("Cookies loaded into client.")
            
            # CRITICAL: Verify the login status
            try:
                user = await client.user()
                print(f"VERIFIED: Logged in as @{user.screen_name}")
            except Exception as e:
                print(f"WARNING: Session verification failed: {e}")
                print("The cookies might be invalid or X is challenging the session.")
        except Exception as e:
            print(f"ERROR: Could not parse X_COOKIES: {e}")
    else:
        print("ERROR: X_COOKIES secret is missing in GitHub Actions!")
        return

    # Load existing queries
    if os.path.exists(JSON_PATH):
        try:
            with open(JSON_PATH, 'r', encoding='utf-8') as f:
                queries = json.load(f)
            print(f"Loaded {len(queries)} existing queries.")
        except Exception as e:
            print(f"Error reading {JSON_PATH}: {e}")
            queries = []
    else:
        queries = []

    existing_ids = {str(q['id']) for q in queries}
    new_tweets_count = 0

    for query in SEARCH_QUERIES:
        print(f"\n--- Searching: '{query}' ---")
        try:
            # Twikit 2.x search
            tweets = await client.search_tweet(query, 'Latest')
            if tweets:
                print(f"Found {len(tweets)} tweets.")
                for tweet in tweets:
                    tid = str(tweet.id)
                    if tid not in existing_ids:
                        print(f"Adding new tweet: {tid}")
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
                print("No results found for this query.")
        except Exception as e:
            print(f"SEARCH FAILED: {e}")
            if "KEY_BYTE" in str(e) or "ClientTransaction" in str(e):
                print("ADVICE: This is a transaction error. Try updating cookies again.")

    if new_tweets_count > 0:
        # Keep only last 100
        queries = queries[:100]
        try:
            with open(JSON_PATH, 'w', encoding='utf-8') as f:
                json.dump(queries, f, indent=2, ensure_ascii=False)
            print(f"\nSUCCESS: Saved {new_tweets_count} new tweets to {JSON_PATH}")
        except Exception as e:
            print(f"Error saving {JSON_PATH}: {e}")
    else:
        print("\nNo new unique tweets found in this run.")

    print("--- Script Finished ---")

if __name__ == "__main__":
    asyncio.run(fetch_tweets())
