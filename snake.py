#!user/bin/env python
import sys
args = sys.argv


board = [[" " for _ in range(20)] for _ in range(20)]

snake = [(1,10), (1,9), (1,8), (1,7)]

def print_board():
    for row in range (len(board)):
        for column in range(len(board[0])):
            if ((row, column) in snake):
                print("#", end="")
            else:
                print(" ", end="")
        print()
def add(x,y):
    a,b = x
    p,q = y

    return (a+p, b+q)
def main():
    global snake
    while True:
        print_board()
        
        inp = input("Next Move: ")
        current_head = snake[0]
        next_head = current_head;
        if (inp == "a"):
            next_head = add(current_head, (0,-1))
        if (inp == "d"):
            next_head = add(current_head, (0, 1))
        if (inp == "w"):
            next_head = add(current_head, (-1, 0))
        if (inp == "s"):
            next_head = add(current_head, (1, 0))

        snake = [next_head] + snake[:-1]

if __name__=="__main__":
    main()


