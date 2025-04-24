import requests
from bs4 import BeautifulSoup
import re

def reveal(google_doc_url):
    try:
        response = requests.get(google_doc_url)
        response.raise_for_status()
        html_content = response.text
    except requests.exceptions.RequestException as e:
        print(f"Error retrieving document: {e}")
        return
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    rows = []
    for row in soup.find_all('tr'):
        cols = row.find_all('td')
        if len(cols) >= 3:  
            try:
                x = int(cols[0].text.strip())
                char = cols[1].text.strip()
                y = int(cols[2].text.strip())
                rows.append((x, char, y))
            except ValueError:
                continue
   
   
    if not rows:
        return
    
    max_x = max(row[0] for row in rows)
    max_y = max(row[2] for row in rows)
    
    grid = [[' ' for _ in range(max_x + 1)] for _ in range(max_y + 1)]
    
    for x, char, y in rows:
        grid[y][x] = char
    
    for row in grid:
        print(''.join(row))

# Run the function with the provided URL
if __name__ == "__main__":
    doc_url = "https://docs.google.com/document/d/e/2PACX-1vQGUck9HIFCyezsrBSnmENk5ieJuYwpt7YHYEzeNJkIb9OSDdx-ov2nRNReKQyey-cwJOoEKUhLmN9z/pub"
    reveal(doc_url)
