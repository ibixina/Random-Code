x, y = list(map(int, input().split()))

if x == y and x == 0:
    print("Not a moose")
elif (x == y):
    print(f"Even {x+y}")
else:
    print(f"Odd {max(x,y) *2}")
