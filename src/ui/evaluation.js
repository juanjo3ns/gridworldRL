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


function runEvaluations(csvData){

	if (counter >= (csvData.length-1)){
		counter = 1;
	}
	state = [parseInt(csvData[counter][0]),parseInt(csvData[counter][1])];
	if (isInit(laststep, state)){
		paintBoard(state);
	}
 	if(laststep[0]==state[0] && laststep[1]==state[1]){
		if (state[0]==9){
			moveAgent(trC(state[0]+1), 4,trC(state[1]), 100,0);
			moveAgent(trC(state[0]), 4,trC(state[1]), 100, 100);
		}else if(state[1]==9){
			moveAgent(trC(state[0]), 4,trC(state[1]+1), 100, 0);
			moveAgent(trC(state[0]), 4,trC(state[1]), 100,100);
		}else if(state[0]==0){
			moveAgent(trC(state[0]-1), 4,trC(state[1]), 100,0);
			moveAgent(trC(state[0]), 4,trC(state[1]), 100,100);
		}else if(state[1]==0){
			moveAgent(trC(state[0]), 4,trC(state[1]-1), 100,0);
			moveAgent(trC(state[0]), 4,trC(state[1]), 100,100);
		}
	}else{
		moveAgent(trC(state[0]), 4,trC(state[1]), 200,0);
	}
	laststep = state;
	counter += 1;
}
