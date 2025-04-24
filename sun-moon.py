s_prev, s_next  = map(int,input().split())
m_prev, m_next = map(int,input().split())

# s_prev, s_next = [3,10]
# m_prev, m_next = [1, 2]



s_vals = [-1 * s_prev]
m_vals = [-1 * m_prev]

while True:
    ns = s_vals[-1] + s_next
    nm = m_vals[-1] + m_next
    s_vals += [ns]
    m_vals += [nm]

    # print(m_vals)
    # print(s_vals)

    if (ns in m_vals):
        print(ns)
        break
    if (nm in s_vals):
        print(nm)
        break
        print(s_vals)



# -3 7 17 27
# -1 1 3 5 7
