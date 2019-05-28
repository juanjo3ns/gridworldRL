var csv_files = loadCSV();

var csv = 0;
var step = 1;

csvData = getData(csv_files[0]);

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
	}

	moveSmooth(trC(csvData[step][0]), 4,trC(csvData[step][1]), 500);

	step += 1;
}
