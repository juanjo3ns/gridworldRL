from IPython import embed
"""
Differents experiments of lava: (Prepared for gridSize of 10 and 20 (exp 5))
- Two walls in vertical, agent does an 'S'
- Two walls at the bottom edge positions 4 and 5
- One single wall in the middle of map, gives two different ways to achieve terminal state
"""

def getEnv(i, gridSize):
	environments = {
		0: {
			"lava": ([[i, 2] for i in range(4,gridSize)],[[i, 6] for i in range(0,gridSize-4)]),
			"initState": (0,gridSize-1),
			"terminalState": [[gridSize-1,0]]
		},
		1: {
			"lava": ([[i, 4] for i in range(4,gridSize)],[[i, 5] for i in range(4,gridSize)]),
			"initState": (gridSize-1, gridSize-1),
			"terminalState": [[gridSize-1,0]]
		},
		2: {
			"lava": ([[[i, 4] for i in range(4,gridSize-1)]]),
			"initState": (int((gridSize-1)/2),gridSize-1),
			"terminalState": [[int((gridSize-1)/2),0]]
		},
		3: {
			"lava": ([[[i, 4] for i in range(0,gridSize-1)]]),
			"initState": (int((gridSize-1)/2),gridSize-1),
			"terminalState": [[int((gridSize-1)/2),0]]
		},
		4: {
			"lava": ([[[0,gridSize-1]]]),
			"initState" : (gridSize-1,gridSize-1),
			"terminalState": [[int((gridSize-1)/2),0]]
		},
		5: {
			"lava": ([[1, i] for i in range(1,gridSize-2)],
						[[i, 1] for i in range(1,gridSize-4)],
						[[i, gridSize-2] for i in range(1,gridSize-4)],
						[[i, 6] for i in range(4,gridSize-5)],
						[[i, 12] for i in range(4,gridSize-5)],
						[[gridSize-6, i] for i in range(6,13)]),
			"initState" : (gridSize-1,gridSize-1),
			"terminalState": [[0, int((gridSize-1)/2)]]
		}
	}
	return environments[i]

'''
# Check whether we are returning lava cells correctly or not
for i in range(4):
	lava = []
	print(len(getEnv(i, 10)["lava"]))
	for lava_group in getEnv(i, 10)["lava"]:
		for l in lava_group:
			lava.append(l)

	print(lava)
'''
