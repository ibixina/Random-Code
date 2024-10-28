c = """
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
"""
print(c.encode().decode('u16'))

def main():
    for i in range(8):
        print("Hello OWkld")
    
        break
    return



