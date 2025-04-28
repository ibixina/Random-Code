import requests, json
import pandas as pd
import time
from bs4 import BeautifulSoup, Comment
import os

CLIENT_ID = "ykf8HFV0WZgcntVjT7k3YBYmmjR6lnrvGpSVcmHCGZ1M8jTI8fvwbFqKcqo0DOGW"
CLIENT_SECRET = "IYmRXbpNe53_B0x95HCBmN80SSzzN2EmzcZ_BulBc0fhyU5WnOYFzS-ZlT1Omaa3PhlUp62YWK50xxtGvUFX1w"
ACCESS_TOKEN = "FhsfsS7_MK84uG9cADAK_lIOZfsXPPc-xev6bzOx6zmfWuG92PltKevmfl-4YDJp"

URL = "https://api.genius.com"
ENDPOINT = "songs"
OUTPUT_FILE = "./song_data_lyrics.csv"
CHECKPOINT_FILE = "./processing_checkpoint.json"

def sanitize(text):
    # Replace newlines and carriage returns with spaces
    text = text.replace("\n", " ").replace("\r", " ")
    # Escape double quotes by doubling them
    text = text.replace('"', '""')
    # If the text contains commas, quotes, or other special characters,
    # wrap the entire text in double quotes
    if any(char in text for char in [',', '"', ';']):
        text = f'"{text}"'
    return text

def get_song_lyrics_url(api_path):
    if str(api_path) == "-1":
        return "##"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}"
    }
    song_id = "378195"
    final_url = f"https://api.genius.com{api_path}?access_token=aO3jzDtVBMgriNSJE4WOHKDFspeQdpl39QBckZUVMZ2Q8Eh68bBM7vPAhDMwmVMz"
    response = requests.get(final_url, headers)
    json_response = response.json()
    if (response and json_response["meta"]["status"] == 200):
        return json_response["response"]["song"]["url"]
    return -1


def get_song_lyrics(url):
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://www.google.com/",
    }
    
    response = requests.get(url, headers=HEADERS)
    
    if response.status_code != 200:
        print(f"Failed to fetch page: {response.status_code}")
        return None

    soup = BeautifulSoup(response.content, "html.parser")
    lyrics_containers = soup.find_all("div", attrs={"data-lyrics-container": "true"})

    if not lyrics_containers:
        print("Lyrics not found.")
        return None

    exclude = ["[Verse", "[Chorus", "[Bridge", "[Outro", "[Intro", "[Pre-Chorus", "[Pre-Verse", "[Post"]
    lyrics = []
    
    for container in lyrics_containers:
        for line in container.get_text(separator="\n", strip=True).split("\n"):
            if not line:
                continue
            if not any(line.startswith(tag) for tag in exclude):
                lyrics.append(line)

    return "\n".join(lyrics)


def get_song_lyrics_azlyrics(url):
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://www.google.com/",
    }
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        # Find all comments in the page
        comments = soup.find_all(string=lambda text: isinstance(text, Comment))
        # Look for the specific licensing comment
        for comment in comments:
            if "Usage of azlyrics.com content" in comment:
                # The comment's parent should be the div containing lyrics
                lyrics_div = comment.parent
                if lyrics_div:
                    # Remove the comment itself from processing
                    comment.extract()
                    # Get the text, preserving line breaks
                    lyrics = lyrics_div.get_text(separator="\n", strip=True)
                    return lyrics
        return None
    except (requests.RequestException, Exception) as e:
        print(f"Error fetching lyrics: {e}")
        return None


def get_song_id(QUERY):
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}"
    }
    final_url = f"https://api.genius.com/search?access_token=aO3jzDtVBMgriNSJE4WOHKDFspeQdpl39QBckZUVMZ2Q8Eh68bBM7vPAhDMwmVMz&q={QUERY}"
    response = requests.get(final_url, headers)
    json_response = response.json()
    if json_response["meta"]["status"] != 200:
        return -1

    for hit in json_response["response"]["hits"]:
        if hit["type"] != "song":
            continue
        return hit["result"]["api_path"]
    return -1


def get_song_id_azlyrics(QUERY):
    url = f"https://search.azlyrics.com/suggest.php?q=${QUERY}&x=ad689641d1ef3174228dc280a01f6d312c33add618229b5b848f7357e0621e4d"
    response = requests.get(url)
    data = json.loads(response.text)
    songs = data["songs"]
    if len(songs) == 0:
        return -1
    return songs[0]["url"]


def save_checkpoint(index):
    """Save the current processing index to a checkpoint file"""
    checkpoint_data = {"last_processed_index": index}
    with open(CHECKPOINT_FILE, 'w') as f:
        json.dump(checkpoint_data, f)
    print(f"Checkpoint saved at index {index}")


def load_checkpoint():
    """Load the last processed index from the checkpoint file"""
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, 'r') as f:
            checkpoint_data = json.load(f)
            last_index = checkpoint_data.get("last_processed_index", -1)
            print(f"Resuming from index {last_index + 1}")
            return last_index + 1
    return 0


def process_billboard_csv():
    """Process the Billboard CSV file and generate a new CSV with URLs"""
    try:
        # Read the CSV file
        df = pd.read_csv("./song_data.csv")
        
        # Check if output file exists and load it to continue
        if os.path.exists(OUTPUT_FILE):
            existing_df = pd.read_csv(OUTPUT_FILE)
            # If columns match, use the existing file
            if set(existing_df.columns) == set(df.columns) or set(existing_df.columns) == set(list(df.columns) + ['url', 'lyrics']):
                df = existing_df
                print(f"Loaded existing output file with {len(df)} records")
            else:
                # Add new columns if they don't exist
                if 'url' not in df.columns:
                    df['url'] = None
                if 'lyrics' not in df.columns:
                    df['lyrics'] = None
        else:
            # Add new columns if starting fresh
            if 'url' not in df.columns:
                df['url'] = None
            if 'lyrics' not in df.columns:
                df['lyrics'] = None
        
        # Get the starting index from checkpoint
        start_index = load_checkpoint()
        
        # Track progress
        total_songs = len(df)
        print(f"Processing {total_songs - start_index} remaining songs...")
        
        # Process each row starting from the checkpoint
        for index, row in df.iloc[start_index:].iterrows():
            try:
                if index % 10 == 0:
                    print(f"Processing song {index+1}/{total_songs}...")
                
                # Skip if already processed
                if pd.notna(df.at[index, 'url']) and pd.notna(df.at[index, 'lyrics']):
                    print(f"Skipping already processed song at index {index}")
                    continue
                
                # Get the song name from the second column (index 1) and artist from third column (index 2)
                song_name = row.iloc[1]
                song_artist = row.iloc[2]
                song_query = song_name + " " + song_artist.split(" ")[0]
                print(song_query)
                
                song_url = get_song_id_azlyrics(song_query)
                print(song_url)
                if song_url == -1:
                    print("No song found for this song", song_query)
                    # Save checkpoint and progress even for skipped songs
                    save_checkpoint(index)
                    df.to_csv(OUTPUT_FILE, index=False)
                    continue

                # If found, get the URL and lyrics
                if song_url:
                    song_lyrics = get_song_lyrics_azlyrics(song_url)
                    print(song_lyrics[:20] if song_lyrics else "No lyrics found")
                    song_lyrics = sanitize(song_lyrics) if song_lyrics else ""
                    df.at[index, 'url'] = song_url
                    df.at[index, 'lyrics'] = song_lyrics
                
                # Save checkpoint after processing each song
                save_checkpoint(index)
                
                # Periodically save data (every 10 songs)
                if index % 10 == 0:
                    df.to_csv(OUTPUT_FILE, index=False)
                    print(f"Progress saved to {OUTPUT_FILE}")
                
                # Add a small delay to avoid hitting rate limits
                time.sleep(10)
                
            except Exception as e:
                print(f"Error processing song at index {index}: {e}")
                # Save progress and checkpoint before exiting due to error
                save_checkpoint(index)
                df.to_csv(OUTPUT_FILE, index=False)
                print(f"Progress saved to {OUTPUT_FILE}")
                print("Exiting due to error...")
                return
        
        # Save the final results
        df.to_csv(OUTPUT_FILE, index=False)
        print(f"All songs processed. Results saved to {OUTPUT_FILE}")
        
        # Remove checkpoint file upon successful completion
        if os.path.exists(CHECKPOINT_FILE):
            os.remove(CHECKPOINT_FILE)
            print("Processing completed successfully. Checkpoint file removed.")
        
    except Exception as e:
        print(f"Error processing CSV file: {e}")
        # Make sure to save progress even on general errors
        if 'df' in locals() and 'index' in locals():
            df.to_csv(OUTPUT_FILE, index=False)
            save_checkpoint(index)
            print(f"Progress saved to {OUTPUT_FILE} before exiting")


def main():
    # Example of individual song lookup
    # song = "not like us"
    # song_path = get_song_id(song)
    # song_url = get_song_lyrics_url(song_path)
    # print(song_url)
    
    # Process the full dataset with error handling and resumption
    process_billboard_csv()


if __name__ == "__main__":
    main()
