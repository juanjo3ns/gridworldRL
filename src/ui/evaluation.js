var laststep = [0,0];

// Transform coordinates from 0->9 to -45->45
function trC(coord){
	return -95 + coord*10;
}

//Check if it's the beginning of an episode
function isInit(laststep,state){
	// console.log(Math.abs(laststep[0]-state[0]),Math.abs(laststep[1]-state[1]));
	return (Math.abs(laststep[0]-state[0])>1 || Math.abs(laststep[1]-state[1])>1)
}

function checkAgentOrientation(state, prevstate){
	var new_orientation = -1;
	var state_dif = [state[0]-prevstate[0], state[1]-prevstate[1]];
	console.log(state_dif, state, prevstate);
	if (JSON.stringify(state_dif) == JSON.stringify([1,0])){
		new_orientation = 0;
	} else if (JSON.stringify(state_dif) == JSON.stringify([-1,0])){
		new_orientation = 2;
	} else if (JSON.stringify(state_dif) == JSON.stringify([0,-1])){
		new_orientation = 3;
	} else if(JSON.stringify(state_dif) == JSON.stringify([0,1])){
		new_orientation = 1;
	}
	console.log(new_orientation, agent_orientation);
	if (new_orientation!=-1){
		var steps = (agent_orientation-new_orientation);

		if (steps>2){
			steps=-1;
		}else if (steps<-2){
			steps=1;
		}
		console.log(steps,steps*Math.PI/2);
		rotateAgent(0,steps*Math.PI/2,0,100);
		agent_orientation = new_orientation;
	}


}


function runEvaluations(csvData){

	if (counter >= (csvData.length-1)){
		counter = 1;
	}
	state = [parseInt(csvData[counter][0]),parseInt(csvData[counter][1])];
	if (isInit(laststep, state)){
		scene.getObjectByName("agent").rotation.y = 0;
		agent_orientation = 1;
		paintBoard(state);
	}
	checkAgentOrientation(state,laststep);
 	if(laststep[0]==state[0] && laststep[1]==state[1]){
		if (state[0]==9){
			moveAgent(trC(state[0]+1), 6.5,trC(state[1]), 100,0);
			moveAgent(trC(state[0]), 6.5,trC(state[1]), 100, 100);
		}else if(state[1]==9){
			moveAgent(trC(state[0]), 6.5,trC(state[1]+1), 100, 0);
			moveAgent(trC(state[0]), 6.5,trC(state[1]), 100,100);
		}else if(state[0]==0){
			moveAgent(trC(state[0]-1), 6.5,trC(state[1]), 100,0);
			moveAgent(trC(state[0]), 6.5,trC(state[1]), 100,100);
		}else if(state[1]==0){
			moveAgent(trC(state[0]), 6.5,trC(state[1]-1), 100,0);
			moveAgent(trC(state[0]), 6.5,trC(state[1]), 100,100);
		}
	}else{
		moveAgent(trC(state[0]), 6.5,trC(state[1]), 200,0);
	}
	laststep = state;
	counter += 1;
}
