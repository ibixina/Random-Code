#!user/bin/env python
import random

N = 100000
perc = 0.5

def win(perc):
    if random.random() < perc:
        return True
    else:
        return False


def gamble(sequence, balance):
    """Labouchère betting."""
    # Won
    if len(sequence) < 1:
        return balance

    # If the sequence is of length 1, the bet is the number in the sequence.
    # Otherwise, it is the first number added to the last number.
    if len(sequence) == 1:
        bet = sequence[0]
    else:
        bet = sequence[0] + sequence[-1]


    # Lost the entire round
    if bet > balance:

        return balance

    won = win(perc)

    if won:
        return gamble(sequence[1:-1], balance + bet)
    else:
        return gamble(sequence + [bet], balance - bet)


if __name__ == "__main__":
    line1 = [5, 10, 10, 10, 10, 5]
    line2 = [5, 5, 10, 10, 10, 5, 5]
    line3 = [10, 10, 10, 10, 10]
    line4 = [5, 5, 10, 5, 5, 10, 5, 5]
    line5 = [2] * 25
    line6 = [5] *10 

    lines = [line1, line2, line3, line4, line5, line6]


    final = [0] * len(lines)
    starting_balance = 1000

    for i in range(N):
        for index, line in enumerate(lines):
            result = gamble(line, starting_balance)
            final[index] += result

    avg = [i/N for i in final]
    print(avg)

    
