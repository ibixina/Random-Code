def runSim():
    inp = input()
    if (inp == "-1"):
        return
    n, m = list(map(int, (inp.split())))
    scores = list(map(int, input().split()))
    matches = []
    for i in range(m):
       a, b = list( map(int, input().split()) ) 
       matches += [[a-1, b-1]]

    # Run the main function and print the result
    result = canWin(scores, 0, [], matches)
    if (result[0]):
        print(" ".join(list(map(str, result[1]))))
    else:
        print("NO")
    input()
    runSim()
        

def take_action(state, teams, a):
    new_state = state.copy()
    if a == 0:  # Team 0 wins
        new_state[teams[0]] += 2
    elif a == 1:  # Draw
        new_state[teams[0]] += 1
        new_state[teams[1]] += 1
    else:  # Team 1 wins
        new_state[teams[1]] += 2
    return new_state

def canWin(score, gameNo, gameSeq, matches):
    if gameNo >= len(matches):
        if (all(score[-1] > i for i in score[:-1])):

            return (True, gameSeq)
        else:
            return (False, [])
        if max(score) == score[-1]:  # Check if the last team (your team) has the highest score
            return (True, gameSeq)
        else:
            return (False, [])
    
    for action in [0, 1, 2]:  # Try each possible action (win, draw, lose)
        new_state = take_action(score, matches[gameNo], action)
        new_gameSeq = gameSeq + [action]  # Append current action to the sequence
        res = canWin(new_state, gameNo + 1, new_gameSeq, matches)
        if res[0]:
            return res
    
    return (False, [])


runSim()
