def create_lattice_grid(num1, num2):
    # Convert numbers to strings for digit manipulation
    num1_str = str(num1)
    num2_str = str(num2)
    
    # Get dimensions
    cols = len(num1_str)
    rows = len(num2_str)
    
    # Calculate products for each cell
    grid_values = []
    for i in range(rows):
        row_values = []
        for j in range(cols):
            product = int(num1_str[j]) * int(num2_str[i])
            # Ensure two digits with leading zero if needed
            row_values.append(f"{product:02d}")
        grid_values.append(row_values)
    
    # Generate the grid
    output = []
    
    # Top border
    output.append("+-------------+")
    
    # Add the first number
    num1_line = "|"
    for digit in num1_str:
        num1_line += f"   {digit}"
    num1_line += "   |"
    output.append(num1_line)
    
    # Add the grid header
    output.append("| +---+---+---+ |")
    
    # Add each row of the grid
    for row_idx, row in enumerate(grid_values):
        # First line of the cell
        cell_line1 = "| "
        for cell in row:
            cell_line1 += f"|{cell[0]} /| "
        output.append(cell_line1)
        
        # Middle line of the cell
        cell_line2 = "| "
        for _ in row:
            cell_line2 += "| / | "
        cell_line2 += "  |" + num2_str[row_idx] + "|"
        output.append(cell_line2)
        
        # Bottom line of the cell
        if row_idx == 0:
            cell_line3 = f"|{num2_str[row_idx]}"
        else:
            cell_line3 = "|/"
        for cell_idx, cell in enumerate(row):
            cell_line3 += f"|/ {cell[1]}|"
        output.append(cell_line3)
        
        # Add separator line between rows
        output.append("| +---+---+---+ |")
    
    # Add the final sum line
    result = calculate_final_sum(grid_values)
    sum_line = "|/"
    for digit in result:
        sum_line += f" {digit} /"
    sum_line += "    |"
    output.append(sum_line)
    
    return "\n".join(output)

def calculate_final_sum(grid_values):
    """Calculate the final sum by adding diagonals"""
    cols = len(grid_values[0])
    rows = len(grid_values)
    
    # Convert grid values to integers
    grid_nums = [[int(cell) for cell in row] for row in grid_values]
    
    # Initialize result
    result = []
    carry = 0
    
    # Process each diagonal
    for diag in range(cols + rows - 1):
        total = carry
        
        # Add all numbers in the current diagonal
        for i in range(max(0, diag - cols + 1), min(rows, diag + 1)):
            j = diag - i
            if j < cols:
                total += grid_nums[i][j]
        
        result.append(str(total % 10))
        carry = total // 10
    
    # Add any remaining carry
    if carry:
        result.append(str(carry))
    
    # Reverse the result to get correct order
    return result[::-1]

# Example usage
def print_lattice_multiplication(num1, num2):
    grid = create_lattice_grid(num1, num2)
    print(grid)
    print(f"\nResult: {num1 * num2}")

# Test the function
print_lattice_multiplication(345, 56)
