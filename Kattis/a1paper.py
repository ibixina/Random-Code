smallest = int(input())

papers = list(map(int, input().split()))



def get_length(n):
    if n == 2:
        return 2**(-3/4)
    if n == 3:
        return 2**(-5/4)
    return 1/2 * get_length(n-2)

area = 0
tape = 0


for i in range (2, smallest):
    curr_area = 2 ** (1 - i)
    curr_ammount = papers[i]

    if curr_area * curr_ammount + area < 1:
        tape += get_length(i)
        area += curr_area * curr_ammount
    else:
        tape += get_length(i)
        break

print(tape)
