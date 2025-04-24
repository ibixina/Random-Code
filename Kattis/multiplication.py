while True:
    num1, num2 = input().split()
    if num1 == num2 and num1 == "0":
        break
    product = int(num1) * int( num2 )
    product = list(str(product))
    
    toaddSym = " "
    if len(product) < (len(num1) + len(num2)):
        diff = len(num1) + len(num2) - len(product)
        toadd = [" "] * diff
        product = toadd + product


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

    print(secondLine)
    row_no = 0
    for row in mult_array:
        toPrint1 = f"|{toaddSym}|"
        toPrint2 = f"|{product[row_no]}|"
        if (product[row_no] != " "): 
            toaddSym = "/"
        for x,y in row:
            toPrint1 += f"{x} /|"
            toPrint2 += f"/ {y}|"
        toPrint1 += " |"
        toPrint2 += " |"

        print(toPrint1)
        print(f'| {"| / "*len(num1)}|{num2[row_no]}|')
        print(toPrint2)
        row_no += 1
        print(secondLine)

    rem_prod = product[row_no:]
    rem_prod = " / ".join(rem_prod)
    print(f"|{toaddSym} " + rem_prod +'    |' )
    print(openingline)

