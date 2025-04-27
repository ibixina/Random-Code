from pytrends.request import TrendReq

# Initialize the connection
pytrends = TrendReq(hl='en-US', tz=360)

# Build a request
pytrends.build_payload(
    kw_list=["selena"],     # Keywords
    timeframe='all',        # Time range ('today 5-y', 'all', '2020-01-01 2023-12-31')
    geo='US',               # Location (country code)
)

# Fetch data
data = pytrends.interest_over_time()
print(data)

