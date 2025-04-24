#!user/bin/env python
import sys, random
args = sys.argv

def gamble(sequence, balance):
    """Labouchère betting."""
    # Won
    if len(sequence) < 1:
        print("You won!")
        return balance

    # If the sequence is of length 1, the bet is the number in the sequence.
    # Otherwise, it is the first number added to the last number.
    if len(sequence) == 1:
        bet = sequence[0]
    else:
        bet = sequence[0] + sequence[-1]

    print()
    print("Bet:", bet)
    print()


    # Lost the entire round
    if bet > balance:

        print("You lost!")
        return balance

    won = input("Won? ")
    won = True if won.lower() == "y" else False

    if won:
        return gamble(sequence[1:-1], balance + bet)
    else:
        return gamble(sequence + [bet], balance - bet)

def main():
    sequence = [2, 5, 3, 2, 5, 3]
    balance = 100
    gamble(sequence, balance)
if __name__=="__main__":
    main()


