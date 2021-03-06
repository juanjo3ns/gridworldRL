import sys
import os
import numpy as np
from tqdm import tqdm
from time import sleep, time
import random
from IPython import embed
from tensorboard_logger import configure, log_value, log_histogram
import torch
from src.rl.General.Buffer import Buffer
from src.rl.General.Board import Board
from src.rl.General.NN import QNet
# from src.utils.sendTelegram import send

'''
MAIN CHANGES IN VERSION:


'''
batch_size = int(sys.argv[1])
update_freq = int(sys.argv[2])
version = sys.argv[3]
print(batch_size,update_freq,version)

manualSeed = 123123
np.random.seed(manualSeed)
random.seed(manualSeed)
torch.manual_seed(manualSeed)
torch.cuda.manual_seed(manualSeed)
torch.cuda.manual_seed_all(manualSeed)

torch.backends.cudnn.enabled = False
torch.backends.cudnn.benchmark = False
torch.backends.cudnn.deterministic = True

# epsilon_scheduled = np.linspace(0.5,0.0001,2000)
import math
epsilon_scheduled = lambda index: 0.0001 + (0.6 - 0.0001) * math.exp(-1. * index / 3000)

board = Board(epsilon_scheduled,algorithm='double-dqn',board_size=19, exp=5,batch_size=batch_size,update_freq=update_freq)
buffer = Buffer(size=20000, batch_size=batch_size)
'''
Load two Q functions approximators (neural networks)
 -> One of them will be used just to compute target Q values, and will be loaded
 	with Q weights every X episodes
 -> Second one will be used to estimate current Q values
'''
Q = QNet(board)
target_Q = QNet(board)
dtype = torch.cuda.FloatTensor if torch.cuda.is_available() else torch.FloatTensor
atype = torch.cuda.LongTensor if torch.cuda.is_available() else torch.LongTensor
Q = Q.type(dtype)
target_Q = target_Q.type(dtype)

# Optimizer
optimizer = torch.optim.Adam(Q.parameters(), lr=board.alpha_nn)
loss_fn = torch.nn.MSELoss()

path_out = "/data/src/rl/tensorboard/" + version
configure(path_out, flush_secs=5)

#Folder to store weights, if it doesn't exists create it
if not os.path.exists('weights/'):
	os.mkdir('weights/')
if not os.path.exists(os.path.join('weights',version)):
	os.mkdir(os.path.join('weights',version))

def eval(q_fn):
	actions_legend = {0:"^",1:">",2:"v",3:"<"}
	baseline = []
	for state in board.states:
		board_state = torch.from_numpy(board.getEnvironment(state).astype(np.float32)).type(dtype)
		q_values = q_fn.predict(board_state.unsqueeze(0))
		action = q_values.max(1)[1][0].detach().cpu().numpy()
		baseline.append(actions_legend[int(action)])
	baseline = np.array(baseline).reshape(board.gridSize, board.gridSize)
	print(baseline)


# ITERATION'S LOOP
for it in tqdm(range(board.numIterations)):

	initState = board.resetInitRandomly()

	# If we set up an experiment change, it will change the lava cells to check
	# if the algorithm is able to change its behaviour
	board.changeExperiment(it)
	# EPISODE'S LOOP
	done = False
	while not done:
		if it > board.start_learning:
			if random.random() > board.epsilon_scheduled(it):
				with torch.no_grad():
					Q.eval()
					board_state = torch.from_numpy(board.getEnvironment(initState).astype(np.float32)).type(dtype)
					q_values = Q.predict(board_state.unsqueeze(0))
					action = board.actions[q_values.max(1)[1][0]]

			else:
				action = board.actions[np.random.choice(range(len(board.actions)))]
		else:
			action = board.actions[np.random.choice(range(len(board.actions)))]
		reward, nextState, done = board.takeAction(initState, action)
		buffer.store((initState, board.actions.index(action), nextState, reward, 0 if done else 1))

		initState = nextState
		board.count[nextState]+=1
		if board.movements > board.maxSteps:
			break


	if it >= board.start_learning and it % board.learning_freq == 0:
		Q.train()
		sample_data = buffer.sample()
		state_batch = torch.from_numpy(np.array([board.getEnvironment(x).astype(np.float32) for x in sample_data['state']])).type(dtype)
		action_batch = torch.from_numpy(np.array(sample_data['action'])).type(atype)
		next_state_batch = torch.from_numpy(np.array([board.getEnvironment(x).astype(np.float32) for x in sample_data['next_state']])).type(dtype)
		reward_batch = torch.from_numpy(np.array(sample_data['reward'])).type(dtype)
		done_batch = torch.from_numpy(np.array(sample_data['done'])).type(dtype)

		all_q_values = Q.predict(state_batch)
		# We pick the q value that each action indicates, to do that we choose
		# from dimension 1 with the 'transposed' actions
		q_values = all_q_values.gather(1,action_batch.unsqueeze(1))

		''' DOUBLE DQN MAGIC '''
		# Select actions with Q network and get q values from target Q network
		select_action = Q.predict(next_state_batch)
		target_q_values = target_Q.predict(next_state_batch)
		next_q_values = target_q_values.gather(1,select_action.max(1)[1].unsqueeze(1))


		# multiply target by done, because if we are done, there are not other next q values
		td_target = reward_batch.unsqueeze(1) + board.gamma*next_q_values*done_batch.unsqueeze(1)
		optimizer.zero_grad()
		loss = loss_fn(td_target, q_values)
		loss.backward()
		board.loss_list.append(loss.detach().cpu().numpy())

		for p in Q.parameters():
			p.grad.data.clamp_(-1, 1)

		optimizer.step()


	if it % board.target_update_freq == 0 and it > board.start_learning:
		target_Q.load_state_dict(Q.state_dict())
	if it %200==0:
		# eval(Q)
		# send("Iteration number {}".format(it))
		torch.save(Q.state_dict(), 'weights/{}/{}.pt'.format(version, it))
	if it > board.start_learning and it % board.learning_freq == 0:
		if len(board.loss_list)==0:
			avg_loss = last_loss
		else:
			avg_loss = sum(board.loss_list)/len(board.loss_list)
		last_loss = avg_loss
		board.loss_list.clear()
		log_value("Loss", avg_loss, it)
	log_value("Total_reward", board.totalreward, it)
	log_value("Movements", board.movements, it)
# 	if it % board.plotStep==0:
# 		board.plotValues(it, board.Q)
# 		board.plotHeatmap(it)
#
# board.generateGIF(board.heatmap_path)
