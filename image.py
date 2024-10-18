#!user/bin/env python
import sys
args = sys.argv

def main():
    with open("img.png", "rb") as f:
        line= f.readlines()
        print(line[:3])

if __name__=="__main__":
    main()

