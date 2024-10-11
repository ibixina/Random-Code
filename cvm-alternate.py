import random
def main():
    p = 1
    max_buffer_size = 10
    b = {}

    m = 100000
    data_stream = [random.randint(0,m*2) for i in range(m)] # random stream of data of length m
    answer = len(set(data_stream))
    print(answer)
    for a in data_stream:
        if a in b.copy():
            del b[a]
        u =random.random()
        if (u <= p):
            b[a] = u
        if len(b) == max_buffer_size:
            for i in b.copy().keys():
                remove = True if random.random() <0.5 else False
                if remove:
                    del b[i]
            p = p/2
    estimate = len(b)/p
    print(estimate)
    print(estimate/answer * 100)
main()

