def longest_balanced_subsequence(s):
    max_len = 0
    stack = [-1]

    for i, c in enumerate(s):
        if c == '(':
            stack.append(i)
        elif c == ')':
            stack.pop()
            if not stack:
                stack.append(i)
            else:
                length = i - stack[-1]
                max_len = max(max_len, length)
    
    return max_len

# Interactive loop
while True:
    inn = input()
    print(longest_balanced_subsequence(inn))
