def crt(a, n):
	s, p = 0, 1
	for x in n:
		p *= x
	for x, y in zip(a, n):
		q = p // y
		s += q * x * pow(q, -1, y)
	return s % p

code = '''
I=input
u = set()
n = int(I())
for i in range(n):
    for c in I():
        if c.lower() in "abcdefghijklmnopqrstuvwxyz":u.add(c)
print(f'{["not ",""][n==len(u)]}Cramer')
x=list(u)
x.sort()
if x:print("".join(x))
'''

compressed = ''
for i in range(0, len(code), 3):
	a = [ord(c) - 32 for c in code[i:i+3]]
	compressed += chr(crt(a, [101, 102, 103]))

print(compressed)
