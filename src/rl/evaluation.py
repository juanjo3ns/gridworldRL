import torch
import os
import sys
import numpy as np
from time import sleep
from IPython import embed
from src.rl.General.Board import Board
from src.rl.General.NN import QNet, DuelingNet
from src.utils.writecsv import CSV

path = 'weights/'
assert len(sys.argv)>1, "Introduce model version"
assert os.path.exists(os.path.join(path,sys.argv[1])),"Path doesn't exist"
vpath = os.path.join(path, sys.argv[1])


''' We'll be able to evaluate just one iteration of model's weights, or
	all the different iterations trained
'''
if len(sys.argv)>2:
	iterations = [sys.argv[2]]
else:
	iterations = os.listdir(vpath)
	iterations.sort(key=lambda x: int(x.split('.')[0]))
# print(iterations)
board = Board(board_size=19,exp=5,algorithm='dueling-ddqn')
if 'dueling' in sys.argv[1]:
	Q = DuelingNet(board)
else:
	Q = QNet(board)

def eval_step(q_fn, state):
	with torch.no_grad():
		board_state = torch.from_numpy(board.getEnvironment(state).astype(np.float32)).type(dtype)
		q_values = q_fn.predict(board_state.unsqueeze(0))
		return board.actions[q_values.max(1)[1][0]]

def vvalues(q_fn, state):
	with torch.no_grad():
		board_state = torch.from_numpy(board.getEnvironment(state).astype(np.float32)).type(dtype)
		q_values = q_fn.predict(board_state.unsqueeze(0))
		return float(q_values.max(1)[0][0].cpu().numpy())

for i, it in enumerate(iterations):

	''' WRITERS for COORDINATES, STEPS AND STATE-VALUES '''
	csv_coords = CSV("coords",sys.argv[1],"{}".format(it.split('.')[0]))
	csv_steps = CSV("steps",sys.argv[1],"{}".format(it.split('.')[0]))
	csv_vvalues = CSV("vvalues",sys.argv[1],"{}".format(it.split('.')[0]))

	weights = torch.load(os.path.join(vpath, it))
	Q.load_state_dict(weights)
	dtype = torch.cuda.FloatTensor if torch.cuda.is_available() else torch.FloatTensor
	Q = Q.type(dtype)

	num_episodes = 50
	save_episodes = 5
	lost = 0
	mvs = []
	rwr = []

	for i in range(num_episodes):
		initState = board.resetInitRandomly()
		done = False
		while not done:
			# board.printBoard(initState)
			action = eval_step(Q,initState)
			reward, nextState, done = board.takeAction(initState, action)
			initState = nextState
			board.count[nextState]+=1
			if board.movements > board.maxSteps:
				lost += 1
				break
		mvs.append(board.movements)
		rwr.append(board.totalreward)

	'''SAVE NUMBER OF STEPS AND SAVE VVALUES FOR EACH STATE'''
	max_steps = max([board.count[x] for x in board.count])
	for i in range(board.gridSize):
		row = []
		row1 = []
		for j in range(board.gridSize):
			row.extend([board.count[(i,j)]/max_steps])
			row1.extend([vvalues(Q,[i,j])])
		csv_steps.write(row)
		csv_vvalues.write(row1)
	'''SAVE COORDINATES OF EPISODES'''
	avg_mvs = sum(mvs)/num_episodes
	avg_rwr = sum(rwr)/num_episodes
	message = "ITERATION: {}\nVICTORIES: {}\nDEFEATS: {}\nAVERAGE REWARD: {}\nAVERAGE MOVEMENTS: {}".format(it,(num_episodes-lost), lost, avg_rwr, avg_mvs)
	print(message)
	csv_coords.write([it.split('.')[0],(num_episodes-lost)/num_episodes*100,round(avg_rwr,2),avg_mvs])

	for i in range(save_episodes):
		initState = board.resetInitRandomly()
		csv_coords.write([initState[0],initState[1],board.terminalStates[0][0],board.terminalStates[0][1]])
		done = False
		while not done:
			action = eval_step(Q,initState)
			reward, nextState, done = board.takeAction(initState, action)
			csv_coords.write([nextState[0],nextState[1],board.terminalStates[0][0],board.terminalStates[0][1]])
			initState = nextState
			if board.movements > board.maxSteps:
				break



	# Close all csv writers
	csv_coords.close()
	csv_steps.close()
	csv_vvalues.close()
