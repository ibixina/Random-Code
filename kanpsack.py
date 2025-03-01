
items = [10, 20, 30, 40, 50]
weights = [10, 20, 30, 40, 50]
capacity = 50   


def knapsack(items, weights, capacity):
    num_of_items = len(items)
    dp = [[0] * capacity for _ in range(num_of_items + 1)]

    for item in range(1, num_of_items + 1):
        for capacity in range(capacity):
            if weights[item - 1] <= capacity:
                dp[item][capacity] = max(dp[item - 1][capacity], dp[item - 1][capacity - weights[item - 1]] + items[item - 1])
            else:
                dp[item][capacity] = dp[item - 1][capacity]
    items_to_take = []

    for i in range(num_of_items, 0, -1):
        if dp[i][capacity] != dp[i - 1][capacity]:
            items_to_take.append(i)
    print(items_to_take)
    return dp[num_of_items][capacity]

print(knapsack(items, weights, capacity))


def knapsack_optimized(values, weights, W):
    n = len(values)
    dp = [0] * (W + 1)

    for i in range(n):
        for w in range(W, weights[i] - 1, -1):
            dp[w] = max(dp[w], values[i] + dp[w - weights[i]])

    return dp[W]


print(knapsack_optimized(items, weights, capacity))
