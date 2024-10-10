import random
def main():
    p = 1
    max_buffer_size = 10
    b = []

    m = 10000
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
        if len(b) == max_buffer_size:
            remove_queue = []
            for i in b:
                remove = True if random.random() <0.5 else False
            for i in remove_queue:
                b.remove(i)
            p = p/2
    print(len(b)/p)

main()

