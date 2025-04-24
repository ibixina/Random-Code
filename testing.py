
def generate_strings(s):
    results = ['']
    

    for char in s:

        print(results)
        if char == '?':
            # For each `?`, duplicate the current results and add both `0` and `1`
            results = [r + '0' for r in results] 
            print("Result ",results)
            results +=  [r + '1' for r in results]


            print("Result ",results)
        else:
            # For non-`?` characters, just add the character to each result
            results = [r + char for r in results]
    
    return results

# Example usage
s = "10?1?1?"
print(generate_strings(s))

