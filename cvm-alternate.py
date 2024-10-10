import random
def main():
    p = 1
    max_buffer_size = 10
    b = []

    m = 100
    data_stream = [random.randint(0,m*2) for i in range(m)] # random stream of data of length m
    print(len(set(data_stream)))
    for a in data_stream:
        for el in b:
            if el[0] == a:
                b.remove(el)
                break
        u = random.randint(0,1)
        if (u <= p):
            b.append((a, u))
        while len(b) == max_buffer_size:
            b_index = 0
            remove = True if random.randint(0,1) < 0.5 else False
            if remove:
                b.pop(b_index)
            else:
                b_index += 1
            p = p/2
    print(len(b)/p)

main()

