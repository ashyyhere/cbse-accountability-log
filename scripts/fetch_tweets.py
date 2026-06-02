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
    # Credentials from environment variables (to be set in GitHub Secrets)
    username = os.getenv('X_USERNAME')
    email = os.getenv('X_EMAIL')
    password = os.getenv('X_PASSWORD')

    if not all([username, email, password]):
        print("Error: X credentials not found in environment variables.")
        return

    client = Client('en-US')
    
    # Login and save/load cookies would be better for long-term, 
    # but for a simple script, login works.
    try:
        await client.login(
            auth_info_1=username,
            auth_info_2=email,
            password=password
        )
    except Exception as e:
        print(f"Login failed: {e}")
        return

    # Load existing queries
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, 'r', encoding='utf-8') as f:
            queries = json.load(f)
    else:
        queries = []

    existing_ids = {q['id'] for q in queries}
    new_tweets_count = 0

    for query in SEARCH_QUERIES:
        print(f"Searching for: {query}")
        try:
            # Get latest tweets
            tweets = await client.search_tweet(query, 'Latest')
            
            for tweet in tweets:
                if str(tweet.id) not in existing_ids:
                    # Basic data extraction
                    new_query = {
                        "id": str(tweet.id),
                        "text": tweet.text,
                        "handle": f"@{tweet.user.screen_name}",
                        "date": tweet.created_at, # Twikit returns a string or datetime depending on version
                        "category": "Uncategorized" # To be processed by LLM later
                    }
                    queries.insert(0, new_query) # Add to top
                    existing_ids.add(str(tweet.id))
                    new_tweets_count += 1
        except Exception as e:
            print(f"Search failed for '{query}': {e}")

    # Keep only the last 100 queries to keep the file size manageable
    queries = queries[:100]

    # Save updated queries
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(queries, f, indent=2, ensure_ascii=False)

    print(f"Done! Added {new_tweets_count} new tweets.")

if __name__ == "__main__":
    asyncio.run(fetch_tweets())
