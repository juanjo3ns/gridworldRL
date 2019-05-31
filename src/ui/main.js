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
	var csvfile = getURL(710);
	csvData = getData(csvfile);
	if (!init){
		addStats(csvData);
	}else{
		updateStats(csvData);
	}
	scene.getObjectByName("text_parent").visible = false;
	intervalID = setInterval(runEvaluations, 200, csvData);
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
	csvfile = getURL(epoch);
	csvData = getData(csvfile);
	updateStats(csvData);
	var counter = 1;
	intervalID = setInterval(runEvaluations, 200, csvData);

}

function getURL(epoch){
	url = "src/csvdata/1.0.1.dueling-ddqn/coords_"
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

function moveSmooth(x,y,z, time, delay){
	new TWEEN.Tween(scene.getObjectByName("agent").position)
	.to(scene.getObjectByName("agent").position.clone().set(x,y,z), time)
	.delay(delay)
	.easing(TWEEN.Easing.Quadratic.Out)
	.start();

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
	moveSmooth();
	addButtons();
	addEpochs();
	scene.add(gparent);
	counter = 1;
	runDefaultEpisode();

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
				scene.getObjectByName("text_parent").visible = !current;
				if (current){
					intersects1[0].object.material.color.set('grey');
					clearInterval(intervalID);
					runDefaultEpisode(true);
					backtoGreen();
				}else{
					intersects1[0].object.material.color.set('white');
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
