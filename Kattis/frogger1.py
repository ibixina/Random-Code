n, s, m = list(map(int, input().split()))
boards = list(map(int, input().split()))
s -= 1
count = 0
fate = ''
been = set()
while True:
    if s < 0:
        fate = "left"
        break
    elif s >= n:
        fate = 'right'
        break
    elif boards[s] == m:
        fate = 'magic'
        break
    elif s in been:
        fate = "cycle"
        break

    been.add(s)
    s += boards[s]
    count += 1

print(fate)
print(count)

