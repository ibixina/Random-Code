with open('aof.txt') as f:
    count = 0
    for line in f:
        if line == "\n":
            continue

        numbers = [int(x) for x in line.split()]
        state = "" 
        for increasing in [True, False]:
            print()
            # print(f"Increasing: {increasing}")
            pos1, pos2 = [0,1]
            fails = 0
            
            while pos2 < len(numbers):
                # print(f"Checking {numbers[pos1]} and {numbers[pos2]}")
                temp = pos2
                if increasing and numbers[pos2] < numbers[pos1]:
                    # print("Failed increasing and numbers[pos1] < numbers[pos2]")
                    fails += 1
                    pos1 -= 1
                elif not increasing and numbers[pos1] < numbers[pos2]:
                    # print("Failed decreasing and numbers[pos1] > numbers[pos2]")
                    fails += 1
                    pos1 -= 1
                elif not (1 <= abs(numbers[pos1] - numbers[pos2]) <= 3):
                    # print("Failed abs(numbers[pos1] - numbers[pos2]) <= 3")
                    fails += 1
                    pos1 -= 1
                # print(f"Failed {fails} times")

                if fails > 1:
                    break


                pos2 += 1
                pos1 += 1
            state = "safe" if fails <= 1 else "unsafe"
            if state == "safe":
                count += 1
                break
        print(line, state)

            
print(count)

