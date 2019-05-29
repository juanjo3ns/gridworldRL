var csv_files = loadCSV();

var csv = 0;
var step = 1;
var laststep = [0,0];
csvData = getData(csv_files[0]);
addStats(csvData);

var intervalID = setInterval(runEvaluations, 500);

// Transform coordinates from 0->9 to -45->45
function trC(coord){
	return -45 + coord*10;
}

function runEvaluations(){

	if (step >= csvData.length){
		step = 1;
		csv += 1;
		csvData = getData(csv_files[csv%csv_files.length]);
		showStats(csvData);
	}
	state = [parseInt(csvData[step][0]),parseInt(csvData[step][1])];
 	if(laststep[0]==state[0] && laststep[1]==state[1]){
		// console.log(laststep,state);
		if (state[0]==9){
			moveSmooth(trC(state[0]+1), 4,trC(state[1]), 250,0);
			moveSmooth(trC(state[0]), 4,trC(state[1]), 250, 250);
		}else if(state[1]==9){
			moveSmooth(trC(state[0]), 4,trC(state[1]+1), 250, 0);
			moveSmooth(trC(state[0]), 4,trC(state[1]), 250,250);
		}else if(state[0]==0){
			moveSmooth(trC(state[0]-1), 4,trC(state[1]), 250,0);
			moveSmooth(trC(state[0]), 4,trC(state[1]), 250,250);
		}else if(state[1]==0){
			moveSmooth(trC(state[0]), 4,trC(state[1]-1), 250,0);
			moveSmooth(trC(state[0]), 4,trC(state[1]), 250,250);
		}
	}else{
		moveSmooth(trC(state[0]), 4,trC(state[1]), 250,0);
	}
	laststep = state;

	step += 1;
}
