num1 = input()
num2 = input()

product = int(num1) * int( num2 )
product = list(str(product))

num1  =list(map(int, list(num1)))
num2  =list(map(int, list(num2)))

mult_array = []

for row in range(len(num2)):
    val = []
    for col in range(len(num1)):
        prod = num1[col] * num2[row]
        if prod < 10:
            prod = (0, prod)
        else:
            prod = (prod // 10, prod % 10)
        val += [prod]
    mult_array += [val]


openingline = '+-' + '-' * 4 * len(num1)  +'--+'
secondLine = '| '+ '+---' * len(num1) + '+ |' 
print(openingline)
print("|   ", end="")
for num in num1:
    print(f"{num}   ", end = "")
print("|")
for row in mult_array:
    toPrint = ""
    for nth in [0,1]:
        pass

