var laststep = [0,0];

// Transform coordinates from 0->9 to -45->45
function trC(coord){
	return -45 + coord*10;
}

function runEvaluations(csvData){

	if (counter >= csvData.length || counter >= 45){
		counter = 1;
	}
	state = [parseInt(csvData[counter][0]),parseInt(csvData[counter][1])];
 	if(laststep[0]==state[0] && laststep[1]==state[1]){
		if (state[0]==9){
			moveSmooth(trC(state[0]+1), 4,trC(state[1]), 100,0);
			moveSmooth(trC(state[0]), 4,trC(state[1]), 100, 100);
		}else if(state[1]==9){
			moveSmooth(trC(state[0]), 4,trC(state[1]+1), 100, 0);
			moveSmooth(trC(state[0]), 4,trC(state[1]), 100,100);
		}else if(state[0]==0){
			moveSmooth(trC(state[0]-1), 4,trC(state[1]), 100,0);
			moveSmooth(trC(state[0]), 4,trC(state[1]), 100,100);
		}else if(state[1]==0){
			moveSmooth(trC(state[0]), 4,trC(state[1]-1), 100,0);
			moveSmooth(trC(state[0]), 4,trC(state[1]), 100,100);
		}
	}else{
		moveSmooth(trC(state[0]), 4,trC(state[1]), 200,0);
	}
	laststep = state;
	counter += 1;
}
