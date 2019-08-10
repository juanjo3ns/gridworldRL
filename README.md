# Demo of maze solving with Reinforcement Learning - [DEMO](https://juanjo3ns.github.io/gridworldRL/)
![Hits](https://hitcounter.pythonanywhere.com/count/tag.svg?url=https%3A%2F%2Fgithub.com%2Fjuanjo3ns%2FgridworldRL)
![Demo](https://user-images.githubusercontent.com/16901615/59520669-bef86a80-8eca-11e9-8bb3-6768c375a233.png)

##  1. Motivation
Two months ago [@enric1994](https://github.com/enric1994) and myself [@juanjo3ns](https://github.com/juanjo3ns) started learning Reinforcement Learning. To do so, we picked the simplest and most common environment to begin in this topic, the grid world. This simple game is recommended and heavily used by the Sutton and Barto book and the lectures from DeepMind at UCL. 

There are three different types of cells in the board: the init state, the terminal state and the 'lava' state. The Agent has to learn how to go from the init state (which is randomly initialized) to the terminal state, avoiding the 'lava' states since the agent gets a lower reward when it goes through them. After trying many different algorithms and just seeing our results in the terminal and tensorboard, we decided to create a little demo to show in a fancier way what we have learnt. 



##  2. Algorithms
To solve this problem we have used the Double DQN algorithm, where you bootstrap selecting the action with the Q function but you take the actual q value from the target Q function.
![Target values](https://user-images.githubusercontent.com/16901615/58425154-69822800-8099-11e9-8f82-cc3ffd3483bd.png)



##  3. 3D Modeling
Unlike in our [Star Wars](https://juanjo3ns.github.io/starwars-RL/) demo, here we are representing the actual problem. An agent that has to avoid some cells in order to get the terminal state with the highest accumulated reward. Besides that, we've also represented a couple more things:
* State-values: The spheres below the grid represent the expected return of the agent in each state, the return meaning the cumulative rewards until final state. 
* Number steps: The grid below the spheres represent the number of times the agent has passed through each cell during evaluation. It's encoded as yellow -> less number of times and red -> more number of times.
