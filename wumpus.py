r, f = list(map(int, input().split()))

rotation = round(f/r)

print("up" if rotation%2 == 0 else "down")
