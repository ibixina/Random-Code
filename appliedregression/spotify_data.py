import spotipy
from spotipy.oauth2 import SpotifyOAuth
import pandas as pd

def spotify_init():

    CLIENT_ID = "7a13cdb69a5f4d0e93a302a155e81473"
    CLIENT_SECRET = "4b44513b49424bda82cbfcc25f42835f"
    scope = "user-library-read "
    REDIRECT_URI = "http://localhost:8080/callback"

    sp = spotipy.Spotify(auth_manager=SpotifyOAuth(scope=scope, client_id=CLIENT_ID, client_secret=CLIENT_SECRET, redirect_uri=REDIRECT_URI))

    results = sp.current_user_saved_tracks()
    for idx, item in enumerate(results['items']):
        track = item['track']
        print(idx, track['artists'][0]['name'], " – ", track['name'])



"""
sentiment analysis
popularity
duration
acousticness
danceability
energy
loudness
liveness
valence
tempo
speechiness
artist popularity
"""

def process_tracks():
    sheet = pd.read_csv("./song_data_url.csv");

    for idx, row in sheet.iterrows():
        song_title = row['Title']
        song_rank = row['Rank']


def main():
    process_tracks()

if __name__ == "__main__":
    main()

