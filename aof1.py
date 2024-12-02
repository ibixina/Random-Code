
list1 = []
list2 = []
with open('aof1.txt') as f:
    lines = f.readlines()
    for line in lines:
        if line == '\n' or line == '':
            continue
        el1, el2 = list(map(int, line.split()))
        list1.append(el1)
        list2.append(el2)

list1.sort()
list2.sort()

print(list1)
print(list2)


s = [abs(list1[i] - list2[i]) for i in range(len(list1))]
print(s)
print(sum(s))

