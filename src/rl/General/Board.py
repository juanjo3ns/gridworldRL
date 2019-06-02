import os
import numpy as np
import random
from tqdm import tqdm
from IPython import embed
from collections import defaultdict
from random import choice
from tensorboard_logger import configure, log_value, log_histogram
# from src.utils.plot import *
# from src.utils.generateGIF import genGIF
from src.rl.General.lava import *


class Board:
	def __init__(self,
				 epsilon_scheduled=0,
				 board_size=10,
				 algorithm='sarsa',
				 plotBool=[False, False],
				 exp=1,
				 changeExp=None,
				 nstep=1,
				 batch_size=1,
				 update_freq=1):

		self.rewardSize = -0.02
		self.reward_lava = -1
		self.totalreward = 0
		self.movements = 0
		self.gamma = 0.99
		self.alpha = 0.1
		self.alpha_nn = 0.0001
		self.gridSize = board_size
		self.epsilon = 0.1
		self.numIterations = 10000
		self.changeIteration = 2500
		self.maxSteps = 70
		self.plotStep = 50

		self.actions = [(-1, 0), (1, 0), (0, 1), (0, -1)]
		self.epsilon_scheduled = epsilon_scheduled
		self.algorithm = algorithm
		self.exp = exp
		self.changeExp = changeExp

		# DQN parameters
		self.start_learning = 0
		self.target_update_freq = update_freq
		self.learning_freq = 1
		self.batch_size = batch_size
		self.loss_list = []

		# Dyna Q
		self.planning_steps = [0, 5, 10, 50, 100]

		# n-step Q-Learning and DQN
		self.nstep = nstep

		# Paths or printing variables
		# self.version = self.setVersion() + '.' + self.algorithm
		self.plotBool = plotBool
		self.surface_path = os.path.join(
			"/gifs/TimeDifference/", self.algorithm)
		self.heatmap_path = os.path.join("/gifs/Heatmaps", self.algorithm)

		# Lists or dictionaries
		self.states = [[i, j] for i in range(self.gridSize) for j in range(self.gridSize)]
		self.count = defaultdict(int)
		self.policy = defaultdict(lambda: np.ones(
			len(self.actions)) / len(self.actions))
		self.model = defaultdict(defaultdict)
		self.Q = defaultdict(lambda: np.zeros(len(self.actions)))
		# Double Q-Learning
		self.doubleQ = defaultdict(lambda: np.zeros(len(self.actions)))
		self.V = np.zeros((self.gridSize, self.gridSize))
		self.board = np.zeros((self.gridSize, self.gridSize))
		# Walls of grid world
		self.lava = []
		self.setLava(self.exp)
		self.terminalStates = getEnv(self.exp, self.gridSize)["terminalState"]
		self.initState = self.resetInit()

	# def setVersion(self):
	# 	tnum = "TENSORBOARD_NUMBER"
	# 	assert (
	# 		tnum in os.environ), "Set environment variable for tensorboard and heatmaps"
	# 	return os.environ[tnum]

	def changeExperiment(self, it):
		if not self.changeExp == None:
			if it == self.changeIteration:
				self.setLava(self.changeExp)

	def resetInit(self):
		self.totalreward = 0
		self.movements = 0
		return getEnv(self.exp, self.gridSize)["initState"]

	def resetInitRandomly(self):
		self.totalreward = 0
		self.movements = 0
		# Initialize initState to terminal state to make sure we enter the while
		initState = self.terminalStates[0][:]
		while initState in self.terminalStates or initState in self.lava:
			initState[0] = random.randint(0, self.gridSize-1)
			initState[1] = random.randint(0, self.gridSize-1)
		return tuple(initState)

	def setLava(self, exp):
		cells = []
		for lava_group in getEnv(exp, self.gridSize)["lava"]:
			for l in lava_group:
				cells.append(l)
		self.lava = cells

	def takeAction(self, state, action):
		nextState = np.array(state) + np.array(action)
		done = False
		reward = self.rewardSize
		if -1 in list(nextState) or self.gridSize in list(nextState):
			nextState = state

		if list(nextState) in self.lava:
			reward = self.reward_lava

		if list(nextState) in self.terminalStates:
			reward = 0
			done = True

		self.totalreward += reward
		self.movements += 1
		return reward, tuple(nextState), done

	def getAction(self, state):
		return self.actions[np.random.choice(range(len(self.actions)), p=self.policy[state])]

	def policy_fn(self, state, Q_state):
		nA = len(self.actions)
		# 1 / epsilon for non-greedy actions
		self.policy[state] = (self.epsilon / nA) * np.ones(nA)
		greedy_action = Q_state.argmax()
		# (1 / epsilon + (1 - epsilon)) for greedy action
		self.policy[state][greedy_action] = 1.0 - \
			self.epsilon + (self.epsilon / nA)

	def getAgent(self, state):
		board = np.zeros((self.gridSize, self.gridSize))
		board[state[0]][state[1]] = 1
		return board

	def getLava(self):
		board = np.zeros((self.gridSize, self.gridSize))
		for state in self.lava:
			board[state[0]][state[1]] = 1
		return board

	def getTerminalState(self):
		board = np.zeros((self.gridSize, self.gridSize))
		for state in self.terminalStates:
			board[state[0]][state[1]] = 1
		return board

	def getEnvironment(self, state):
		agent = self.getAgent(state)
		lava = self.getLava()
		terminalStates = self.getTerminalState()
		return np.stack((agent,lava,terminalStates))
		# return 0.6*agent+0.3*lava+terminalStates

	def printBoard(self, state):
		board = np.zeros((self.gridSize, self.gridSize))
		board[state[0]][state[1]] = 1
		print(board)

	# def plotHeatmap(self, it):
	# 	if self.plotBool[0]:
	# 		plot_heatmap(self.count, os.path.join(
	# 			self.heatmap_path, self.version + '.' + str(it) + '.png'), it)

	# def generateGIF(self, path):
	# 	if any(self.plotBool):
	# 		genGIF(path)
	#
	# def plotValues(self, it, Q):
	# 	if self.plotBool[1]:
	# 		V1 = np.zeros((self.gridSize, self.gridSize))
	# 		for i, x in enumerate(V1):
	# 			for t, y in enumerate(x):
	# 				for a, q in zip(self.policy[(i, t)], Q[(i, t)]):
	# 					V1[i][t] += a * q
	# 		plot_value_function(V1, it, path=os.path.join(
	# 			self.surface_path, "{:03}.png".format(it)))
