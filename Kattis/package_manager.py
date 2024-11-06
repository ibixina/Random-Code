t, s =list(  map(int,input().split())) 

stores = list(map(int, input().split()))
latest_versions = {}
for i in range(t):
    name, version = input().split()
    latest_versions[name] = int(version)

for store in stores:
    upgrades = 0
    for item in range(store):
        name, version = input().split()
        upgrades += latest_versions[name] - int(version)
    print(upgrades)


