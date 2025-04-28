import requests
import json
import time
import re
import pandas as pd
from collections import Counter
from bs4 import BeautifulSoup

# API Credentials and Constants
CLIENT_ID = "ykf8HFV0WZgcntVjT7k3YBYmmjR6lnrvGpSVcmHCGZ1M8jTI8fvwbFqKcqo0DOGW"
CLIENT_SECRET = "IYmRXbpNe53_B0x95HCBmN80SSzzN2EmzcZ_BulBc0fhyU5WnOYFzS-ZlT1Omaa3PhlUp62YWK50xxtGvUFX1w"
ACCESS_TOKEN = "FhsfsS7_MK84uG9cADAK_lIOZfsXPPc-xev6bzOx6zmfWuG92PltKevmfl-4YDJp"
BASE_URL = "https://api.genius.com"
ENDPOINT = "songs"

def get_song_lyrics_url(api_path):
    """
    Given the Genius API path for a song, returns the URL with the lyrics.
    """
    if str(api_path) == "-1" or api_path is None:
        return None
    
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
    # Build final URL using the API path; notice the access token here (a different one is used in the URL string)
    final_url = f"{BASE_URL}{api_path}"
    response = requests.get(final_url, headers=headers)
    json_response = response.json()
    # print(json_response)
    if response.ok and json_response["meta"]["status"] == 200:
        return json_response["response"]["song"]["url"]
    return None


def get_song_lyrics(url):
    HEADERS = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://www.google.com/",
    }

    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        print(f"Failed to fetch page: {response.status_code}")
        return None

    soup = BeautifulSoup(response.content, "html.parser")
    container = soup.find("div", attrs={"data-lyrics-container": "true"})
    if container is None:
        print("Lyrics container not found.")
        return None

    # Remove unwanted elements (e.g., headers or any marked for exclusion)
    for unwanted in container.find_all(attrs={"data-exclude-from-selection": "true"}):
        unwanted.decompose()

    # Replace <br> tags with newline characters
    for br in container.find_all("br"):
        br.replace_with("\n")

    # Prefer extracting text from <p> tags if they exist
    p_tags = container.find_all("p")
    if p_tags:
        lyrics = "\n".join(p.get_text(separator="\n", strip=True) for p in p_tags)
    else:
        lyrics = container.get_text(separator="\n", strip=True)

    return lyrics

def get_song_id(query):
    """
    Search Genius for the song and return the API path for the first matching song.
    """
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
    final_url = f"{BASE_URL}/search?q={query}"
    response = requests.get(final_url, headers=headers)
    json_response = response.json()
    
    if json_response["meta"]["status"] != 200:
        return None

    for hit in json_response["response"]["hits"]:
        if hit["type"] == "song":
            return hit["result"]["api_path"]
    return None

def tokenize(text):
    """
    Converts text to lowercase and extracts alphanumeric word tokens.
    """
    if not text:
        return []
    text = text.lower()
    # Use a regular expression to extract words (this strips punctuation)
    tokens = re.findall(r'\b\w+\b', text)
    return tokens

def compute_word_frequencies(lyrics):
    """
    Given a lyrics string, returns a dictionary with word frequencies.
    """
    tokens = tokenize(lyrics)
    return dict(Counter(tokens))

def process_billboard_csv(input_csv=None, output_csv=None):
    """
    Processes the billboard CSV file: for each song, fetches lyrics from Genius,
    computes word frequency counts, and builds a DataFrame where each song is a row
    and each unique word is a column.
    """

    if input_csv is None or output_csv is None: return

    # Read the input billboard CSV file
    df = pd.read_csv(input_csv)
    
    # This will store each processed song's data
    processed_data = []
    total_songs = len(df)
    print(f"Processing {total_songs} songs...")
    
    # Loop over each song in the CSV
    for index, row in df.iterrows():

        try:
            if index % 10 == 0:
                print(f"Processing song {index+1}/{total_songs}...")
            
            # Adjust these indices if your CSV structure changes.
            song_name = row.iloc[1]
            song_artist = row.iloc[2]
            song_url = row.iloc[4]
            
            if ("http" not in song_url) or ("genius" not in song_url):
                print(f"Invalid URL: {song_url}")
                continue
            print(f"Fetching lyrics from: {song_url}")
            song_lyrics = get_song_lyrics(song_url)
            if not song_lyrics:
                print("Lyrics could not be extracted.")
                continue
            
            # Compute frequency of each word in the lyrics
            word_freq = compute_word_frequencies(song_lyrics)
            
            # Combine song metadata with its word frequencies.
            song_data = {
                "song_name": song_name,
                "song_artist": song_artist,
                "genius_url": song_url
            }
            song_data.update(word_freq)
            processed_data.append(song_data)
            
            # Delay to ease the pressure on the API (no sugar-coating: APIs have limits)
            time.sleep(1)
            
            if not processed_data:
                print("No data processed. Exiting.")
                return
            
        except Exception as e:
            print(f"Error processing CSV file: {e}")
            continue
    # Create the final DataFrame from the list of dictionaries.
    final_df = pd.DataFrame(processed_data)
    
    # Identify columns that represent word frequencies (exclude metadata)
    metadata = {"song_name", "song_artist", "genius_url"}
    word_columns = final_df.columns.difference(metadata)
    # Fill any missing word counts with 0 and force integer type
    final_df[word_columns] = final_df[word_columns].fillna(0).astype(int)
    
    # Save the resulting DataFrame to CSV
    final_df.to_csv(output_csv, index=False)
    print(f"Results saved to {output_csv}")
        

def main():
    input_csv="billboard_year_end_2011_2015_url.csv"
    output_csv="./billboard_year_end_2006_2024_word_counts.csv"

    # Optionally test with a single song first
    test_song = "not like us"
    test_api_path = get_song_id(test_song)
    test_song_url = get_song_lyrics_url(test_api_path)
    print("Test song URL:", test_song_url)
    
    # Now process the full billboard dataset
    process_billboard_csv(input_csv=input_csv, output_csv=output_csv)

if __name__ == "__main__":
    main()
