import json
import os
import requests
from datetime import datetime
from ntscraper import Nitter

# Search queries for relevant student issues
SEARCH_QUERIES = [
    "CBSE OSM",
    "CBSE vulnerability",
    "CBSE security vulnerability",
    "CBSE evaluation issues",
    "CBSE reevaluation",
    "CBSE reevaulution",
    "student CBSE reevaluation",
    "CBSE result anomaly",
    "CBSE answer sheet scan"
]

JSON_PATH = 'src/queries.json'

FALLBACK_NITTER_INSTANCES = [
    "https://nitter.net",
    "https://nitter.42l.fr",
    "https://nitter.kavin.rocks",
    "https://nitter.eu.org",
    "https://nitter.snopyta.org",
]


def get_x_api_bearer_token():
    return os.environ.get('X_BEARER_TOKEN') or os.environ.get('TWITTER_BEARER_TOKEN')


def fetch_tweets_from_x_api(query):
    bearer_token = get_x_api_bearer_token()
    if not bearer_token:
        return None

    print(f"Using X API for query: {query}")
    endpoint = 'https://api.twitter.com/2/tweets/search/recent'
    params = {
        'query': query,
        'max_results': 20,
        'tweet.fields': 'created_at,author_id',
        'expansions': 'author_id',
        'user.fields': 'username',
    }
    headers = {
        'Authorization': f'Bearer {bearer_token}',
        'User-Agent': 'cbse-accountability-log/1.0',
    }

    response = requests.get(endpoint, headers=headers, params=params, timeout=20)
    if response.status_code != 200:
        print(f"X API request failed: {response.status_code} - {response.text[:500]}")
        return None

    payload = response.json()
    users = {user['id']: user for user in payload.get('includes', {}).get('users', [])}
    tweets = []
    for item in payload.get('data', []):
        user = users.get(item.get('author_id', ''), {})
        tweets.append({
            'id': item['id'],
            'text': item.get('text', ''),
            'handle': user.get('username', 'anonymous'),
            'date': item.get('created_at', ''),
            'category': 'Uncategorized',
        })

    return tweets


def create_scraper():
    try:
        print("Initializing Nitter scraper with default instance list...")
        scraper = Nitter()
        if getattr(scraper, 'working_instances', None):
            print(f"Default scraper initialized with {len(scraper.working_instances)} working instances.")
            return scraper, None
        print("Default scraper initialized but found no working instances.")
    except Exception as e:
        print(f"Default Nitter instance list failed: {e}")

    for fallback in FALLBACK_NITTER_INSTANCES:
        try:
            print(f"Trying fallback instance: {fallback}")
            scraper = Nitter(instances=[fallback], skip_instance_check=True)
            scraper.instance = fallback
            print(f"Fallback scraper initialized with instance: {fallback}")
            return scraper, fallback
        except Exception as e:
            print(f"Fallback instance {fallback} failed: {e}")

    print("ERROR: No available Nitter instances could be initialized.")
    return None, None


def fetch_tweets():
    print("--- Starting Fetch Script ---")
    use_api = get_x_api_bearer_token() is not None
    if use_api:
        print("X API bearer token found. Using official X API.")
    else:
        print("No X API bearer token found. Falling back to Nitter scraping.")

    scraper, instance = (None, None)
    if not use_api:
        scraper, instance = create_scraper()
        if scraper is None:
            print("Exiting because no Nitter scraper could be initialized.")
            return

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
        print(f"\n--- Searching for: '{query}' ---")
        tweets = None

        if use_api:
            tweets = fetch_tweets_from_x_api(query)
            if tweets is None:
                print("X API failed for this query. Falling back to Nitter.")

        if tweets is None:
            try:
                results = scraper.get_tweets(query, mode='term', number=20, instance=instance)
                if results and 'tweets' in results:
                    tweets = [
                        {
                            'id': tweet.get('link', '').split('/')[-1].split('#')[0] if tweet.get('link') else str(hash(tweet.get('text', ''))),
                            'text': tweet.get('text', ''),
                            'handle': tweet.get('user', {}).get('username', 'anonymous'),
                            'date': tweet.get('date', 'Unknown date'),
                            'category': 'Uncategorized',
                        }
                        for tweet in results['tweets']
                    ]
                else:
                    tweets = []
            except Exception as e:
                print(f"Nitter Search FAILED: {e}")
                tweets = []

        if tweets:
            print(f"Found {len(tweets)} tweets.")
            for tweet in tweets:
                tid = str(tweet['id'])
                if tid not in existing_ids:
                    print(f"Adding new tweet: {tid}")
                    queries.insert(0, tweet)
                    existing_ids.add(tid)
                    new_tweets_count += 1
        else:
            print("No tweets found for this query.")

    if new_tweets_count > 0:
        queries = queries[:100]
        try:
            with open(JSON_PATH, 'w', encoding='utf-8') as f:
                json.dump(queries, f, indent=2, ensure_ascii=False)
            print(f"\nSUCCESS: Added {new_tweets_count} new tweets to {JSON_PATH}")
        except Exception as e:
            print(f"Error saving {JSON_PATH}: {e}")
    else:
        print("\nNo new unique tweets found in this run.")

    print("--- Script Finished ---")


if __name__ == "__main__":
    fetch_tweets()
