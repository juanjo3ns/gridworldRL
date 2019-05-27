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



init();
animate();

function setUpTween(){
	origin = { x : 45, y: 4, z: 45 };
	destination = { x : -45, y: 4, z: -45 };

	var update = function(){
		scene.children[5].position.x = destination.x;
		scene.children[5].position.y = destination.y;
		scene.children[5].position.z = destination.z;
	}

	var tween = new TWEEN.Tween(origin).to(destination, 2000).easing(TWEEN.Easing.Quadratic.Out).onUpdate(update).start();
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
  camera.position.set(80, 80, 80);
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
	setUpTween();

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
      var cell = new THREE.BoxGeometry(10, 2, 10);
      var edges = new THREE.EdgesGeometry(cell);
      var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
        color: 'black'
      }));

      if (lavaArray.indexOf(JSON.stringify([i, j])) != -1) {
        var material = new THREE.MeshPhongMaterial({
          color: 'red',
          flatShading: THREE.FlatShading
        });
      } else {
        var material = new THREE.MeshPhongMaterial({
          color: 'blue',
          flatShading: THREE.FlatShading
        });
      }
      var b = new THREE.Mesh(cell, material);
      b.position.x = -45 + i * 10;
      b.position.y = 0;
      b.position.z = -45 + j * 10;
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
	render();
	requestAnimationFrame(animate);
  controls.update();
	TWEEN.update();
}

function render() {
  renderer.render(scene, camera);

}

function pathCSV() {
  url = "/home/juanjo/Documents/demogrid/src/csvdata/dueling-final2/coords_"
  var csv_files = new Array();
  var num_files = 15;
  for (var i = 0; i < num_files; i++) {
    csv_files.push(url.concat((i * 20).toString()).concat('.csv'));
  }
  return csv_files;
}
