characters = ["A", "B", "C", "D", "E"]
base = len(characters)  # 5
length = 3  # Three-letter combinations

for i in range(base ** length):  # Loop from 0 to 124 (base^length - 1)
    combination = ""
    num = i
    for _ in range(length):
        combination = characters[num % base] + combination  # Add the next digit
        num //= base  # Move to next digit in base-5
    print(combination)  # Print the combination
