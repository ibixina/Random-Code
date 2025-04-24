
seq = input()

no_of_wins_a = 0
no_of_wins_b = 0

valid = []

for i in range(len(seq)):
    no_of_wins_a += 1 if seq[i] == 'A' else 0  

    no_of_wins_b += 1 if seq[i] == 'B' else 0  
    if no_of_wins_a > no_of_wins_b and no_of_wins_a != 1 :
        if str(no_of_wins_a) not in valid:
            valid += [str( no_of_wins_a )]

print(len(valid))
print(" ".join(valid))
