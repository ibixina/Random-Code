replacement_int = 256
vocab = {}

def get_pair_count(input_list):
    """ Count occurrences of adjacent character pairs """
    pair_count = {}
    for pair in zip(input_list, input_list[1:]):
        pair_count[pair] = pair_count.get(pair, 0) + 1
    return pair_count

def replace_pair(input_list, pair, replacement):
    """ Replace occurrences of a given pair with a new token """
    new_list = []
    i = 0
    while i < len(input_list):
        if i < len(input_list) - 1 and input_list[i] == pair[0] and input_list[i + 1] == pair[1]:
            new_list.append(replacement)
            i += 2  # Skip next character since it's part of the replaced pair
        else:
            new_list.append(input_list[i])
            i += 1
    return new_list

def encode(int_conversion):
    """ Identify and replace the most common adjacent character pair """
    global replacement_int

    pair_count = get_pair_count(int_conversion)
    if not pair_count:
        return int_conversion

    max_pair = max(pair_count, key=pair_count.get)
    replacement = replacement_int

    vocab[replacement] = max_pair
    replacement_int += 1

    return replace_pair(int_conversion, max_pair, replacement)

def get_int(input_string):
    """ Convert input string to a list of integer representations """
    int_conversion = []
    for char in input_string:
        char_code = ord(char)
        if char_code not in vocab:
            vocab[char_code] = char
        int_conversion.append(char_code)
    return int_conversion

def decode(input_list):
    """ Decode the list of encoded integers back into a string """
    while any(char in vocab for char in input_list):
        new_list = []
        for char in input_list:
            if char in vocab:
                new_list.extend(vocab[char] if isinstance(vocab[char], tuple) else [vocab[char]])
            else:
                new_list.append(char)
        input_list = new_list

    return ''.join(chr(c) if isinstance(c, int) else c for c in input_list)

# Get input string from user
input_string = input("Enter the string to encode: ")
print("Length:", len(input_string), "Vocab size:", len(vocab))

int_conversion = get_int(input_string)
for _ in range(150):
    int_conversion = encode(int_conversion)

print(decode(int_conversion))

