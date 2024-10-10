import random
def main():
    t = -1
    p = 1
    b = set()

    b_size = 20
    m = 150

    data_stream = [random.randint(0,m*2) for i in range(m)]
    print(len(data_stream))
    answer = set(data_stream)
    answer_length = len(answer)
    print("Answer: ", answer_length)
    while t != m-1:
        t += 1
        a = data_stream[t]
        max_el = (0,-1)
        to_delete = []
        for b_prime, u in b:
            if (u > max_el[1]):
                max_el = (b_prime, u)
            if b_prime == a:
                to_delete += [(b_prime, u)]
        for delement in to_delete:
            b.remove(delement)
        u = random.random()
        if (u >= p):
            continue
        if (len(b) < b_size):
            b.add((a, u))
            continue
        if (u > max_el[1]):
            p = u
        else:
            b.remove(max_el)
            b.add((a, u))



    print(len(b)/p)

main()
