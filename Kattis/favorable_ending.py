n = int(input())

been = {}
links = {}

def is_favorable(n):
    if n in been:
        return been[n]

for i in range(n):
    tests = int(input())
    inp = input().split()
    
    favorable_endings = 0
    if len(inp) == 2:
        been[inp[0]] = 1 if been[inp[1]] == "favourably" else 0
    else:
        links[inp[0]] = inp[1:]
    print(favorable_endings)

