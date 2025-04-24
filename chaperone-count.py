n, k = map(int, input().split())
c = 0
prev = ''
for i in range(1, n+1):
    prev += str(i)
    prev = str(int(prev)%1000000)
    if int(prev)%k == 0:
        c += 1

    print(prev)
print(c)
