import sqlite3
import pandas as pd

# Define the file path
FILE = "./wordlist.txt"

# Define the characters to be used as dictionary keys
characters = "abcdefghijklmnopqrstuvwxyz1234567890"

# Initialize the global dictionary
GLOBAL_DICT = {}

# Correctly initialize the dictionary with empty lists for each character
for char in characters:
    GLOBAL_DICT[char] = []

def addToDic(word):
    """
    Adds a word to the appropriate list in GLOBAL_DICT based on its starting character,
    if the starting character is in the allowed 'characters' set.
    """
    # Ensure the word is not empty after stripping
    if not word:
        return # Skip empty words/lines

    starting_letter = word[0]

    # Check if the starting letter is a valid key in our dictionary
    if starting_letter in GLOBAL_DICT:
        GLOBAL_DICT[starting_letter].append(word)
    # else:
        # Optional: Handle words starting with characters not in the 'characters' string
        # print(f"Skipping word '{word}' starting with invalid character '{starting_letter}'")
        # pass
def processFile(letter):
    PREFIX = "./data/1gram-20120701"
    file = f"{PREFIX}-{letter}"

    for letter in GLOBAL_DICT:
        words = GLOBAL_DICT[letter]


def main():
    """
    Reads words from the specified file, processes them,
    and populates the GLOBAL_DICT.
    """
    try:
        with open(FILE, "r") as f:
            for line in f:
                # Remove leading/trailing whitespace (like newline characters)
                word = line.strip()
                # Add the cleaned word to the dictionary
                addToDic(word)
        # Print the resulting dictionary
        print(GLOBAL_DICT)
    except FileNotFoundError:
        print(f"Error: The file '{FILE}' was not found.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# Standard Python entry point check
if __name__ == "__main__":
    main()
