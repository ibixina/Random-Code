a, b, c = list(map(int, input().split()))

for op in '+-/*':
    if op == "+":
        res = b + c
        res1 = a + b
    elif op == '-':
        res = b - c
        res1 = a - b
    elif op == '/':
        res = b // c
        res1 = a // b
    else:
        res = b * c
        res1 = a * b
    
    if res == a:
        print(f"{a}={b}{op}{c}")
        break
    elif res1 == c:
        print(f"{a}{op}{b}={c}")
        break
        
