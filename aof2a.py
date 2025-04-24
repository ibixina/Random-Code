with open('aof.txt') as f:
    count = 0
    for line in f:
        if line == "\n":
            continue
        numbers = [int(x) for x in line.split()]
        increasing = True if numbers[0] < numbers[-1] else False
        state = "safe"

        for i in range(1, len(numbers)):
            if increasing and numbers[i] < numbers[i-1]:
                state = "unsafe"
                break
            if not increasing and numbers[i] > numbers[i-1]:
                state = "unsafe"
                break
            if not(1 <= abs(numbers[i] - numbers[i-1]) <=  3):
                state = "unsafe"
                break

        count += 1 if state == "safe" else 0
        print(state, line)
print(count)

