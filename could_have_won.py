line = input()

n = 2001

a_current = n * [0]
b_current = n * [0]
a_overall = n * [0]
b_overall = n * [0]

for char in line:
    if char == 'A':
        for k in range(n):
            a_current[k] += 1

            if a_current[k] == k:
                a_current[k] = 0
                b_current[k] = 0
                a_overall[k] += 1

    else:
        for k in range(n):
            b_current[k] += 1

            if b_current[k] == k:
                a_current[k] = 0
                b_current[k] = 0
                b_overall[k] += 1

print(a_overall)
print(b_overall)
answers = []

for k in range(n):
    if a_overall[k] > b_overall[k]:
        answers.append(str(k))

print(len(answers))
print(" ".join(answers))
