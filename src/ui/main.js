var renderer, scene, camera;
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

function loadCSV(){
	url = "src/csvdata/1.0.1.dueling-ddqn/coords_"
	var csv_files = new Array();
	var num_files = 80;
	for (var i = 0; i < num_files; i++) {
		csv_files.push(url.concat((i*10).toString()).concat('.csv'));
	}
	return csv_files;
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
	new TWEEN.Tween(scene.children[5].position)
	.to(scene.children[5].position.clone().set(x,y,z), time)
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
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.set(10, 60, 130);
  scene.add(camera)

  //LIGHTNING
  light = new THREE.PointLight(0xffffff, 1, 4000);
  light.position.set(50, 0, 0);
  light_two = new THREE.PointLight(0xffffff, 1, 4000);
  light_two.position.set(-100, 800, 800);
  lightAmbient = new THREE.AmbientLight(0x404040);
  scene.add(light, light_two, lightAmbient);


  // OBJECTS
  showBoard();
  showAgent();
	moveSmooth();

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

function animate() {
	requestAnimationFrame(animate);
  controls.update();
	TWEEN.update();
	render();
}

function render() {
  renderer.render(scene, camera);

}
