class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right
# Test case 1
root = Node(1)
root.left = Node(2)
root.right = Node(3)
root.left.left = Node(4)
root.left.right = Node(5)
root.right.right = Node(6)

node1 = root.left.left  # Node(4)
node2 = root.left.right  # Node(5)

lca = lowest_common_ancestor(root, node1, node2)
print(lca.value)  # Output: 2

# Test case 2
# Add more test cases as needed

queue = []
def explore(element, node1, node2 path=[]):
    path.append(element)
    if element == node1:
        return True
    if element == node2:
        return True

    if element.left:
        queue.append(element.left)
    if element.right:
        queue.append(element.right)
    if queue:
        element = queue[0]
        queue = queue[1:]
        explore(element, node1, node2, path)
    else:
        return False

def hasChild(element):
    current = element
    if element = None:
        return False

    if element.right == node1 or element.right == node2:
        return True
    if element.left == node1 or element.left == node2:
        return True


    if hasChild(current.left) and hasChild(current.right):
        return current

def lowest_common_ancestor(root, node1, node2):
    current_node = root
    queue.append(root.left)
    queue.append(root.right)
