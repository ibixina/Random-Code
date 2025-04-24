import random
def main():
    t = -1 # timestep
    p = 1 # probability of any element being in the buffer
    b = set() # buffer

    b_size = 100 # buffer size
    m = 150000 # length of the stream

    data_stream = [random.randint(0,m*2) for i in range(m)] # random stream of data of length m
    print(len(data_stream))
    answer = set(data_stream) # distinct elements in the stream
    answer_length = len(answer) # number of distinct elements
    print("Answer: ", answer_length)
    while t != m-1:
        t += 1
        a = data_stream[t] # get the next element from the stream
        max_el = (0,-1) # keep track of the maximum u for later operation
        to_delete = [] # keep track of items to be deleted, can't delete while the set is being iterated over
        for b_prime, u in b:
            if (u > max_el[1]):
                max_el = (b_prime, u)
            if b_prime == a:
                to_delete += [(b_prime, u)] # add it to be deleted once the loop is over
        for delement in to_delete: # delete items
            b.remove(delement)

        u = random.random() # random value between 0 and 1
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
