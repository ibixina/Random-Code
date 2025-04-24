
results = {}

# Generate all expressions with four 4's
for i in '+-*/':
    for j in '+-*/':
        for k in '+-*/':
            # Build the expression string
            st = f"4 {i} 4 {j} 4 {k} 4"
            try:
                # Evaluate the expression with integer division
                result = eval(st.replace('/', '//'))
                
                # Check if result is an integer and store it
                if isinstance(result, int) and result not in results:  # Only store if the result is an integer
                    results[result] = f"{st} = {result}"
            except ZeroDivisionError:
                continue  # Skip expressions that cause division by zero

# Number of test cases
num_cases = int(input())
for _ in range(num_cases):
    n = int(input())
    print(results.get(n, "no solution"))

