import pandas as pd

def main():
    data = pd.read_csv('./song_data_lyrics.csv')

    for i, row in data.iterrows():
        input()
        print(row['lyrics'])

if __name__ == '__main__':
    main()
