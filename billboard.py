
import requests, json
import pandas as pd
import time
from bs4 import BeautifulSoup

CLIENT_ID = "ykf8HFV0WZgcntVjT7k3YBYmmjR6lnrvGpSVcmHCGZ1M8jTI8fvwbFqKcqo0DOGW"
CLIENT_SECRET = "IYmRXbpNe53_B0x95HCBmN80SSzzN2EmzcZ_BulBc0fhyU5WnOYFzS-ZlT1Omaa3PhlUp62YWK50xxtGvUFX1w"
ACCESS_TOKEN = "FhsfsS7_MK84uG9cADAK_lIOZfsXPPc-xev6bzOx6zmfWuG92PltKevmfl-4YDJp"

URL = "https://api.genius.com"
ENDPOINT = "songs"

# song_data = pd.read_csv("./billboard")

def get_song_lyrics_url(api_path):
    if str(api_path) == "-1":
        return "##"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}"
    }
    song_id = "378195"
    # final_url = f"{URL}/{ENDPOINT}/{song_id}"
    final_url = f"https://api.genius.com{api_path}?access_token=aO3jzDtVBMgriNSJE4WOHKDFspeQdpl39QBckZUVMZ2Q8Eh68bBM7vPAhDMwmVMz"
    # print(final_url)
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

    return "\n".join(lyrics)# Example usage:

def get_song_id(QUERY):
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}"
    }
    song_id = "378195"
    # final_url = f"{URL}/{ENDPOINT}/{song_id}"
    final_url = f"https://api.genius.com/search?access_token=aO3jzDtVBMgriNSJE4WOHKDFspeQdpl39QBckZUVMZ2Q8Eh68bBM7vPAhDMwmVMz&q={QUERY}"
    # print(final_url)
    response = requests.get(final_url, headers)
    json_response = response.json()
    if json_response["meta"]["status"] != 200:
        return -1

    for hit in json_response["response"]["hits"]:
        if hit["type"] != "song":
            continue
        return hit["result"]["api_path"]
    return -1

def process_billboard_csv():
    """Process the Billboard CSV file and generate a new CSV with URLs"""
    try:
        # Read the CSV file
        df = pd.read_csv("./billboard.csv")
        
        # Add a new column for URLs
        df['genius_url'] = None
        
        # Track progress
        total_songs = len(df)
        print(f"Processing {total_songs} songs...")
        
        # Process each row
        for index, row in df.iterrows():
            if index % 10 == 0:
                print(f"Processing song {index+1}/{total_songs}...")
                
            # Get the song name from the second column (index 1)
            song_name = row.iloc[1]
            song_artist = row.iloc[2]
            song_query = song_name + " " + song_artist
            print(song_query)
            
            
            # Search for the song
            song_path = get_song_id(song_query)
            print(song_path)
            
            # If found, get the URL
            if song_path:
                song_url = get_song_lyrics_url(song_path)
                if song_url == "##": continue
                song_lyrics = get_song_lyrics(song_url)
                df.at[index, 'genius_url'] = song_url
                df.at[index, 'lyrics'] = song_lyrics
            
            # Add a small delay to avoid hitting rate limits
            time.sleep(0.5)
        
        # Save the results to a new CSV
        df.to_csv("./billboard_year_end_2006_2024_url_lyrics.csv", index=False)
        print(f"Results saved to billboard_2000_url.csv")
        
    except Exception as e:
        print(f"Error processing CSV file: {e}")

def main():
    song = "not like us"
    song_path = get_song_id(song)
    song_url = get_song_lyrics_url(song_path)
    print(song_url)
    process_billboard_csv()

main()

