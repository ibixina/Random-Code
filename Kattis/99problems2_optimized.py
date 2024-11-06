# Read input
n, p = map(int, input().split())
problems = sorted(list(map(int, input().split())))
available = [True] * n  # Track available problems using boolean array

def binary_search(target, find_type):
    left = 0
    right = n - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        
        # Find next available element from mid
        curr_idx = mid
        while curr_idx <= right and not available[curr_idx]:
            curr_idx += 1
        if curr_idx > right:
            # If no available elements found to the right, search left half
            right = mid - 1
            continue
            
        curr_val = problems[curr_idx]
        
        if find_type == 1:  # Find first greater
            if curr_val > target:
                result = curr_idx
                right = mid - 1
            else:
                left = curr_idx + 1
        else:  # Find last less than or equal
            if curr_val <= target:
                result = curr_idx
                left = curr_idx + 1
            else:
                right = mid - 1
                
    # If we found a result, make sure it's still available
    if result != -1 and not available[result]:
        # Try to find next available element after result
        next_idx = result
        while next_idx < n:
            if available[next_idx]:
                if find_type == 1 and problems[next_idx] > target:
                    return next_idx
                if find_type == 2 and problems[next_idx] <= target:
                    return next_idx
            next_idx += 1
        return -1
        
    return result

# Process queries
for _ in range(p):
    query_type, value = map(int, input().split())
    
    idx = binary_search(value, query_type)
    if idx != -1:
        print(problems[idx])
        available[idx] = False
    else:
        print(-1)
