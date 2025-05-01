import pandas as pd

def onlyAlphaNumeric(s):
    return ''.join(c.lower() for c in s if c.isalnum())

def main():
    words = set()
    file = pd.read_csv("./song_data_lyrics.csv")
    output = "./wordlist.txt"
    processed_words = []

    for _, row in file.iterrows():
        lyrics = row.get("lyrics")
        if isinstance(lyrics, str) and len(lyrics) > 5:
            song_words = [onlyAlphaNumeric(word) for word in lyrics.split() if onlyAlphaNumeric(word)]
            words.update(song_words)
            processed_words.append(' '.join(song_words))
        else:
            processed_words.append("")

    file["lyrics"] = processed_words

    file.to_csv("./song_data_pre_final.csv", index=False)

    with open(output, "w", encoding="utf-8") as f:
        for word in sorted(words):
            f.write(word + "\n")

if __name__ == "__main__":
    main()

