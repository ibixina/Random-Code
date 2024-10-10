import random
def main():
    p = 1
    max_buffer_size = 10
    b = {}

    m = 100000
    data_stream = [random.randint(0,m*2) for i in range(m)] # random stream of data of length m
    print(len(set(data_stream)))
    for a in data_stream:
        if a in b:
            del b[a]
        u =random.random()
        if (u <= p):
            b[a] = u
        if len(b) == max_buffer_size:
            remove_queue = []
            for i in b.copy().keys():
                remove = True if random.random() <0.5 else False
                if remove:
                    del b[i]
            p = p/2
    print(len(b)/p)

main()

