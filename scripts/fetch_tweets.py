import json
import os
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


def create_scraper():
    # First, try the default instance list from ntscraper
    try:
        print("Initializing Nitter scraper with default instance list...")
        scraper = Nitter()
        if getattr(scraper, 'working_instances', None):
            print(f"Default scraper initialized with {len(scraper.working_instances)} working instances.")
            return scraper, None
        print("Default scraper initialized but found no working instances.")
    except Exception as e:
        print(f"Default Nitter instance list failed: {e}")

    # Fallback to a known list of Nitter instances and skip instance health checking
    for fallback in FALLBACK_NITTER_INSTANCES:
        try:
            print(f"Trying fallback instance: {fallback}")
            scraper = Nitter(instances=[fallback], skip_instance_check=True)
            scraper.instance = fallback
            if getattr(scraper, 'working_instances', None):
                print(f"Fallback scraper initialized with instance: {fallback}")
                return scraper, fallback
            print(f"Fallback scraper initialized but no working instances for {fallback}.")
        except Exception as e:
            print(f"Fallback instance {fallback} failed: {e}")

    print("ERROR: No available Nitter instances could be initialized.")
    return None, None

def fetch_tweets():
    print("--- Starting Fetch Script (Nitter - Zero Cookie) ---")
    scraper, instance = create_scraper()
    if scraper is None:
        print("Exiting because no Nitter scraper could be initialized.")
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
        print(f"\n--- Searching Nitter for: '{query}' ---")
        try:
            # Fetch latest tweets from a random Nitter instance or explicit fallback instance
            # mode='term' is for search, number=20 is results limit
            results = scraper.get_tweets(query, mode='term', number=20, instance=instance)
            
            if results and 'tweets' in results:
                print(f"Found {len(results['tweets'])} tweets.")
                for tweet in results['tweets']:
                    # Extract the ID from the link (e.g., /user/status/12345#m)
                    link = tweet.get('link', '')
                    tid = link.split('/')[-1].split('#')[0] if link else str(hash(tweet['text']))
                    
                    if tid not in existing_ids:
                        print(f"Adding new tweet: {tid}")
                        queries.insert(0, {
                            "id": tid,
                            "text": tweet.get('text', ''),
                            "handle": tweet.get('user', {}).get('username', 'anonymous'),
                            "date": tweet.get('date', 'Unknown date'),
                            "category": "Uncategorized"
                        })
                        existing_ids.add(tid)
                        new_tweets_count += 1
            else:
                print("No results found or instance failed.")
        except Exception as e:
            print(f"Nitter Search FAILED: {e}")

    if new_tweets_count > 0:
        # Keep only last 100
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
