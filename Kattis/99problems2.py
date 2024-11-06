np, p = list(map(int, input().split()))

problems = list(map(int, input().split()))
problems.sort()


def bsearch(val, type):
    lower = 0
    upper = len(problems) - 1

    if upper < 0:
        return -1
    if upper == 0:
        if (type == 1 and problems[0] > val) or (type == 2 and problems[0] <= val):
            return 0
        return -1

    while lower <= upper:
        mid = (lower + upper) // 2
        val1 = problems[mid]

        if type == 1:
            # Finding the first element greater than val
            if val1 > val:
                if mid == 0 or problems[mid - 1] <= val:
                    return mid
                upper = mid - 1
            else:
                lower = mid + 1
        else:
            # Finding the last element less than or equal to val
            if val1 <= val:
                if mid == len(problems) - 1 or problems[mid + 1] > val:
                    return mid
                lower = mid + 1
            else:
                upper = mid - 1

    return -1

for i in range(p):
    t, v = list(map(int, input().split()))
    
    discarded = bsearch(v, t)
    if discarded != -1:
        print(problems[discarded])
        problems.pop(discarded)
    else:
        print(-1)


