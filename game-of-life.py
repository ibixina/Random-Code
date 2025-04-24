#!user/bin/env python
import sys
import random
import time
args = sys.argv


w =45
h = 45

# fillChar = u"\u2588"

fillChar = "#"
empChar = " "

mutation = 0.01
mutation /= 100

alive_perc = 5
alive_perc /= 100

if (len(args) == 3):
    w = int(args[1])
    h = int(args[2])

def is_alive():
    if (random.random() < alive_perc):
        return True
    return False

def main():
    board = [[fillChar if is_alive() else " " for i in range(w)] for j in range(h)]
    for row in board:
        print("".join(row))
    while True:
        cboard = board.copy()
        for y in range(h):
            for x in range(w):
                current = cboard[y][x]
                no_of_alive = 0
                for dx,dy in [(1,1), (1,0), (0,1), (-1,0), (0,-1), (-1, -1), (-1, 1), (1, -1)]:
                    nx, ny = x+dx, y+dy
                    if (0<=nx<w and 0<=ny<h):
                        if cboard[ny][nx] == fillChar:
                            no_of_alive += 1
                # print(no_of_alive, current)
                if no_of_alive < 2:
                    board[y][x] = " "
                elif no_of_alive > 3:
                    board[y][x] = " "
                elif current == " " and no_of_alive == 3:
                    board[y][x] = fillChar
                elif current == fillChar and no_of_alive in [2,3]:
                    board[y][x] = fillChar
                if (random.random() < mutation):board[y][x] = fillChar
        for i in range(h):
            sys.stdout.write("\033[F")
        for row in board:
            print(" ".join(row))
        # print()
        time.sleep(0.4)
        # input()

    pass

if __name__=="__main__":
    main()

