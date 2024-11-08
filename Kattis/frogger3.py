def solve_game(n, boards):
    # Use a single dictionary to store results for all target values
    # Format: (position, target) -> bool
    memo = {}
    
    def can_win(pos, target, seen=None):
        if seen is None:
            seen = set()
            
        # Check memoized result
        key = (pos, target)
        if key in memo:
            return memo[key]
            
        # Base cases
        if pos < 0 or pos >= n or pos in seen:
            memo[key] = False
            return False
            
        if boards[pos] == target:
            memo[key] = True
            return True
            
        # Mark current position as seen
        seen.add(pos)
        
        # Calculate next position
        next_pos = pos + boards[pos]
        
        # Recursive call
        result = can_win(next_pos, target, seen)
        
        # Memoize and return result
        memo[key] = result
        return result
    
    # Count winning positions
    count = 0
    for target in boards:  # For each possible target value
        for start in range(n):  # For each starting position
            count += can_win(start, target)
            
    return count

# Input processing
n = int(input())
boards = list(map(int, input().split()))
print(solve_game(n, boards))
