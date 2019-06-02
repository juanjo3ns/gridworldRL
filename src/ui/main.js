var renderer, scene, camera;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var gparent = new THREE.Object3D();
var intervalID;
gparent.name = "text_parent";

var lavaArray = JSON.stringify([
  [0, 6],
  [1, 6],
  [2, 6],
  [3, 6],
  [4, 6],
  [5, 6],
  [9, 2],
  [8, 2],
  [7, 2],
  [6, 2],
  [5, 2],
  [4, 2]
]);
var terminalState = JSON.stringify([[9,0]]);

init();
animate();

function runDefaultEpisode(init=false){
	var csvfile = getURL("coords", 710);
	csvData = getData(csvfile);
	if (!init){
		addStats(csvData);
	}else{
		updateStats(csvData);
	}
	scene.getObjectByName("text_parent").visible = false;
	intervalID = setInterval(runEvaluations, 200, csvData);
}

function switchOpacity(){
	if (scene.getObjectByName("cells").getObjectByName("00").material.transparent){
		for (var i = 0; i < 10; i++) {
			for (var j = 0; j < 10; j++) {
				scene.getObjectByName("cells").getObjectByName(i.toString()+j.toString()).material.transparent = false;
				scene.getObjectByName("cells").getObjectByName(i.toString()+j.toString()).material.opacity = 1;
			}
		}
	}else{
		for (var i = 0; i < 10; i++) {
			for (var j = 0; j < 10; j++) {
				scene.getObjectByName("cells").getObjectByName(i.toString()+j.toString()).material.transparent = true;
				scene.getObjectByName("cells").getObjectByName(i.toString()+j.toString()).material.opacity = 0.3;
			}
		}
	}
}

//Set blue color for all the normal cells
function paintBoard(state){
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			if (lavaArray.indexOf(JSON.stringify([i, j])) != -1){
				scene.getObjectByName("cells").getObjectByName(i.toString()+j.toString()).material.color = new THREE.Color(0xff0000);
			}else if (terminalState.indexOf(JSON.stringify([i,j])) != -1){
				scene.getObjectByName("cells").getObjectByName(i.toString()+j.toString()).material.color = new THREE.Color(0x000000);
			}else{
				scene.getObjectByName("cells").getObjectByName(i.toString()+j.toString()).material.color = new THREE.Color(0x0000ff);
			}
		}
	}
	scene.getObjectByName("cells").getObjectByName(state[0].toString()+state[1].toString()).material.color = new THREE.Color(0xffffff);;
}


function loadCSV(){
	url = "src/csvdata/1.0.1.dueling-ddqn/coords_"
	var csv_files = new Array();
	var num_files = 80;
	for (var i = 0; i < num_files; i++) {
		csv_files.push(url.concat((i*10).toString()).concat('.csv'));
	}
	return csv_files;
}

function changeCSV(epoch){
	epoch = (parseInt(epoch)*10).toString();
	clearInterval(intervalID);
	csvfile = getURL("coords", epoch);
	csvData = getData(csvfile);
	updateStats(csvData);
	changeValues(epoch);
	setSteps(epoch);
	var counter = 1;
	intervalID = setInterval(runEvaluations, 200, csvData);

}

function getURL(data,epoch){
	url = "src/csvdata/" + data +"/1.0.1.dueling-ddqn/"+ data + "_"
	return url.concat(epoch).concat('.csv');
}

function getData(csv_file){
	var url = csv_file;
	var request = new XMLHttpRequest();
	request.open("GET", url, false);
	request.send(null);

	var csvData = new Array();
	var jsonObject = request.responseText.split(/\r?\n|\r/);
	for (var t = 0; t < jsonObject.length; t++) {
		csvData.push(jsonObject[t].split(','));
	}
	return csvData;
}


function init() {
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  var width = window.innerWidth;
  var height = window.innerHeight;

  renderer.setSize(width, height);
  renderer.setClearColor(0x140b33, 1);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(55, width / height, 1, 10000);
  camera.position.set(10, 95, 140);
	camera.name = "camera";
  scene.add(camera)

  //LIGHTNING
  light = new THREE.PointLight(0xffffff, 1, 4000);
  light.position.set(50, 0, 0);
  light_two = new THREE.PointLight(0xffffff, 1, 4000);
  light_two.position.set(-100, 800, 800);
  lightAmbient = new THREE.AmbientLight(0x404040);
  scene.add(light, light_two, lightAmbient);


  // OBJECTS
	showStats();
  showBoard();
  showAgent();
	moveAgent();
	addButtons();
	addEpochs();
	scene.add(gparent);
	counter = 1;
	runDefaultEpisode();
	addStateValues();
	addStepsBoard();

	document.addEventListener( 'click', onDocumentMouseDown , false );
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();
};


function showBoard() {
  cells = new THREE.Object3D();
	cells.name = 'cells';
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
			var rotate = false, offset = 0;

      if (lavaArray.indexOf(JSON.stringify([i, j])) != -1) {
				lava = getLava();
				cell = lava[0];
				material = lava[1];
				rotate = true;
				offset = 5;
			} else if (terminalState.indexOf(JSON.stringify([i,j])) != -1){
				var cell = new THREE.BoxGeometry(10, 2, 10);
				var material = new THREE.MeshPhongMaterial({
					color: 'black',
					flatShading: THREE.FlatShading
				});
      } else {
				var cell = new THREE.BoxGeometry(10, 2, 10);
        var material = new THREE.MeshPhongMaterial({
          color: 'blue',
          flatShading: THREE.FlatShading
        });
      }

			var edges = new THREE.EdgesGeometry(cell);
			var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
				color: 'black'
			}));

      var b = new THREE.Mesh(cell, material);
			b.name = i.toString()+j.toString();
			if (rotate){
				b.rotation.x = Math.PI/2;
			}
      b.position.x = -45 + i * 10-offset;
      b.position.y = 0;
      b.position.z = -45 + j * 10-offset;
      b.add(line);
      cells.add(b);
    }
  }
  scene.add(cells);
}

function showAgent() {
  var geometry = new THREE.SphereGeometry(5, 12, 6, 4, 6.3, 1, 6.3);
  var material = new THREE.MeshBasicMaterial({
    color: 0xFFDEB2
  });
  var sphere = new THREE.Mesh(geometry, material);
  var edges = new THREE.EdgesGeometry(geometry);
  var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
    color: 'black'
  }));
	sphere.name = 'agent';
  sphere.add(line);
  scene.add(sphere);
  sphere.position.set(45, 4, 45);
}
function onDocumentMouseDown( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    var intersects1 = raycaster.intersectObjects( scene.children );
		var intersects2 = raycaster.intersectObjects( scene.getObjectByName('text_parent').children );
    if ( intersects2.length > 0 ) {
			intersects = raycaster.intersectObjects( scene.getObjectByName('text_parent').children );
			if (buttons.indexOf(intersects[0].object.name) != -1){
				backtoGreen();
				intersects[0].object.material.color.set("red");
				changeCSV(intersects[0].object.name);
			}
		}else if(intersects1.length > 0){
			if (intersects1[0].object.name == 'switch'){
				var current = scene.getObjectByName("text_parent").visible;
				switchOpacity();
				scene.getObjectByName("text_parent").visible = !current;
				if (current){
					intersects1[0].object.material.color.set('grey');
					clearInterval(intervalID);
					runDefaultEpisode(true);
					backtoGreen();
					scene.getObjectByName("steps").visible = false;
				}else{
					intersects1[0].object.material.color.set('white');
					moveCamera(-1.48,  30.19, 166.77, 1000);
					scene.getObjectByName("steps").visible = true;
					rotateSteps(1000);
				}
			}
		}
}

function animate() {
	requestAnimationFrame(animate);
  controls.update();
	TWEEN.update();
	render();
}

function render() {
  renderer.render(scene, camera);

}
