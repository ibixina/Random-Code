
#!user/bin/env python
import sys
args = sys.argv

# Input text grid
cleaned_text = """
TULLABWONSYWAK
OLSVSOXVMPTEXM
UAMDOOWPCSICOE
TLTSALAXRPNHOS
OWTNINOMDMUROE
WWAHPLODURMIDU
NTMYOMAMSUMSUT
SNSIOTTSAPOTMN
AEMOMVCALSCMPG
NSOXMASSRNKASA
REDTPMSCDTSTY
ERUMISOKLMRHGB
SPKRSYAWAEVIGM
EUEGOORCSYMVDS
"""

def get_all_possible_words_fixed(grid):
    words = set()
    rows_count = len(grid)
    cols_count = len(grid[0])

    # Horizontal and reverse horizontal
    for row in grid:
        words.add(row)
        words.add(row[::-1])

    # Vertical and reverse vertical
    for col in zip(*grid):
        column = ''.join(col)
        words.add(column)
        words.add(column[::-1])

    # Diagonal (top-left to bottom-right) and reverse diagonal
    for d in range(-rows_count + 1, cols_count):
        diag1 = ''.join(grid[i][i - d] for i in range(max(0, d), min(rows_count, cols_count + d)) if 0 <= i - d < cols_count)
        diag2 = ''.join(grid[i][cols_count - 1 - (i - d)] for i in range(max(0, d), min(rows_count, cols_count + d)) if 0 <= cols_count - 1 - (i - d) < cols_count)
        if diag1:
            words.add(diag1)
            words.add(diag1[::-1])
        if diag2:
            words.add(diag2)
            words.add(diag2[::-1])
    return words

def load_dictionary(filepath="/usr/share/dict/words"):
    # Load English words from a dictionary file
    with open(filepath, "r") as file:
        return set(word.strip().upper() for word in file)

def main():
    # Split the cleaned text into rows
    grid = cleaned_text.strip().split("\n")

    # Get all possible words
    possible_words = get_all_possible_words_fixed(grid)

    # Load dictionary and filter sensible words
    dictionary = load_dictionary()
    sensible_words = sorted(word for word in possible_words if word in dictionary)

    # Print sensible words
    print("Sensible Words Found:")
    for word in sensible_words:
        print(word)

if __name__ == "__main__":
    main()

