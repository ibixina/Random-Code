import spotipy
from spotipy.oauth2 import SpotifyOAuth
import pandas as pd
import time
import sys
import os

def spotify_init():
    """Initialize Spotify API connection and return the Spotify client object"""
    CLIENT_ID = "7a13cdb69a5f4d0e93a302a155e81473"
    CLIENT_SECRET = "4b44513b49424bda82cbfcc25f42835f"
    # Scope for basic metadata access
    scope = "user-library-read user-read-private user-read-email"
    REDIRECT_URI = "http://localhost:8080/callback"

    try:
        sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
            scope=scope, 
            client_id=CLIENT_ID, 
            client_secret=CLIENT_SECRET, 
            redirect_uri=REDIRECT_URI,
            open_browser=True  # Make sure browser opens for auth
        ))
        
        # Test API connection
        sp.current_user()  # This will throw an error if authentication fails
        print("Successfully authenticated with Spotify API")
        return sp
        
    except spotipy.exceptions.SpotifyException as e:
        print(f"Spotify authentication error: {e}")
        print("\nTroubleshooting steps:")
        print("1. Make sure your CLIENT_ID and CLIENT_SECRET are correct")
        print("2. Ensure you have properly set up the redirect URI in your Spotify Developer Dashboard")
        print("3. Try clearing your browser cache or using a different browser for authentication")
        print("4. Check if you need to verify the email associated with your Spotify account")
        raise

def get_track_metadata(sp, track_id):
    """Get metadata for a specific track (not audio features)"""
    try:
        # Get full track info
        track_info = sp.track(track_id)
        
        # Get artist info
        artist_id = track_info['artists'][0]['id']
        artist_info = sp.artist(artist_id)
        
        # Compile all data
        track_data = {
            'title': track_info['name'],
            'artist': track_info['artists'][0]['name'],
            'popularity': track_info['popularity'],
            'duration_ms': track_info['duration_ms'],
            'artist_popularity': artist_info['popularity']
        }
       
        return track_data
        
    except spotipy.exceptions.SpotifyException as e:
        print(f"Spotify API Error: {e}")
        # Return partial data if available
        return {
            'title': sp.track(track_id)['name'] if 'track' not in str(e) else "Unknown",
            'artist': sp.track(track_id)['artists'][0]['name'] if 'track' not in str(e) else "Unknown",
            'popularity': None,
            'duration_ms': None,
            'artist_popularity': None,
        }
    except Exception as e:
        print(f"Error getting track metadata: {e}")
        return None

def search_and_test_track(sp, title, artist):
    """Test function to search for a track and get its metadata"""
    try:
        search_query = f"track:{title} artist:{artist.split(' ')[0]}"
        results = sp.search(q=search_query, type='track', limit=1)
        
        if results['tracks']['items']:
            track = results['tracks']['items'][0]
            print(f"Found: {track['name']} by {track['artists'][0]['name']}")
            print(f"Track ID: {track['id']}")
            
            # Test if we can access basic track info
            try:
                track_info = sp.track(track['id'])
                print("✓ Successfully accessed track information")
            except Exception as e:
                print(f"✗ Error accessing track information: {e}")
           # Test if we can access artist info
            try:
                artist_id = track['artists'][0]['id']
                artist_info = sp.artist(artist_id)
                print("✓ Successfully accessed artist information")
            except Exception as e:
                print(f"✗ Error accessing artist information: {e}")
            
            # Get all metadata with error handling
            track_data = get_track_metadata(sp, track['id'])
            
            if track_data:
                # Print all features for verification
                print("\nTrack Metadata:")
                print(f"Song Title: {track_data['title']}")
                print(f"Artist: {track_data['artist']}")
                print(f"Track Popularity: {track_data['popularity']}")
                print(f"Artist Popularity: {track_data['artist_popularity']}")
                print(f"Duration (ms): {track_data['duration_ms']}")

                return track_data
            else:
                print("Failed to get complete track data")
                return None
        else:
            print(f"No track found for {title} by {artist}")
            return None
            
    except Exception as e:
        print(f"Error during track search and testing: {e}")
        return None

def process_tracks():
    """Process all tracks from CSV file and extract their metadata"""
    try:
        sp = spotify_init()
        
        # First test with Luther by Kendrick Lamar
        print("TESTING WITH 'LUTHER' BY KENDRICK LAMAR:")
        test_result = search_and_test_track(sp, "Luther", "Kendrick Lamar")
        
        if not test_result:
            print("\nTest did not return complete data. Would you like to:")
            print("1. Continue processing with limited data (some fields may be None)")
            print("2. Abort processing")
            choice = input("Enter your choice (1 or 2): ")
            
            if choice != "1":
                print("Processing aborted.")
                return
            
            print("\nContinuing with limited data...")
        else:
            print("\nTest successful! Processing tracks from CSV...")
        
        # Now process tracks from CSV
        try:
            sheet = pd.read_csv("./song_data_url.csv")
            
            # Create a new DataFrame to store all track data
            all_track_data = []
            
            # Display structure of the output data
            print("\nOutput data structure:")
            print("song title, artist, rank, track popularity, artist popularity, duration")
            
            total_tracks = len(sheet)
            for idx, row in sheet.iterrows():
                song_title = row['Title']
                song_rank = row['Rank']
                song_artists = row['Artist']
                
                print(f"Processing {idx+1}/{total_tracks}: {song_title} by {song_artists}")
                
                try:
                    # Search for the track
                    search_query = f"track:{song_title} artist:{song_artists}"
                    results = sp.search(q=search_query, type='track', limit=1)
                    
                    if results['tracks']['items']:
                        track = results['tracks']['items'][0]
                        track_id = track['id']
                        
                        # Get track metadata with error handling
                        track_data = get_track_metadata(sp, track_id)
                        
                        if track_data:
                            # Add rank from the original CSV
                            track_data['rank'] = song_rank
                            all_track_data.append(track_data)
                            print(f"✓ Successfully processed: {song_title}")
                        else:
                            print(f"⚠ Skipping {song_title} - could not get complete data")
                            
                        # Avoid hitting API rate limits
                        time.sleep(2)  # Sleep time to avoid rate limits
                    else:
                        print(f"⚠ No track found for {song_title} by {song_artists}")
                        
                except Exception as e:
                    print(f"⚠ Error processing track {song_title}: {e}")
                    continue
            
            # Create a DataFrame from all collected data
            if all_track_data:
                result_df = pd.DataFrame(all_track_data)
                
                # Reorder columns to have song title first
                columns_order = [col for col in ['title', 'artist', 'rank', 'popularity', 'artist_popularity', 'duration_ms'] if col in result_df.columns]
                
                result_df = result_df[columns_order]
                
                # Save to CSV
                result_df.to_csv("processed_tracks_data.csv", index=False)
                print(f"\nSuccessfully processed {len(result_df)} tracks. Data saved to 'processed_tracks_data.csv'")
            else:
                print("\nNo tracks were successfully processed.")
            
        except Exception as e:
            print(f"Error processing tracks: {e}")
    
    except Exception as auth_error:
        print(f"\nFailed to initialize Spotify API: {auth_error}")
        print("\nAuthentication Troubleshooting:")
        print("1. Check that your CLIENT_ID and CLIENT_SECRET are correct")
        print("2. Verify that your redirect URI (http://localhost:8080/callback) is registered in your Spotify Developer Dashboard")
        print("3. Make sure your Spotify account is active and not restricted")
        print("4. Try clearing your .cache file (usually in your home directory)")
        
        # Check if .cache file exists and give instructions to delete it
        cache_path = os.path.join(os.path.expanduser("~"), ".cache")
        if os.path.exists(cache_path):
            print(f"\nFound .cache file at {cache_path}. You may need to delete this file and retry.")

def main():
    print("Spotify Track Metadata Extraction Tool")
    print("=====================================")
    process_tracks()

if __name__ == "__main__":
    main()
