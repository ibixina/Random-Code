import csv
import json

# Read and decode JSON from file
with open('json_data.json', 'r') as f:
    records = json.load(f)  # Use json.load, not json.loads

# Get all unique keys for headers
headers = set()
for record in records:
    headers.update(record.keys())
headers = list(headers)

# Write to CSV
with open('output.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=headers)
    writer.writeheader()
    for record in records:
        writer.writerow(record)

print("CSV file 'output.csv' written successfully.")

