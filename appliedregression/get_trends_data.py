import pandas as pd
import sqlite3
import time
import os
import string
from multiprocessing import Pool, cpu_count, Lock
from pytrends.request import TrendReq

# --- Configuration ---
INPUT_CSV = "./billboard_year_end_2006_2024_word_counts.csv"
DB_FILE = "trends_usage.db"
YEAR_RANGE = list(range(2004, 2026))  # 2004 to 2025
SLEEP_SECONDS = 15  # Between queries
NUM_WORKERS = 1

# --- Multiprocessing lock for DB ---
lock = Lock()

# --- Database Setup ---
def init_db():
    if (os.path.exists(DB_FILE)): return
    
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        columns = ", ".join([f'"{year}" INTEGER DEFAULT 0' for year in YEAR_RANGE])
        cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS word_trends (
                word TEXT PRIMARY KEY,
                {columns}
            )
        ''')
        conn.commit()

# --- English Check ---
def is_english(word):
    return all(c in string.ascii_letters + ' ' for c in word)

# --- Check if word already exists ---
def word_exists(word):
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM word_trends WHERE word = ?", (word,))
        return cursor.fetchone() is not None

# --- Worker Function ---
def process_word(word):
    if not is_english(word):
        print(f"Skipping non-English word: {word}")
        return

    if word_exists(word):
        print(f"Already processed: {word}")
        return

    try:
        pytrends = TrendReq(hl='en-US', tz=360)
        pytrends.build_payload([word], timeframe="2004-01-01 2025-04-27", geo="US")
        data = pytrends.interest_over_time()
        time.sleep(SLEEP_SECONDS)

        if data.empty or word not in data.columns:
            print(f"No data for: {word}")
            return

        data['year'] = data.index.year
        
        yearly_sum = data.groupby('year')[word].sum().reindex(YEAR_RANGE, fill_value=0).tolist()
        # Lock DB write
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            # Create column names with proper formatting
            year_columns = ', '.join([f'`{year}`' for year in YEAR_RANGE])
            placeholders = ', '.join(['?'] * (1 + len(YEAR_RANGE)))
            cursor.execute(f'''
            INSERT OR REPLACE INTO word_trends (word, {year_columns})
            VALUES ({placeholders})
            ''', [word] + yearly_sum)
            conn.commit()

        print(f"Inserted: {word}")

    except Exception as e:
        print(f"Error processing {word}: {e}")
        time.sleep(SLEEP_SECONDS * 2)  # Delay on error

# --- Main ---
def main():
    # Initialize DB
    init_db()

    # Load words
    df = pd.read_csv(INPUT_CSV, header=None, dtype=str)
    words = df.iloc[0, 5:].dropna().unique().tolist()

    

    # Filter English words only
    english_words = [w for w in words if is_english(w)]

    print(f"Starting processing {len(english_words)} words with {NUM_WORKERS} workers...")
    with Pool(processes=NUM_WORKERS) as pool:
        pool.map(process_word, english_words)

    print("All done.")

if __name__ == "__main__":
    main()
