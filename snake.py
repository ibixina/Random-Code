#!user/bin/env python
import random
import time
import sys
args = sys.argv


board = [[" " for _ in range(20)] for _ in range(20)]
chr = "<"
snake = [(1,10), (1,9), (1,8), (1,7)]
UP, LEFT, RIGHT, DOWN = [(-1,0), (0,-1), (0,1), (1,0)]

def clear_last_n_lines(n):
    for _ in range(n):
        # Move the cursor up one line
        sys.stdout.write('\033[F')  # Move cursor up
        # Clear the current line
        sys.stdout.write('\033[K')  # Clear the line

def print_board():
    clear_last_n_lines(20)
    for row in range (len(board)):
        for column in range(len(board[0])):
            if ((row, column) in snake):
                if ((row,column) == snake[0]):
                    print(chr, end="")
                else:
                    print("#", end="")
            else:
                print(board[row][column], end="")
        print()

def add(x,y):
    a,b = x
    p,q = y

    return (a+p, b+q)

def add_goals(n):
    for _ in range(n):
        x, y = random.randint(0, len(board[0]) - 1), random.randint(0,len(board) - 1) 
        board[y][x] = 'O'

def main():
    global snake
    global chr

    add_goals(7)

    while True:
        print_board()
        
        inps = input("Next Move: ")
        clear_last_n_lines(1)
        for inp in inps:

            current_head = snake[0]
            next_head = current_head;
            if (inp == "a"):
                chr = ">"
                next_head = add(current_head, LEFT)
            if (inp == "d"):
                chr = "<"
                next_head = add(current_head, RIGHT)
            if (inp == "w"):
                chr = "v"
                next_head = add(current_head, UP)
            if (inp == "s"):
                chr = "^"
                next_head = add(current_head, DOWN)

            row, column = next_head
            if (board[row][column] == 'O'):
                snake += [()]
                board[row][column] = ' '
            snake = [next_head] + snake[:-1]
            print_board()
            time.sleep(0.3)

if __name__=="__main__":
    main()


