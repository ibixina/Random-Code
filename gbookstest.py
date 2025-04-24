from gbooks import GBooks

g = GBooks()
data = g.ngram("freedom", year_start=1800, year_end=2000)
print(data)
