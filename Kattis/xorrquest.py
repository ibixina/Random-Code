inp = input().split()

firstNum = inp[0]
secondNum = inp[2]
result = inp[-1]

count = 0
def getValue(f, s, r):
    if "?" in f:
        for i in range(10):
            getValue(f.replace('?', str(i), 1), s, r)
    if "?" in r:
        for i in range(10):
            getValue(f, s, r.replace('?', str(i), 1))
    if "?" in s:
        for i in range(10):
            getValue(f, s.replace('?', str(i), 1), r)

