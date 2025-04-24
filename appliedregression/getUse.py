target_word = "freedom"
file_path = "googlebooks-eng-all-1gram-20191017-eng-f"

usage_by_year = {}

with open(file_path, 'r', encoding='utf-8') as f:
    for line in f:
        parts = line.strip().split('\t')
        if parts[0] == target_word:
            year = int(parts[1])
            count = int(parts[2])
            usage_by_year[year] = usage_by_year.get(year, 0) + count

for year in sorted(usage_by_year):
    print(f"{year}: {usage_by_year[year]}")
