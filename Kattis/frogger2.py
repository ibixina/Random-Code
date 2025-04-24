n = int(input())
boards = list(map(int, input().split()))
been = set()
winning_pos = set()
losing_pos = set()

def isWinning(pos, past, m):
    # Debug print to show the path being checked
    if pos in winning_pos:
        return True
    elif pos in losing_pos:
        return False
    # Base cases
    if pos < 0 or pos >= n or pos in been:
        # Mark all positions in the current path as losing positions
        for v in past:
            losing_pos.add(v)
        losing_pos.add(pos)
        return False
    elif boards[pos] == m:
        # Mark all positions in the current path as winning positions
        for v in past:
            winning_pos.add(v)
        winning_pos.add(pos)
        return True 

    # Mark the current position as visited
    been.add(pos)

    # Add the current position to the past path (create a new list to avoid modifying `past`)
    nlist = past + [pos]
    npos = pos + boards[pos]

    # Recur to the next position
    return isWinning(npos, nlist, m)


count = 0
for m in boards:
    winning_pos = set()
    losing_pos = set()
    been = set()
    for s, el in enumerate(boards):
        if s in been:
            count += s in winning_pos
        else:
            count += isWinning(s, [], m)





print(count)
