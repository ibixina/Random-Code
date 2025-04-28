#!/usr/bin/env python
import sys, requests, json
from bs4 import BeautifulSoup, Comment
args = sys.argv


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

def get_song_id_azlyrics(QUERY):
    url = f"https://search.azlyrics.com/suggest.php?q=${QUERY}&x=ad689641d1ef3174228dc280a01f6d312c33add618229b5b848f7357e0621e4d"
    response = requests.get(url)
    data = json.loads(response.text)
    songs = data["songs"]
    if len(songs) == 0:
        return -1
    return songs[0]["url"]
        

def main():
    QUERY = "luther kendrick lamar"
    song_id = get_song_id_azlyrics(QUERY)
    lyrics = get_song_lyrics_azlyrics(song_id)
    print(song_id)
    print(lyrics)

if __name__=="__main__":
    main()

