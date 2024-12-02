
list1 = []
list2 = []
count1 = {}
count2 = {}
with open('aof1.txt') as f:
    lines = f.readlines()
    for line in lines:
        if line == '\n' or line == '':
            continue
        el1, el2 = list(map(int, line.split()))
        list1.append(el1)
        list2.append(el2)

        if el1 in count1:
            count1[el1] += 1
        else:
            count1[el1] = 1

        if el2 in count2:
            count2[el2] += 1
        else:
            count2[el2] = 1
su = 0
for el in list1:
    if el in count2:
        su += (count2[el] * el)
print(su)




s = [abs(list1[i] - list2[i]) for i in range(len(list1))]

